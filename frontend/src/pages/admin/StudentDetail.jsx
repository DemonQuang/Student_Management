import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { departmentService } from '../../services/department.service';
import { classroomService } from '../../services/classroom.service';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [student, setStudent] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    studentCode: '',
    fullName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'MALE',
    address: '',
    status: 'ACTIVE',
    departmentId: '',
    classroomIds: [],
    avatar: '',
  });
  const [previewAvatar, setPreviewAvatar] = useState('');

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await handleFileToBase64(file);
      setFormData(p => ({ ...p, avatar: base64 }));
      setPreviewAvatar(base64);
    }
  };

  // Fetch Student data & Metadata
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const [studentRes, deptsRes, classroomsRes] = await Promise.all([
          studentService.getById(id),
          departmentService.getAll(),
          classroomService.getAll(),
        ]);

        const studentData = studentRes.data;
        setStudent(studentData);
        setDepartments(deptsRes.data || []);
        setClassrooms(classroomsRes.data || []);

        // Prepopulate edit form
        setFormData({
          studentCode: studentData.studentCode || '',
          fullName: studentData.fullName || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          birthday: studentData.birthday || '',
          gender: studentData.gender || 'MALE',
          address: studentData.address || '',
          status: studentData.status || 'ACTIVE',
          departmentId: studentData.departmentId || '',
          classroomIds: studentData.classroomIds || [],
          avatar: studentData.avatar || '',
        });
        setPreviewAvatar(studentData.avatar || '');
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi tải thông tin sinh viên.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  // Update filtered classrooms when department changes in form
  useEffect(() => {
    if (formData.departmentId) {
      const filtered = classrooms.filter(c => c.departmentId === formData.departmentId);
      setFilteredClassrooms(filtered);
      const validIds = (formData.classroomIds || []).filter(id => filtered.some(c => c.id === id));
      if (validIds.length !== (formData.classroomIds || []).length) {
        setFormData(prev => ({ ...prev, classroomIds: validIds }));
      }
    } else {
      setFilteredClassrooms([]);
    }
  }, [formData.departmentId, classrooms]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.studentCode.trim() || !formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại phải có độ dài đúng 10 chữ số.');
      return;
    }

    try {
      const res = await studentService.update(id, formData);
      setStudent(res.data);
      setIsEditing(false);
      setSuccessMsg('Cập nhật hồ sơ sinh viên thành công.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi cập nhật thông tin sinh viên.');
    }
  };

  const getDeptName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Chưa rõ';
  };

  const getClassroomName = (ids) => {
    if (!ids || ids.length === 0) return 'Chưa xếp lớp';
    return ids.map(id => { const cls = classrooms.find(c => c.id === id); return cls ? cls.name : null; }).filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="text-center py-2xl">
        <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
        <p className="mt-md text-text-secondary font-medium">Đang tải hồ sơ sinh viên...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-2xl text-text-secondary">
        <span className="material-symbols-outlined !text-[48px]">person_off</span>
        <p className="mt-md text-text-secondary font-medium">Không tìm thấy hồ sơ sinh viên.</p>
        <button onClick={() => navigate('/admin/students')} className="mt-md px-md py-2 bg-primary text-white rounded">
          Quay lại danh sách sinh viên
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex items-center gap-xs text-text-secondary font-label-sm text-label-sm mb-1">
            <button onClick={() => navigate('/admin/students')} className="hover:underline">Sinh viên</button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary font-semibold">Hồ sơ sinh viên</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Chi tiết hồ sơ sinh viên</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-text-primary rounded-xl hover:bg-background transition-colors font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined">print</span>
            In bảng điểm
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity font-label-sm text-label-sm shadow-card font-semibold"
          >
            <span className="material-symbols-outlined">{isEditing ? 'close' : 'edit'}</span>
            {isEditing ? 'Hủy chỉnh sửa' : 'Sửa thông tin'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-md bg-danger/10 text-danger rounded-xl text-sm flex items-center gap-2">
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

      {/* Profile Card and Detail Tabs Container */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-md">
                <div className="w-32 h-32 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl border-4 border-border overflow-hidden">
                  {student.avatar ? (
                    <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    student.fullName ? student.fullName.split(' ').pop().substring(0, 2).toUpperCase() : 'SV'
                  )}
                </div>
                <span className={`absolute bottom-1 right-1 w-6 h-6 border-4 border-white rounded-full ${
                  student.status === 'ACTIVE' ? 'bg-emerald-500' :
                  student.status === 'GRADUATED' ? 'bg-blue-500' :
                  student.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-amber-500'
                }`}></span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-primary font-bold">{student.fullName}</h3>
              <p className="font-body-md text-body-md text-text-secondary mb-base">{student.studentCode}</p>
              <span className={`badge font-label-sm text-label-sm ${
                student.status === 'ACTIVE' ? 'bg-success/10 text-success' :
                student.status === 'GRADUATED' ? 'bg-primary/10 text-primary' :
                student.status === 'SUSPENDED' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
              }`}>
                {student.status === 'ACTIVE' ? 'Đang học' :
                 student.status === 'GRADUATED' ? 'Tốt nghiệp' :
                 student.status === 'SUSPENDED' ? 'Đình chỉ' : 'Bảo lưu'}
              </span>
            </div>
            
            <div className="mt-xl space-y-md border-t border-border pt-lg">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-text-secondary">Khoa đào tạo</span>
                <span className="font-body-sm text-body-sm text-primary font-semibold">{getDeptName(student.departmentId)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-text-secondary">Lớp học</span>
                <span className="font-body-sm text-body-sm text-primary font-semibold">{getClassroomName(student.classroomIds)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-text-secondary">Giới tính</span>
                <span className="font-body-sm text-body-sm text-primary font-semibold capitalize">
                  {student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-text-secondary">Ngày sinh</span>
                <span className="font-body-sm text-body-sm text-primary font-semibold">{student.birthday}</span>
              </div>
            </div>

            <div className="mt-xl grid grid-cols-2 gap-2">
              <div className="bg-background p-md rounded-xl text-center border border-border/30">
                <p className="text-text-secondary font-label-sm text-label-sm">Email</p>
                <p className="text-primary font-body-md text-body-md font-bold truncate">{student.email || '---'}</p>
              </div>
              <div className="bg-background p-md rounded-xl text-center border border-border/30">
                <p className="text-text-secondary font-label-sm text-label-sm">Điện thoại</p>
                <p className="text-primary font-headline-lg text-headline-lg font-bold">{student.phone || '---'}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 text-primary rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined">home</span>
              <span className="font-title-md text-title-md font-bold">Địa chỉ</span>
            </div>
            <p className="font-body-md text-body-md">{student.address || 'Chưa đăng ký địa chỉ'}</p>
          </div>
        </div>

        {/* Right Column: Tabs and Detailed Info */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="card !p-0 overflow-hidden flex flex-col h-full">
            
            {/* Tabs Header */}
            <div className="flex border-b border-border px-6 bg-background">
              <button 
                onClick={() => { setActiveTab('general'); setIsEditing(false); }}
                className={`px-6 py-4 font-label-sm text-label-sm transition-all ${
                  activeTab === 'general' ? 'text-primary border-b-2 border-primary font-bold' : 'text-text-secondary hover:text-primary'
                }`}
              >
                Thông tin chung
              </button>

            </div>

            {/* Tab Body: General Info */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-xl">
                {isEditing ? (
                  /* Edit Mode Form */
                  <form onSubmit={handleSave} className="space-y-md">
                    <h4 className="font-title-md text-title-md text-primary font-bold border-b pb-sm mb-md">Chỉnh sửa thông tin chung</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Họ và tên</label>
                        <input 
                          type="text" 
                          value={formData.fullName} 
                          onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                           required
                         />
                       </div>
                       <div className="space-y-xs">
                         <label className="text-xs font-bold text-text-secondary">Mã sinh viên</label>
                         <input 
                           type="text" 
                           value={formData.studentCode} 
                           onChange={e => setFormData(p => ({ ...p, studentCode: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-xs">
                      <label className="text-xs font-bold text-text-secondary">Ảnh đại diện</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-border flex items-center justify-center overflow-hidden bg-background shrink-0">
                          {(previewAvatar) ? (
                            <img src={previewAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-text-secondary">person</span>
                          )}
                        </div>
                        <label className="px-md py-1.5 border border-border rounded-xl text-xs font-semibold cursor-pointer hover:bg-background">
                          Chọn ảnh
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Email</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                           required
                         />
                       </div>
                       <div className="space-y-xs">
                         <label className="text-xs font-bold text-text-secondary">Số điện thoại (10 chữ số)</label>
                         <input 
                           type="text" 
                           value={formData.phone} 
                           onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Khoa đào tạo</label>
                        <select 
                          value={formData.departmentId} 
                          onChange={e => setFormData(p => ({ ...p, departmentId: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                           required
                         >
                           {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Lớp học</label>
                        <div className={`border border-border rounded-xl px-3 py-2 ${!formData.departmentId ? 'opacity-50' : ''}`}>
                          {!formData.departmentId ? (
                            <p className="text-xs text-text-secondary py-1">Chọn khoa trước</p>
                          ) : filteredClassrooms.length === 0 ? (
                            <p className="text-xs text-text-secondary py-1">Không có lớp học nào</p>
                          ) : (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {filteredClassrooms.map(c => (
                                <label key={c.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-background rounded px-1">
                                  <input 
                                    type="checkbox" 
                                    checked={formData.classroomIds.includes(c.id)}
                                    onChange={e => {
                                      setFormData(p => ({
                                        ...p,
                                        classroomIds: e.target.checked
                                          ? [...p.classroomIds, c.id]
                                          : p.classroomIds.filter(id => id !== c.id)
                                      }));
                                    }}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                  />
                                  <span className="text-sm text-text-primary">{c.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Trạng thái</label>
                        <select 
                          value={formData.status} 
                          onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                         >
                           <option value="ACTIVE">Đang theo học</option>
                          <option value="INACTIVE">Nghỉ học</option>
                          <option value="GRADUATED">Tốt nghiệp</option>
                          <option value="SUSPENDED">Đình chỉ</option>
                        </select>
                      </div>
                      <div className="space-y-xs">
                        <label className="text-xs font-bold text-text-secondary">Địa chỉ thường trú</label>
                        <input 
                          type="text" 
                          value={formData.address} 
                          onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                           className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none"
                         />
                       </div>
                     </div>

                     <div className="flex justify-end gap-2 pt-md border-t mt-lg">
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-md py-2 border border-border rounded-xl font-semibold text-sm hover:bg-background"
                      >
                        Hủy
                      </button>
                      <button 
                        type="submit" 
                        className="px-md py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 shadow-card"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                      <div className="space-y-md">
                        <h4 className="font-title-md text-title-md text-primary flex items-center gap-2 font-bold">
                          <span className="material-symbols-outlined text-secondary">contact_page</span>
                          Thông tin liên hệ
                        </h4>
                        <div className="space-y-sm">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-text-secondary">Địa chỉ Email</span>
                            <span className="font-body-md text-body-md text-primary">{student.email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-text-secondary">Số điện thoại</span>
                            <span className="font-body-md text-body-md text-primary">{student.phone}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-text-secondary">Ngày sinh</span>
                            <span className="font-body-md text-body-md text-primary">{student.birthday}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-md">
                        <h4 className="font-title-md text-title-md text-primary flex items-center gap-2 font-bold">
                          <span className="material-symbols-outlined text-secondary">home</span>
                          Địa chỉ thường trú
                        </h4>
                        <p className="font-body-md text-body-md text-primary leading-relaxed">
                          {student.address || 'Chưa đăng ký địa chỉ thường trú'}<br/>
                          Việt Nam
                        </p>
                      </div>
                    </div>

                    <div className="space-y-md pt-xl border-t border-border">
                      <h4 className="font-title-md text-title-md text-primary flex items-center gap-2 font-bold">
                        <span className="material-symbols-outlined text-secondary">info</span>
                        Thông tin bổ sung
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-secondary">Mã sinh viên</span>
                          <span className="font-body-md text-body-md text-primary font-bold">{student.studentCode}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-secondary">Giới tính</span>
                          <span className="font-body-md text-body-md text-primary font-bold capitalize">
                            {student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-secondary">Khoa</span>
                          <span className="font-body-md text-body-md text-primary font-bold">{getDeptName(student.departmentId)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-secondary">Lớp học</span>
                          <span className="font-body-md text-body-md text-primary font-bold">{getClassroomName(student.classroomIds)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}



          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDetail;
