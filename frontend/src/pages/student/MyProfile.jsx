import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student.service';
import { departmentService } from '../../services/department.service';
import { classroomService } from '../../services/classroom.service';

const MyProfile = () => {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [department, setDepartment] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    birthday: '',
    address: '',
    gender: 'MALE',
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
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user?.email) {
          const res = await studentService.filter({ email: user.email });
          const content = res.data?.content || [];
          if (content.length > 0) {
            const profile = content[0];
            setStudentProfile(profile);
            
            setFormData({
              fullName: profile.fullName || '',
              phone: profile.phone || '',
              birthday: profile.birthday || '',
              address: profile.address || '',
              gender: profile.gender || 'MALE',
              avatar: profile.avatar || '',
            });

            if (profile.departmentId) {
              const dRes = await departmentService.getById(profile.departmentId);
              setDepartment(dRes.data);
            }
            if (profile.classroomIds && profile.classroomIds.length > 0) {
              try {
                const results = await Promise.allSettled(
                  profile.classroomIds.map(id => classroomService.getById(id))
                );
                setClassrooms(results.filter(r => r.status === 'fulfilled').map(r => r.value.data));
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi tải hồ sơ cá nhân.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.birthday) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMsg('Số điện thoại liên hệ phải có độ dài đúng 10 chữ số.');
      return;
    }

    try {
      const payload = {
        studentCode: studentProfile.studentCode,
        fullName: formData.fullName.trim(),
        email: studentProfile.email,
        phone: formData.phone.trim(),
        birthday: formData.birthday,
        gender: formData.gender,
        address: formData.address,
        status: studentProfile.status,
        departmentId: studentProfile.departmentId,
        classroomIds: studentProfile.classroomIds || [],
        avatar: formData.avatar || studentProfile.avatar,
      };

      const res = await studentService.update(studentProfile.id, payload);
      setStudentProfile(res.data);
      setIsEditing(false);
      setSuccessMsg('Cập nhật hồ sơ cá nhân thành công.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi cập nhật hồ sơ cá nhân.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-2xl">
        <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
        <p className="mt-md text-text-secondary font-medium">Đang tải dữ liệu hồ sơ cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary font-bold">Hồ sơ cá nhân của tôi</h2>
          <p className="font-body-md text-body-md text-text-secondary">Xem thông tin học vụ đã đăng ký và hiển thị thẻ sinh viên điện tử của bạn.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-md bg-success/10 text-success rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-md bg-danger/10 text-danger rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {!studentProfile ? (
        <div className="card">
          <div className="text-center mb-lg">
            <span className="material-symbols-outlined !text-[48px] text-text-muted">no_accounts</span>
            <p className="mt-md font-medium text-text-secondary">Tài khoản chưa được liên kết với thông tin sinh viên.</p>
            <p className="text-sm mt-xs text-text-muted">Vui lòng liên hệ với Phòng Đào tạo (Admin) để đăng ký và liên kết MSSV với Email đăng nhập của bạn.</p>
          </div>
          <div className="grid grid-cols-2 gap-y-lg gap-x-md leading-relaxed max-w-lg mx-auto">
            <div>
              <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Tên đăng nhập</span>
              <span className="text-sm font-semibold text-primary">{user?.username}</span>
            </div>
            <div>
              <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Họ và tên</span>
              <span className="text-sm font-semibold text-primary">{user?.fullName}</span>
            </div>
            <div>
              <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Email</span>
              <span className="text-sm font-semibold text-primary">{user?.email}</span>
            </div>
            <div>
              <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Vai trò</span>
              <span className="text-sm font-semibold text-primary">{user?.role === 'ADMIN' ? 'Quản trị viên' : 'Sinh viên'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-gutter">
          
          {/* Left Column: Digital ID Card Widget */}
          <div className="col-span-12 lg:col-span-4 space-y-gutter">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl overflow-hidden relative border border-slate-700/50 p-lg max-w-[360px] mx-auto group">
              {/* Background ambient element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-[360px]">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-md">
                  <div>
                    <h4 className="text-sm font-bold tracking-widest text-indigo-200">EDUMANAGER</h4>
                    <p className="text-[10px] text-white/50">THẺ SINH VIÊN ĐIỆN TỬ</p>
                  </div>
                  <span className="material-symbols-outlined text-[32px] text-indigo-400">school</span>
                </div>

                {/* Photo & Basic details */}
                <div className="flex items-center gap-md my-lg">
                  <div className="w-24 h-24 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                    {studentProfile.avatar ? (
                      <img src={studentProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-2xl">{studentProfile.fullName.split(' ').pop().substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-md font-bold tracking-wide truncate max-w-[160px]">{studentProfile.fullName}</p>
                    <p className="text-xs text-white/70 font-semibold">{department ? department.name : 'Đang cập nhật'}</p>
                    <p className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded inline-block">MSSV: {studentProfile.studentCode}</p>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="border-t border-white/10 pt-md flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[9px] text-white/40 uppercase">Trạng thái</p>
                    <span className="badge bg-success/20 text-success border border-success/30 text-[9px] font-bold uppercase tracking-wider">
                      {studentProfile.status === 'ACTIVE' ? 'Đang học' : 'Nghỉ học'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Detail Cards & Edit form */}
          <div className="col-span-12 lg:col-span-8 space-y-lg">
        <div className="card">
              <div className="flex justify-between items-center border-b border-border pb-sm mb-lg">
                <h3 className="font-title-md text-title-md font-bold text-primary">Thông tin chi tiết</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary text-xs"
                >
                  {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-md">
                  <div className="grid grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="text-xs font-bold text-text-muted">Họ và tên *</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full input-field bg-background border border-border rounded-xl px-4 py-2.5 text-body-sm outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="text-xs font-bold text-text-muted">Số điện thoại di động *</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full input-field bg-background border border-border rounded-xl px-4 py-2.5 text-body-sm outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="text-xs font-bold text-text-muted">Ngày sinh *</label>
                      <input 
                        type="date" 
                        value={formData.birthday}
                        onChange={e => setFormData(p => ({ ...p, birthday: e.target.value }))}
                        className="w-full input-field bg-background border border-border rounded-xl px-4 py-2.5 text-body-sm outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="text-xs font-bold text-text-muted">Giới tính</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                        className="w-full input-field bg-background border border-border rounded-xl px-4 py-2.5 text-body-sm outline-none"
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-muted">Địa chỉ thường trú</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                      className="w-full input-field bg-background border border-border rounded-xl px-4 py-2.5 text-body-sm outline-none"
                      placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội"
                    />
                  </div>

                  <div className="space-y-xs">
                    <label className="text-xs font-bold text-text-muted">Ảnh đại diện</label>
                    <div className="flex items-center gap-md">
                      <div className="w-16 h-16 rounded-xl border border-border flex items-center justify-center overflow-hidden bg-background shrink-0">
                        {(previewAvatar || studentProfile.avatar) ? (
                          <img src={previewAvatar || studentProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-text-muted">person</span>
                        )}
                      </div>
                      <label className="px-md py-1.5 border border-border rounded-xl text-xs font-semibold cursor-pointer hover:bg-background">
                        Chọn ảnh
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-sm pt-md border-t">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary text-xs"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary text-xs"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-y-lg gap-x-md leading-relaxed">
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Email sinh viên</span>
                    <span className="text-sm font-semibold text-primary">{studentProfile.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Số điện thoại liên hệ</span>
                    <span className="text-sm font-semibold text-primary">{studentProfile.phone}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Khoa đào tạo</span>
                    <span className="text-sm font-semibold text-primary">{department ? department.name : 'Đang cập nhật'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Lớp học sinh hoạt</span>
                    <span className="text-sm font-semibold text-primary">{classrooms.length > 0 ? classrooms.map(c => c.name).join(', ') : 'Chưa xếp lớp'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Ngày sinh</span>
                    <span className="text-sm font-semibold text-primary">{studentProfile.birthday}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Giới tính</span>
                    <span className="text-sm font-semibold text-primary capitalize">
                      {studentProfile.gender === 'MALE' ? 'Nam' : studentProfile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-text-muted uppercase font-bold tracking-wide">Địa chỉ thường trú</span>
                    <span className="text-sm font-semibold text-primary">{studentProfile.address || 'Chưa đăng ký địa chỉ thường trú.'}</span>
                  </div>
                </div>
              )}
            </div>


          </div>

        </div>
      )}
    </div>
  );
};

export default MyProfile;
