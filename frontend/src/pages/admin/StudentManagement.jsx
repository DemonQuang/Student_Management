import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { departmentService } from '../../services/department.service';
import { classroomService } from '../../services/classroom.service';

const StudentManagement = () => {
  const navigate = useNavigate();
  
  // Data States
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classrooms, setClassrooms] = useState([]); // All classrooms for filters
  const [filteredClassrooms, setFilteredClassrooms] = useState([]); // Dynamic list for add/edit modal
  
  // Filtering & Pagination States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    departmentId: '',
    classroomId: '',
    gender: '',
    status: '',
  });
  
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Stat Card Totals
  const [totals, setTotals] = useState({
    active: 0,
    probation: 0,
    graduated: 0,
  });

  // Modal State
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
  const [modalError, setModalError] = useState('');

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

  // Fetch departments & classrooms on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptsRes, classroomsRes] = await Promise.all([
          departmentService.getAll(),
          classroomService.getAll(),
        ]);
        setDepartments(deptsRes.data || []);
        setClassrooms(classroomsRes.data || []);
      } catch (err) {
        console.error('Error fetching metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch students when filters, page, or search changes
  useEffect(() => {
    fetchStudents();
  }, [page, filters, searchKeyword]);

  // Compute Stats based on filters/all students
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [activeRes, probationRes, graduatedRes] = await Promise.all([
          studentService.filter({ status: 'ACTIVE' }, 0, 1),
          studentService.filter({ status: 'SUSPENDED' }, 0, 1),
          studentService.filter({ status: 'GRADUATED' }, 0, 1),
        ]);
        setTotals({
          active: activeRes.data?.totalElements || 0,
          probation: probationRes.data?.totalElements || 0,
          graduated: graduatedRes.data?.totalElements || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [students]);

  const fetchStudents = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let res;
      if (searchKeyword.trim()) {
        res = await studentService.search(searchKeyword.trim(), page, size);
      } else {
        res = await studentService.filter(filters, page, size);
      }

      if (res && res.data) {
        setStudents(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi tải danh sách sinh viên.');
    } finally {
      setLoading(false);
    }
  };

  // Filter classrooms in modal when department is selected
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
      setFormData(prev => ({ ...prev, classroomIds: [] }));
    }
  }, [formData.departmentId, classrooms]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      studentCode: '',
      fullName: '',
      email: '',
      phone: '',
      birthday: '',
      gender: 'MALE',
      address: '',
      status: 'ACTIVE',
      departmentId: departments[0]?.id || '',
      classroomIds: [],
      avatar: '',
    });
    setPreviewAvatar('');
    setFieldErrors({});
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditId(student.id);
    setFormData({
      studentCode: student.studentCode || '',
      fullName: student.fullName || '',
      email: student.email || '',
      phone: student.phone || '',
      birthday: student.birthday || '',
      gender: student.gender || 'MALE',
      address: student.address || '',
      status: student.status || 'ACTIVE',
      departmentId: student.departmentId || '',
      classroomIds: student.classroomIds || [],
      avatar: student.avatar || '',
    });
    setPreviewAvatar(student.avatar || '');
    setFieldErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này (Xóa mềm)?')) return;
    try {
      await studentService.delete(id);
      setSuccessMsg('Xóa sinh viên thành công.');
      fetchStudents();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi xóa sinh viên.');
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errors = {};

    if (!formData.studentCode.trim()) errors.studentCode = 'Vui lòng nhập mã sinh viên';
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.email.trim()) errors.email = 'Vui lòng nhập địa chỉ email';
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại phải có độ dài đúng 10 số';
    }
    if (!formData.birthday) errors.birthday = 'Vui lòng chọn ngày sinh';
    if (!formData.departmentId) errors.departmentId = 'Vui lòng chọn khoa đào tạo';
    if (!formData.classroomIds || formData.classroomIds.length === 0) errors.classroomIds = 'Vui lòng chọn ít nhất một lớp học';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editId) {
        await studentService.update(editId, formData);
        setSuccessMsg('Cập nhật thông tin sinh viên thành công.');
      } else {
        await studentService.create(formData);
        setSuccessMsg('Thêm mới sinh viên thành công.');
      }
      setFieldErrors({});
      setShowModal(false);
      fetchStudents();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setModalError(err.message || 'Lỗi lưu thông tin sinh viên.');
    }
  };

  const getDeptName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : 'Chưa rõ';
  };

  const getClassroomName = (ids) => {
    if (!ids || ids.length === 0) return 'Chưa xếp lớp';
    return ids.map(id => { const cls = classrooms.find(c => c.id === id); return cls ? cls.name : null; }).filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary font-bold">Quản lý sinh viên</h2>
          <nav className="flex text-label-sm text-text-secondary mt-xs">
            <span>Danh mục</span>
            <span className="mx-xs">/</span>
            <span className="text-primary font-bold">Danh sách sinh viên</span>
          </nav>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center bg-primary text-white hover:opacity-95 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-card"
        >
          <span className="material-symbols-outlined mr-sm">person_add</span>
          Thêm mới sinh viên
        </button>
      </div>

      {/* Alert Banners */}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">group</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số sinh viên</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totalElements}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">check_circle</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Đang theo học</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totals.active}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-amber-600 to-amber-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">warning</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Đình chỉ / Cảnh cáo</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totals.probation}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-violet-600 to-violet-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">school</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Cựu sinh viên / Tốt nghiệp</p>
            <p className="text-2xl font-bold text-white mt-0.5">{totals.graduated}</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-background p-md rounded-t-xl border-x border-t border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-md">search</span>
            <input 
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); setPage(0); }}
              className="w-full bg-white border border-border rounded-xl pl-10 pr-md py-sm text-body-sm font-body-sm focus:ring-1 focus:ring-primary outline-none" 
              placeholder="Tìm theo mã, họ tên, email..." 
              type="text"
            />
          </div>
          
          <div className="relative min-w-[160px]">
            <select 
              name="departmentId"
              value={filters.departmentId}
              onChange={handleFilterChange}
              className="w-full appearance-none bg-white border border-border rounded-xl pl-md pr-9 py-sm text-body-sm font-body-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tất cả các khoa</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
          </div>

          <div className="relative min-w-[160px]">
            <select 
              name="classroomId"
              value={filters.classroomId}
              onChange={handleFilterChange}
              disabled={!filters.departmentId}
              className="w-full appearance-none bg-white border border-border rounded-xl pl-md pr-9 py-sm text-body-sm font-body-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              <option value="">Tất cả lớp học</option>
              {classrooms
                .filter(c => c.departmentId === filters.departmentId)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              }
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
          </div>

          <div className="relative min-w-[120px]">
            <select 
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="w-full appearance-none bg-white border border-border rounded-xl pl-md pr-9 py-sm text-body-sm font-body-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tất cả giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
          </div>

          <div className="relative min-w-[140px]">
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full appearance-none bg-white border border-border rounded-xl pl-md pr-9 py-sm text-body-sm font-body-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang theo học</option>
              <option value="INACTIVE">Nghỉ học</option>
              <option value="GRADUATED">Tốt nghiệp</option>
              <option value="SUSPENDED">Đình chỉ</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-border overflow-hidden shadow-card rounded-b-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-2xl">
              <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
              <p className="mt-md text-text-secondary font-medium">Đang tải danh sách sinh viên...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-2xl text-text-secondary">
              <span className="material-symbols-outlined !text-[48px]">person_off</span>
              <p className="mt-md text-text-secondary font-medium">Không tìm thấy sinh viên nào khớp với bộ lọc.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-body-sm whitespace-nowrap table-col-divider">
              <thead>
                <tr className="bg-background border-b border-border text-text-secondary">
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Mã SV</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Họ và tên</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Giới tính</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Email</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Khoa</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Lớp học</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-md font-label-sm text-label-sm uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-primary font-medium">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-background transition-colors">
                    <td className="px-6 py-md font-code text-code font-bold">{student.studentCode}</td>
                    <td className="px-6 py-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mr-md overflow-hidden shrink-0">
                          {student.avatar ? (
                            <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            student.fullName ? student.fullName.split(' ').pop().substring(0, 2).toUpperCase() : 'SV'
                          )}
                        </div>
                        <span className="font-body-md text-body-md text-primary font-bold">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-md text-text-secondary capitalize">
                      {student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </td>
                    <td className="px-6 py-md text-text-secondary">{student.birthday}</td>
                    <td className="px-6 py-md text-text-secondary">{student.email}</td>
                    <td className="px-6 py-md text-text-secondary">{getDeptName(student.departmentId)}</td>
                    <td className="px-6 py-md text-text-secondary">{getClassroomName(student.classroomIds)}</td>
                    <td className="px-6 py-md">
                      <span className={`badge text-[11px] ${
                        student.status === 'ACTIVE' ? 'bg-success/10 text-success' :
                        student.status === 'GRADUATED' ? 'bg-warning/10 text-warning' :
                        student.status === 'SUSPENDED' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                      }`}>
                        {student.status === 'ACTIVE' ? 'Đang học' :
                         student.status === 'GRADUATED' ? 'Tốt nghiệp' :
                         student.status === 'SUSPENDED' ? 'Đình chỉ' : 'Bảo lưu'}
                      </span>
                    </td>
                    <td className="px-6 py-md text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="p-xs text-text-secondary hover:text-primary transition-colors" 
                          title="Xem hồ sơ"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(student)}
                          className="p-xs text-text-secondary hover:text-primary transition-colors" 
                          title="Sửa thông tin"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-xs text-text-secondary hover:text-danger transition-colors" 
                          title="Xóa sinh viên"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
          <div className="px-6 py-md bg-background border-t border-border flex items-center justify-between">
            <p className="text-label-sm font-label-sm text-text-secondary">
              Hiển thị <span className="font-bold text-text-primary">{page * size + 1} - {Math.min((page + 1) * size, totalElements)}</span> trên tổng số <span className="font-bold text-text-primary">{totalElements}</span> sinh viên
            </p>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-sm rounded-xl hover:bg-background transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-label-sm font-bold transition-colors ${
                    page === i ? 'bg-primary text-white' : 'hover:bg-background'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-sm rounded-xl hover:bg-background transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-content max-w-lg">
            <div className="px-6 py-md border-b border-border bg-background flex justify-between items-center">
              <h3 className="font-headline-lg text-title-md text-primary font-bold">
                {editId ? 'Chỉnh sửa hồ sơ sinh viên' : 'Đăng ký sinh viên mới'}
              </h3>
              <button 
                onClick={() => { setShowModal(false); setFieldErrors({}); setModalError(''); }}
                className="material-symbols-outlined text-text-secondary hover:text-primary"
              >
                close
              </button>
            </div>
            
              <form onSubmit={handleSaveStudent}>
              <div className="p-6 space-y-md max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Student Code and Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Mã sinh viên *</label>
                    <input 
                      value={formData.studentCode}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, studentCode: e.target.value }));
                        if (fieldErrors.studentCode) setFieldErrors(prev => ({ ...prev, studentCode: '' }));
                      }}
                      placeholder="Ví dụ: SV-2026-001" 
                       className={`w-full input-field bg-background border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.studentCode ? 'border-danger' : 'border-border'}`}
                      type="text"
                    />
                    {fieldErrors.studentCode && <p className="text-danger text-xs mt-1">{fieldErrors.studentCode}</p>}
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Họ và tên *</label>
                    <input 
                      value={formData.fullName}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, fullName: e.target.value }));
                        if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="Họ và tên đầy đủ" 
                       className={`w-full input-field bg-background border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.fullName ? 'border-danger' : 'border-border'}`}
                      type="text"
                    />
                    {fieldErrors.fullName && <p className="text-danger text-xs mt-1">{fieldErrors.fullName}</p>}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Địa chỉ Email *</label>
                    <input 
                      value={formData.email}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="email@example.com" 
                       className={`w-full input-field bg-background border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.email ? 'border-danger' : 'border-border'}`}
                      type="email"
                    />
                    {fieldErrors.email && <p className="text-danger text-xs mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Số điện thoại (10 chữ số) *</label>
                    <input 
                      value={formData.phone}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, phone: e.target.value }));
                        if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="Ví dụ: 0912345678" 
                       className={`w-full input-field bg-background border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.phone ? 'border-danger' : 'border-border'}`}
                      type="text"
                    />
                    {fieldErrors.phone && <p className="text-danger text-xs mt-1">{fieldErrors.phone}</p>}
                  </div>
                </div>

                {/* Birthday and Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Ngày sinh *</label>
                    <input 
                      value={formData.birthday}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, birthday: e.target.value }));
                        if (fieldErrors.birthday) setFieldErrors(prev => ({ ...prev, birthday: '' }));
                      }}
                       className={`w-full input-field bg-background border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.birthday ? 'border-danger' : 'border-border'}`}
                      type="date"
                    />
                    {fieldErrors.birthday && <p className="text-danger text-xs mt-1">{fieldErrors.birthday}</p>}
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Giới tính *</label>
                    <select 
                      value={formData.gender}
                      onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                       className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary"
                     >
                       <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Department and Classroom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Khoa đào tạo *</label>
                    <select 
                      value={formData.departmentId}
                      onChange={e => { setFormData(prev => ({ ...prev, departmentId: e.target.value, classroomIds: [] })); if (fieldErrors.departmentId) setFieldErrors(prev => ({ ...prev, departmentId: '' })); }}
className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary"
                     >
                       <option value="">Chọn khoa</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    {fieldErrors.departmentId && <p className="text-danger text-xs mt-1">{fieldErrors.departmentId}</p>}
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Lớp học *</label>
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
                                  setFormData(prev => ({
                                    ...prev,
                                    classroomIds: e.target.checked
                                      ? [...prev.classroomIds, c.id]
                                      : prev.classroomIds.filter(id => id !== c.id)
                                  }));
                                  if (fieldErrors.classroomIds) setFieldErrors(prev => ({ ...prev, classroomIds: '' }));
                                }}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                              />
                              <span className="text-sm text-text-primary">{c.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {fieldErrors.classroomIds && <p className="text-danger text-xs mt-1">{fieldErrors.classroomIds}</p>}
                  </div>
                </div>

                {/* Avatar */}
                <div className="space-y-xs">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Ảnh đại diện</label>
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

                {/* Status & Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-xs text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Trạng thái *</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary"
                     >
                       <option value="ACTIVE">Đang theo học</option>
                      <option value="INACTIVE">Nghỉ học</option>
                      <option value="GRADUATED">Tốt nghiệp</option>
                      <option value="SUSPENDED">Đình chỉ</option>
                    </select>
                  </div>
                  <div className="space-y-xs text-left">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">Địa chỉ thường trú</label>
                    <input 
                      value={formData.address}
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Quận/Huyện, Tỉnh/Thành phố" 
                       className="w-full input-field bg-background border border-border rounded px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary"
                       type="text"
                     />
                   </div>
                 </div>

              </div>

              {modalError && (
                <div className="mx-lg mb-md p-md bg-danger/5 border border-danger/20 rounded-xl text-sm flex items-center gap-2 text-danger">
                  <span className="material-symbols-outlined text-danger">error</span>
                  <span>{modalError}</span>
                </div>
              )}

              {/* Form Controls */}
              <div className="px-6 py-md border-t border-border bg-background flex justify-end space-x-sm">
                <button 
                  type="button"
                  onClick={() => { setShowModal(false); setFieldErrors({}); setModalError(''); }}
                  className="px-md py-2 border border-border hover:bg-background rounded-xl font-title-md text-sm text-text-secondary transition-all font-semibold active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-md py-2 bg-primary text-white hover:opacity-90 rounded-xl font-title-md text-sm transition-all font-semibold active:scale-95 shadow-card"
                >
                  Lưu hồ sơ
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

export default StudentManagement;
