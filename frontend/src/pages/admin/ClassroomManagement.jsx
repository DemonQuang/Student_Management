import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classroomService } from '../../services/classroom.service';
import { departmentService } from '../../services/department.service';
import { studentService } from '../../services/student.service';

const ClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add/Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Student list modal state
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  useEffect(() => {
    if (showModal || showStudentsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal, showStudentsModal]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [roomName, setRoomName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [roomActive, setRoomActive] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomStudents, setRoomStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addEmailError, setAddEmailError] = useState('');
  const [addEmailSuccess, setAddEmailSuccess] = useState('');

  useEffect(() => {
    fetchClassroomsAndDeps();
  }, []);

  const fetchClassroomsAndDeps = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [classroomsRes, deptsRes] = await Promise.all([
        classroomService.getAll(),
        departmentService.getAll(),
      ]);
      
      setClassrooms(classroomsRes.data || []);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi kết nối cơ sở dữ liệu phòng học.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setRoomName('');
    setDeptId(departments[0]?.id || '');
    setRoomActive(true);
    setFieldErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    setEditId(room.id);
    setRoomName(room.name);
    setDeptId(room.departmentId);
    setRoomActive(room.active !== undefined && room.active !== null ? room.active : true);
    setFieldErrors({});
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errors = {};

    if (!roomName.trim()) errors.roomName = 'Vui lòng nhập tên phòng học';
    if (!deptId) errors.deptId = 'Vui lòng chọn khoa phụ trách';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editId) {
        await classroomService.update(editId, roomName.trim(), deptId, roomActive);
        setSuccessMsg('Cập nhật phòng học thành công.');
      } else {
        await classroomService.create(roomName.trim(), deptId, roomActive);
        setSuccessMsg('Thêm mới phòng học thành công.');
      }
      setFieldErrors({});
      setShowModal(false);
      fetchClassroomsAndDeps();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lưu thông tin phòng học thất bại.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng học này? Thao tác này sẽ thất bại nếu có sinh viên đang được xếp vào lớp.')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await classroomService.delete(id);
      setSuccessMsg('Xóa phòng học thành công.');
      fetchClassroomsAndDeps();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Xóa phòng học thất bại. Vui lòng đảm bảo không có sinh viên (đang học hoặc bảo lưu) xếp tại lớp này.');
    }
  };

  const getDeptName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Bộ môn quản lý chung';
  };

  const handleViewStudents = async (room) => {
    setSelectedRoom(room);
    setAddEmail('');
    setAddEmailError('');
    setAddEmailSuccess('');
    setLoadingStudents(true);
    setShowStudentsModal(true);
    try {
      const res = await studentService.filter({ classroomId: room.id });
      setRoomStudents(res.data?.content || []);
    } catch (err) {
      setRoomStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddStudentByEmail = async (e) => {
    e.preventDefault();
    setAddEmailError('');
    setAddEmailSuccess('');

    if (!addEmail.trim()) {
      setAddEmailError('Vui lòng nhập email sinh viên');
      return;
    }

    try {
      const res = await studentService.filter({ email: addEmail.trim() });
      const students = res.data?.content || [];
      if (students.length === 0) {
        setAddEmailError('Không tìm thấy sinh viên với email này');
        return;
      }

      const student = students[0];
      const currentIds = student.classroomIds || [];
      if (currentIds.includes(selectedRoom.id)) {
        setAddEmailError('Sinh viên này đã ở trong lớp học này');
        return;
      }

      const updatedIds = [...currentIds, selectedRoom.id];
      await studentService.update(student.id, {
        studentCode: student.studentCode,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        birthday: student.birthday,
        gender: student.gender,
        address: student.address || '',
        status: student.status,
        departmentId: selectedRoom.departmentId,
        classroomIds: updatedIds,
        avatar: student.avatar || '',
      });

      setAddEmailSuccess('Thêm sinh viên vào lớp thành công');
      setAddEmail('');

      // Refresh student list
      const updatedRes = await studentService.filter({ classroomId: selectedRoom.id });
      setRoomStudents(updatedRes.data?.content || []);

      // Refresh classroom stats
      fetchClassroomsAndDeps();
    } catch (err) {
      setAddEmailError(err.message || 'Lỗi thêm sinh viên vào lớp');
    }
  };

  const handleRemoveStudent = async (student) => {
    if (!window.confirm(`Xóa sinh viên ${student.fullName} khỏi lớp ${selectedRoom.name}?`)) return;
    try {
      const updatedIds = (student.classroomIds || []).filter(id => id !== selectedRoom.id);
      await studentService.update(student.id, {
        studentCode: student.studentCode,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        birthday: student.birthday,
        gender: student.gender,
        address: student.address || '',
        status: student.status,
        departmentId: student.departmentId,
        classroomIds: updatedIds,
        avatar: student.avatar || '',
      });

      setRoomStudents(prev => prev.filter(s => s.id !== student.id));
      fetchClassroomsAndDeps();
    } catch (err) {
      setAddEmailError(err.message || 'Lỗi xóa sinh viên khỏi lớp');
    }
  };

  // Filter classrooms based on search
  const filteredRooms = classrooms.filter(room => {
    return room.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
           getDeptName(room.departmentId).toLowerCase().includes(searchKeyword.toLowerCase());
  });

  return (
    <div className="space-y-lg pb-2xl text-left">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-lg">
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Danh mục phòng học</h2>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
            <input 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="input-field w-full pl-10 pr-4 py-1.5 bg-white border border-border rounded-xl text-body-sm outline-none focus:ring-1 focus:ring-primary" 
              placeholder="Tìm kiếm phòng học..." 
              type="text"
            />
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 px-lg py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-fast active:scale-95 shadow-soft"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Thêm phòng học</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-md bg-danger/5 text-danger rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-md bg-success/10 text-success rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 md:col-span-3 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">meeting_room</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số phòng</p>
              <p className="text-2xl font-bold text-white mt-0.5">{classrooms.length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">meeting_room</span>
            <span>Phòng học toàn hệ thống</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">check_circle</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Đang hoạt động</p>
              <p className="text-2xl font-bold text-white mt-0.5">{classrooms.filter(r => r.active !== false).length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Sẵn sàng giảng dạy</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-rose-600 to-rose-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">pause_circle</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Ngừng hoạt động</p>
              <p className="text-2xl font-bold text-white mt-0.5">{classrooms.filter(r => r.active === false).length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">pause_circle</span>
            <span>Tạm ngưng sử dụng</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-orange-600 to-orange-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">groups</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số học viên</p>
              <p className="text-2xl font-bold text-white mt-0.5">{classrooms.reduce((sum, r) => sum + (r.studentCount || 0), 0)}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            <span>Đang theo học</span>
          </p>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div className="text-center py-2xl">
          <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
          <p className="mt-md text-text-secondary font-medium">Đang tải danh sách phòng học...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-2xl text-text-secondary bg-white border border-border rounded-2xl">
          <span className="material-symbols-outlined !text-[48px]">meeting_room_disabled</span>
          <p className="mt-md font-medium">Không tìm thấy phòng học nào khớp với bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-gutter">
          {filteredRooms.map(room => {
            const isActive = room.active !== false;
            return (
              <div 
                key={room.id} 
                className={`col-span-12 md:col-span-4 rounded-2xl border shadow-card hover:shadow-elevated transition-all duration-normal group overflow-hidden ${
                  isActive ? 'bg-white border-border' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`px-lg py-md flex items-center justify-between ${
                  isActive ? 'bg-primary/5 border-b border-border/30' : 'bg-slate-100 border-b border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-success' : 'bg-slate-400'}`}></span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-success' : 'text-danger'}`}>
                      {isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEdit(room)}
                      className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-text-secondary hover:text-primary transition-all duration-fast"
                      title="Sửa phòng học"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-text-secondary hover:text-error transition-all duration-fast"
                      title="Xóa phòng học"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-lg">
                  <h3 className="font-title-md text-title-md text-primary font-bold">{room.name}</h3>
                  <p className="text-body-sm text-text-secondary mt-xs">{getDeptName(room.departmentId)}</p>
                  <div className="flex items-center justify-between mt-md pt-md border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <span className="material-symbols-outlined text-[18px]">groups</span>
                      <span className="font-semibold">{room.studentCount || 0}</span>
                      <span className="text-xs">học viên</span>
                    </div>
                    <button
                      onClick={() => handleViewStudents(room)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      Xem sinh viên
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Classroom Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-2xl shadow-elevated border border-border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-lg py-md border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-headline-lg text-title-md text-primary font-bold">
                {editId ? 'Chỉnh sửa phòng học' : 'Thêm mới phòng học'}
              </h3>
              <button 
                onClick={() => { setShowModal(false); setFieldErrors({}); }}
                className="material-symbols-outlined text-text-secondary hover:text-primary"
              >
                close
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="p-lg space-y-md">
                
                {/* Classroom Name */}
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Tên / Mã phòng học *</label>
                  <input 
                    value={roomName}
                    onChange={e => {
                      setRoomName(e.target.value);
                      if (fieldErrors.roomName) setFieldErrors(prev => ({ ...prev, roomName: '' }));
                    }}
                    placeholder="Ví dụ: Giảng đường A-102" 
                    className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.roomName ? 'border-red-500' : 'border-border'}`}
                    type="text"
                  />
                  {fieldErrors.roomName && <p className="text-red-500 text-xs mt-1">{fieldErrors.roomName}</p>}
                </div>

                {/* Department Selection */}
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Khoa phụ trách *</label>
                  <div className="relative">
                    <select 
                      value={deptId}
                      onChange={e => {
                        setDeptId(e.target.value);
                        if (fieldErrors.deptId) setFieldErrors(prev => ({ ...prev, deptId: '' }));
                      }}
                      className={`input-field w-full appearance-none bg-white border rounded-xl pl-md pr-9 py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.deptId ? 'border-red-500' : 'border-border'}`}
                    >
                      <option value="">Chọn khoa phụ trách</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
                  </div>
                  {fieldErrors.deptId && <p className="text-red-500 text-xs mt-1">{fieldErrors.deptId}</p>}
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between py-sm">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Trạng thái</label>
                  <button
                    type="button"
                    onClick={() => setRoomActive(!roomActive)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-fast ${
                      roomActive ? 'bg-success' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      roomActive ? 'translate-x-5' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>
                <p className="text-xs text-text-secondary -mt-md">
                  {roomActive ? 'Phòng đang hoạt động, có thể xếp lớp' : 'Phòng tạm ngưng, không xếp lớp mới'}
                </p>

              </div>

              {Object.keys(fieldErrors).length > 0 && (
                <div className="mx-lg mb-md p-md bg-danger/5 border border-danger/20 rounded-xl text-sm flex items-center gap-2 text-danger">
                  <span className="material-symbols-outlined text-danger">error</span>
                  <span>Vui lòng kiểm tra lại các trường bắt buộc.</span>
                </div>
              )}

              {/* Controls */}
              <div className="px-lg py-md border-t border-border bg-slate-50 flex justify-end space-x-sm">
                <button 
                  type="button"
                  onClick={() => { setShowModal(false); setFieldErrors({}); }}
                  className="btn-secondary px-md py-2 border border-border hover:bg-slate-200 rounded-xl font-title-md text-sm text-text-secondary transition-all duration-fast font-semibold active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="btn-primary px-md py-2 bg-primary text-white hover:opacity-90 rounded-xl font-title-md text-sm transition-all duration-fast font-semibold active:scale-95 shadow-soft"
                >
                  Lưu thông tin phòng
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {/* Student List Modal */}
      {showStudentsModal && selectedRoom && createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowStudentsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Lớp học</p>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedRoom.name}</h3>
              </div>
              <button onClick={() => setShowStudentsModal(false)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Add by email */}
            <form onSubmit={handleAddStudentByEmail} className="px-6 py-4 border-b border-slate-100">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thêm sinh viên bằng email</label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="email"
                  value={addEmail}
                  onChange={e => { setAddEmail(e.target.value); setAddEmailError(''); setAddEmailSuccess(''); }}
                  placeholder="Nhập email sinh viên..."
                  className="flex-1 input-field"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Thêm
                </button>
              </div>
              {addEmailError && <p className="text-xs text-red-600 mt-1">{addEmailError}</p>}
              {addEmailSuccess && <p className="text-xs text-emerald-600 mt-1">{addEmailSuccess}</p>}
            </form>

            {/* Student list */}
            {loadingStudents ? (
              <div className="px-6 py-8 text-center">
                <span className="animate-spin material-symbols-outlined !text-[32px] text-primary inline-block">sync</span>
                <p className="text-sm text-slate-500 mt-2">Đang tải...</p>
              </div>
            ) : roomStudents.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <span className="material-symbols-outlined !text-[40px] text-slate-300">group_off</span>
                <p className="text-sm text-slate-500 mt-2">Chưa có sinh viên nào trong lớp này.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left table-col-divider">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Sinh viên</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Mã SV</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roomStudents.map(s => (
                      <tr key={s.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                              {s.avatar ? <img src={s.avatar} alt="" className="w-full h-full object-cover" /> : (s.fullName ? s.fullName.split(' ').pop().substring(0, 2).toUpperCase() : 'SV')}
                            </div>
                            <span className="text-sm font-semibold text-slate-800">{s.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600 font-mono">{s.studentCode}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{s.email}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                            s.status === 'GRADUATED' ? 'bg-blue-50 text-blue-700' :
                            s.status === 'SUSPENDED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              s.status === 'ACTIVE' ? 'bg-emerald-500' :
                              s.status === 'GRADUATED' ? 'bg-blue-500' :
                              s.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                            {s.status === 'ACTIVE' ? 'Đang học' : s.status === 'GRADUATED' ? 'Tốt nghiệp' : s.status === 'SUSPENDED' ? 'Đình chỉ' : 'Bảo lưu'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => handleRemoveStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa khỏi lớp"
                          >
                            <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ClassroomManagement;
