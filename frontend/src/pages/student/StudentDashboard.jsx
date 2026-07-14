import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student.service';
import { departmentService } from '../../services/department.service';
import { classroomService } from '../../services/classroom.service';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [department, setDepartment] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  const formatDate = (date) => {
    const d = new Date(date);
    return `${DAYS[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        if (user?.email) {
          const res = await studentService.filter({ email: user.email });
          const content = res.data?.content || [];
          if (content.length > 0) {
            const profile = content[0];
            setStudentProfile(profile);

            if (profile.departmentId) {
              const deptRes = await departmentService.getById(profile.departmentId);
              setDepartment(deptRes.data);
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
        setFetchError(err.message || 'Lỗi tải hồ sơ sinh viên.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [user]);

  if (fetchError) {
    return (
        <div className="p-md bg-danger/10 text-danger rounded-xl text-sm flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        <span>{fetchError}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-2xl">
        <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
        <p className="mt-md text-text-secondary">Đang tải...</p>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="space-y-lg text-left">
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Xin chào, {user?.fullName || 'Sinh viên'} 👋</h1>
        <p className="text-body-md text-text-secondary">{formatDate(new Date())}</p>
        <hr className="border-border" />
          <div className="card !p-8 text-center text-text-secondary">
          <span className="material-symbols-outlined !text-[48px]">no_accounts</span>
          <p className="mt-md font-medium">Tài khoản chưa được liên kết với thông tin sinh viên.</p>
          <p className="text-sm mt-xs">Vui lòng liên hệ với Phòng Đào tạo (Admin) để đăng ký và liên kết MSSV với Email đăng nhập của bạn.</p>
        </div>
      </div>
    );
  }

  const statusLabel = studentProfile.status === 'ACTIVE' ? 'Đang học' : 'Ngừng học';
  const statusColor = studentProfile.status === 'ACTIVE' ? 'text-success' : 'text-danger';
  const statusBg = studentProfile.status === 'ACTIVE' ? 'bg-success/10' : 'bg-danger/10';

  return (
    <div className="space-y-lg text-left">
      <div className="text-center">
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Xin chào, {studentProfile.fullName} 👋</h1>
        <p className="text-body-md text-text-secondary">Hôm nay là {formatDate(new Date())}</p>
        <div className="flex flex-col items-center mt-lg">
          <div className="w-36 aspect-[2/3] rounded-xl border border-border flex items-center justify-center overflow-hidden bg-background">
            {studentProfile.avatar ? (
              <img src={studentProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[36px] text-text-muted">person</span>
            )}
          </div>
          <span className="mt-2 text-sm font-semibold text-primary">{studentProfile.fullName}</span>
        </div>
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">badge</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">MSSV</p>
            <p className="text-xl font-bold text-white mt-0.5 truncate">{studentProfile.studentCode}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-violet-600 to-violet-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">domain</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Khoa</p>
            <p className="text-xl font-bold text-white mt-0.5 truncate">{department ? department.name : 'Đang cập nhật'}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">meeting_room</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Lớp{classrooms.length > 1 ? ' (SL: ' + classrooms.length + ')' : ''}</p>
            <p className="text-xl font-bold text-white mt-0.5 truncate">{classrooms.length > 0 ? classrooms[0].name : 'Chưa xếp'}</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-orange-600 to-orange-400">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">school</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Trạng thái</p>
            <p className="text-xl font-bold text-white mt-0.5">{statusLabel}</p>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div
          onClick={() => navigate('/student/classrooms')}
          className="card cursor-pointer flex items-center gap-md hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">meeting_room</span>
          </div>
          <div>
          <p className="font-title-md font-bold text-primary">Lớp học</p>
          <p className="text-label-sm text-text-muted">{classrooms.length > 0 ? classrooms.map(c => c.name).join(', ') : 'Chưa xếp lớp'}</p>
          </div>
        </div>
        <div
          onClick={() => navigate('/student/departments')}
          className="card cursor-pointer flex items-center gap-md hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">domain</span>
          </div>
          <div>
            <p className="font-title-md font-bold text-primary">Khoa đào tạo</p>
            <p className="text-label-sm text-text-muted">{department ? department.name : 'Đang cập nhật'}</p>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      <div className="card max-w-lg mx-auto">
        <h3 className="font-title-md text-title-md font-bold text-primary mb-md text-center">Thông tin cá nhân</h3>
        <div className="space-y-md">
          <div className="flex justify-between items-center border-b border-dashed border-border/40 pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Họ và tên</span>
            <span className="text-body-md font-semibold text-primary text-right">{studentProfile.fullName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/40 pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Email</span>
            <span className="text-body-md font-semibold text-primary text-right">{studentProfile.email}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/40 pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Số điện thoại</span>
            <span className="text-body-md font-semibold text-primary text-right">{studentProfile.phone || '---'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/40 pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Ngày sinh</span>
            <span className="text-body-md font-semibold text-primary text-right">{studentProfile.birthday || '---'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-border/40 pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Giới tính</span>
            <span className="text-body-md font-semibold text-primary text-right capitalize">
              {studentProfile.gender === 'MALE' ? 'Nam' : studentProfile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-sm">
            <span className="text-xs text-text-muted uppercase font-bold tracking-wide">Địa chỉ</span>
            <span className="text-body-md font-semibold text-primary text-right">{studentProfile.address || '---'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
