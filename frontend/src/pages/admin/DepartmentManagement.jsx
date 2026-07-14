import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { departmentService } from '../../services/department.service';
import { classroomService } from '../../services/classroom.service';
import { studentService } from '../../services/student.service';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add/Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [deptName, setDeptName] = useState('');

  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [deptRes, classRes, studentRes] = await Promise.all([
        departmentService.getAll(),
        classroomService.getAll(),
        studentService.getAll(0, 10000),
      ]);
      setDepartments(deptRes.data || []);
      setAllClassrooms(classRes.data || []);
      setAllStudents(studentRes.data?.content || []);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi tải danh sách khoa đào tạo.');
    } finally {
      setLoading(false);
    }
  };

  const getClassroomCount = (deptId) => {
    return allClassrooms.filter(c => c.departmentId === deptId).length;
  };

  const getStudentCount = (deptId) => {
    return allStudents.filter(s => s.departmentId === deptId).length;
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setDeptName('');
    setFieldErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setEditId(dept.id);
    setDeptName(dept.name);
    setFieldErrors({});
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errors = {};

    if (!deptName.trim()) errors.deptName = 'Vui lòng nhập tên khoa đào tạo';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editId) {
        await departmentService.update(editId, deptName.trim());
        setSuccessMsg('Cập nhật khoa thành công.');
      } else {
        await departmentService.create(deptName.trim());
        setSuccessMsg('Thêm mới khoa thành công.');
      }
      setFieldErrors({});
      setShowModal(false);
      fetchDepartments();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi xảy ra khi lưu thông tin khoa.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoa này? Yêu cầu sẽ thất bại nếu có lớp học liên kết.')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await departmentService.delete(id);
      setSuccessMsg('Xóa khoa thành công.');
      fetchDepartments();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Xóa khoa thất bại. Đảm bảo rằng không còn lớp học hoặc sinh viên nào liên kết với khoa này.');
    }
  };

  const filteredDepts = departments.filter(dept => 
    dept.name.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="space-y-lg text-left">
      {/* Breadcrumbs & Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <nav className="flex items-center text-label-sm text-text-secondary mb-2">
            <span>Danh mục</span>
            <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
            <span className="text-primary font-bold">Khoa đào tạo</span>
          </nav>
          <h2 className="text-display-lg font-display-lg text-text-primary font-bold">Quản lý khoa đào tạo</h2>
        </div>
        <div className="flex items-center gap-sm">
          <button className="btn-secondary flex items-center gap-2 px-md py-2 border border-border rounded-xl text-text-primary hover:bg-slate-50 transition-all duration-fast font-semibold text-sm">
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span>In danh sách</span>
          </button>
          <button 
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 px-lg py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all duration-fast font-semibold text-sm shadow-soft"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm mới khoa</span>
          </button>
        </div>
      </div>

      {/* Alert Banners */}
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
        <div className="col-span-12 md:col-span-4 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-violet-600 to-violet-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">domain</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số khoa</p>
              <p className="text-2xl font-bold text-white mt-0.5">{departments.length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">domain</span>
            <span>Khoa đào tạo</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">meeting_room</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số lớp</p>
              <p className="text-2xl font-bold text-white mt-0.5">{allClassrooms.length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">meeting_room</span>
            <span>Lớp học trực thuộc</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]">groups</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số sinh viên</p>
              <p className="text-2xl font-bold text-white mt-0.5">{allStudents.length}</p>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            <span>Đang theo học</span>
          </p>
        </div>
      </div>

      {/* Main Table Segment */}
      <div className="card !p-0 overflow-hidden flex flex-col">
        {/* Filters bar */}
        <div className="p-md border-b border-border flex flex-col md:flex-row justify-between items-center gap-md bg-slate-50">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">filter_list</span>
            <input 
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="input-field w-full bg-white border border-border rounded-xl pl-10 pr-md py-2 text-body-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              placeholder="Lọc theo tên khoa..." 
              type="text"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-2xl">
              <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
              <p className="mt-md text-text-secondary font-medium">Đang kết nối cơ sở dữ liệu khoa...</p>
            </div>
          ) : filteredDepts.length === 0 ? (
            <div className="text-center py-2xl text-text-secondary">
              <span className="material-symbols-outlined !text-[48px]">domain_disabled</span>
              <p className="mt-md font-medium">Không tìm thấy khoa đào tạo nào khớp với từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-body-sm table-col-divider">
              <thead className="bg-slate-50 text-text-secondary">
                <tr className="border-b border-border">
                  <th className="table-cell px-lg py-md text-label-sm font-bold uppercase tracking-wider">Tên khoa</th>
                  <th className="table-cell px-lg py-md text-label-sm font-bold uppercase tracking-wider text-center">Số lớp</th>
                  <th className="table-cell px-lg py-md text-label-sm font-bold uppercase tracking-wider text-center">Số sinh viên</th>
                  <th className="table-cell px-lg py-md text-label-sm font-bold uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-primary font-medium">
                {filteredDepts.map((dept) => {
                  const classCount = getClassroomCount(dept.id);
                  const studentCount = getStudentCount(dept.id);
                  return (
                    <tr key={dept.id} className="table-row-hover transition-all duration-fast group">
                      <td className="px-lg py-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">account_balance</span>
                          </div>
                          <span className="font-title-md text-title-md text-primary font-bold">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-lg text-center">
                        <span className="font-title-md text-title-md text-primary font-bold">{classCount}</span>
                        <span className="text-label-sm text-text-secondary ml-1">lớp</span>
                      </td>
                      <td className="px-lg py-lg text-center">
                        <span className="font-title-md text-title-md text-primary font-bold">{studentCount}</span>
                        <span className="text-label-sm text-text-secondary ml-1">SV</span>
                      </td>
                      <td className="px-lg py-lg text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleOpenEdit(dept)}
                            className="p-2 hover:bg-slate-100 rounded-full text-text-secondary hover:text-primary transition-all duration-fast"
                            title="Sửa khoa"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(dept.id)}
                            className="p-2 hover:bg-red-50 rounded-full text-error transition-all duration-fast"
                            title="Xóa khoa"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Department Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-2xl shadow-elevated border border-border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-lg py-md border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-headline-lg text-title-md text-primary font-bold">
                {editId ? 'Chỉnh sửa tên khoa đào tạo' : 'Tạo mới khoa đào tạo'}
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
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Tên khoa đào tạo *</label>
                  <input 
                    value={deptName}
                    onChange={e => {
                      setDeptName(e.target.value);
                      if (fieldErrors.deptName) setFieldErrors(prev => ({ ...prev, deptName: '' }));
                    }}
                    placeholder="Ví dụ: Khoa Công nghệ Thông tin" 
                    className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.deptName ? 'border-red-500' : 'border-border'}`}
                    type="text"
                  />
                  {fieldErrors.deptName && <p className="text-red-500 text-xs mt-1">{fieldErrors.deptName}</p>}
                </div>
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
                  Lưu thông tin khoa
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DepartmentManagement;
