import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentService } from '../../services/department.service';
import { studentService } from '../../services/student.service';

const AcademicDepartments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [studentDeptId, setStudentDeptId] = useState(null);
  const [deptStudentCount, setDeptStudentCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [deptsRes, profileRes] = await Promise.all([
          departmentService.getAll(),
          user?.email ? studentService.filter({ email: user.email }) : Promise.resolve({ data: { content: [] } }),
        ]);

        const departments = deptsRes.data || [];
        setDepartments(departments);

        const profile = (profileRes.data?.content || [])[0];
        if (profile) {
          setStudentDeptId(profile.departmentId);
        }

        // Count students per department (fetch up to 1000 students)
        const studentsRes = await studentService.getAll(0, 1000);
        const students = studentsRes.data?.content || [];
        const counts = {};
        students.forEach(s => {
          const deptId = s.departmentId;
          if (deptId) counts[deptId] = (counts[deptId] || 0) + 1;
        });
        setDeptStudentCount(counts);
      } catch (err) {
        setErrorMsg(err.message || 'Lỗi tải danh sách khoa đào tạo.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isMyDept = (deptId) => studentDeptId === deptId;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Khoa đào tạo</h2>
        <p className="text-sm text-slate-500 mt-1">Danh sách các khoa đào tạo trong hệ thống.</p>
      </div>

      {errorMsg && (
        <div className="p-md bg-danger/10 text-danger rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-2xl">
          <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
          <p className="mt-md text-text-secondary">Đang tải danh mục khoa đào tạo...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="card text-center text-text-secondary">
          <span className="material-symbols-outlined !text-[48px]">domain_disabled</span>
          <p className="mt-md">Hiện chưa có thông tin khoa đào tạo nào đăng ký trên hệ thống.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const mine = isMyDept(dept.id);
            const studentCount = deptStudentCount[dept.id] || 0;
            return (
              <div
                key={dept.id}
                className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  mine ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`p-5 text-white ${mine ? 'bg-gradient-to-br from-blue-600 to-blue-400' : 'bg-gradient-to-br from-slate-700 to-slate-500'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                      <span className="material-symbols-outlined text-white text-[24px]">domain</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white truncate">{dept.name}</h3>
                        {mine && (
                          <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-semibold text-white whitespace-nowrap backdrop-blur-sm">
                            Khoa của bạn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">Mã khoa: {dept.id}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-5 py-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Số lượng sinh viên</span>
                    <span className="font-bold text-slate-800">{studentCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Ngày tạo</span>
                    <span className="font-semibold text-slate-800">{dept.createdAt ? new Date(dept.createdAt).toLocaleDateString('vi-VN') : '---'}</span>
                  </div>
                  {mine && (
                    <div className="pt-2 border-t border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">school</span>
                        Bạn là sinh viên khoa này
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AcademicDepartments;
