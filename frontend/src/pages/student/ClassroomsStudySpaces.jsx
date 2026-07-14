import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student.service';
import { classroomService } from '../../services/classroom.service';
import { departmentService } from '../../services/department.service';

const ClassroomsStudySpaces = () => {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [loadingClassmates, setLoadingClassmates] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!user?.email) return;

        const [res, deptsRes] = await Promise.all([
          studentService.filter({ email: user.email }),
          departmentService.getAll(),
        ]);
        setDepartments(deptsRes.data || []);

        const content = res.data?.content || [];
        if (content.length === 0) {
          setLoading(false);
          return;
        }

        const profile = content[0];
        setStudentProfile(profile);

        if (profile.classroomIds && profile.classroomIds.length > 0) {
          const classroomData = await Promise.all(
            profile.classroomIds.map(id => classroomService.getById(id).then(r => r.data).catch(() => null))
          );
          setEnrolledClassrooms(classroomData.filter(Boolean));
        }
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi tải thông tin lớp học.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleViewClass = async (classroom) => {
    setSelectedClassroom(classroom);
    setLoadingClassmates(true);
    try {
      const res = await studentService.filter({ classroomId: classroom.id });
      setClassmates((res.data?.content || []).filter(s => s.id !== studentProfile?.id));
    } catch (err) {
      setClassmates([]);
    } finally {
      setLoadingClassmates(false);
    }
  };

  const getDeptName = (id) => {
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : 'Không xác định';
  };

  if (loading) {
    return (
      <div className="text-center py-2xl">
        <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
        <p className="mt-md text-text-secondary font-medium">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-md bg-danger/10 text-danger rounded-xl text-sm flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        <span>{errorMsg}</span>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="space-y-lg text-left">
        <h2 className="text-2xl font-bold text-slate-800">Lớp học của tôi</h2>
        <p className="text-sm text-slate-500 mt-1">Danh sách lớp học trực thuộc.</p>
        <div className="card text-center text-text-secondary">
          <span className="material-symbols-outlined !text-[48px]">no_accounts</span>
          <p className="mt-md font-medium">Tài khoản chưa được liên kết với thông tin sinh viên.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Lớp học của tôi</h2>
        <p className="text-sm text-slate-500 mt-1">Danh sách lớp học trực thuộc và bạn cùng lớp.</p>
      </div>

      {/* Enrolled Classes */}
      {enrolledClassrooms.length === 0 ? (
        <div className="card text-center text-text-secondary">
          <span className="material-symbols-outlined !text-[48px]">meeting_room_disabled</span>
          <p className="mt-md font-medium">Bạn chưa được xếp vào lớp học nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledClassrooms.map(classroom => (
            <div
              key={classroom.id}
              className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => handleViewClass(classroom)}
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                    <span className="material-symbols-outlined text-white text-[24px]">meeting_room</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Lớp học</p>
                    <h3 className="text-lg font-bold text-white mt-0.5 truncate">{classroom.name}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white px-5 py-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Khoa quản lý</span>
                  <span className="font-semibold text-slate-800 text-right">{getDeptName(classroom.departmentId)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Sĩ số</span>
                  <span className="font-semibold text-slate-800">{classroom.studentCount || 0} học viên</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    classroom.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${classroom.active !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {classroom.active !== false ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    Xem chi tiết
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classmates Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedClassroom(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Lớp học</p>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedClassroom.name}</h3>
              </div>
              <button onClick={() => setSelectedClassroom(null)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Bạn cùng lớp</p>
              <p className="text-xs text-slate-500">{classmates.length + 1} học viên</p>
            </div>
            {loadingClassmates ? (
              <div className="px-6 py-8 text-center">
                <span className="animate-spin material-symbols-outlined !text-[32px] text-primary inline-block">sync</span>
                <p className="text-sm text-slate-500 mt-2">Đang tải...</p>
              </div>
            ) : classmates.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <span className="material-symbols-outlined !text-[40px] text-slate-300">group_off</span>
                <p className="text-sm text-slate-500 mt-2">Chưa có bạn cùng lớp.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left table-col-divider">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Học viên</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Mã SV</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classmates.map(s => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomsStudySpaces;
