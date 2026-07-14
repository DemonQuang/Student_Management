import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUS_LABELS = { ACTIVE: 'Đang học', INACTIVE: 'Ngừng học', GRADUATED: 'Đã tốt nghiệp', SUSPENDED: 'Bị đình chỉ' };
const GENDER_LABELS = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };
const STATUS_COLORS = { ACTIVE: '#22c55e', INACTIVE: '#ef4444', GRADUATED: '#3b82f6', SUSPENDED: '#f59e0b' };
const GENDER_COLORS = { MALE: '#3b82f6', FEMALE: '#ec4899', OTHER: '#8b5cf6' };
const CHART_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#ea580c'];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#0F172A" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardData();
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pb-12 text-left">
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
        <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 pb-12 text-left">
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
        <p className="text-sm text-slate-500">Không thể tải dữ liệu.</p>
      </div>
    );
  }

  const barData = data.departmentDistribution.map(d => ({ name: d.departmentName, count: d.count }));
  const statusPieData = data.statusDistribution.map(s => ({ name: STATUS_LABELS[s.status] || s.status, value: s.count, color: STATUS_COLORS[s.status] || '#94a3b8' }));
  const genderPieData = data.genderDistribution.map(g => ({ name: GENDER_LABELS[g.gender] || g.gender, value: g.count, color: GENDER_COLORS[g.gender] || '#94a3b8' }));

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
          <p className="text-sm text-slate-500">Thống kê dữ liệu sinh viên trong hệ thống.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl p-6 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-[28px]">group</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Tổng số sinh viên</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{data.totalStudents}</h3>
          </div>
        </div>
        <div className="rounded-2xl p-6 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-violet-600 to-violet-400">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-[28px]">domain</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Tổng số khoa</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{data.totalDepartments}</h3>
          </div>
        </div>
        <div className="rounded-2xl p-6 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-[28px]">meeting_room</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Tổng số lớp học</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{data.totalClassrooms}</h3>
          </div>
        </div>
        <div className="rounded-2xl p-6 flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-orange-600 to-orange-400">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-[28px]">manage_accounts</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Tổng số tài khoản</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{data.totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-base font-bold text-slate-800">Phân bố sinh viên theo khoa</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Số lượng sinh viên mỗi khoa</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => Number.isInteger(v) ? v : ''} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" name="Số lượng" radius={[0, 6, 6, 0]}>
                {barData.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-base font-bold text-slate-800">Trạng thái sinh viên</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Tổng số: {data.totalStudents}</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" labelLine={true} label={renderPieLabel}>
                {statusPieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-xs text-slate-700">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-base font-bold text-slate-800">Giới tính</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Tổng số: {data.totalStudents}</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie data={genderPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" labelLine={true} label={renderPieLabel}>
                {genderPieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-xs text-slate-700">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h4 className="text-base font-bold text-slate-800">Sinh viên gần đây</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-col-divider">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sinh viên</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Khoa</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentStudents.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-6 py-3">
                    <p className="text-sm font-semibold text-slate-800">{s.fullName}</p>
                    <p className="text-xs text-slate-500">{s.studentCode}</p>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">{s.departmentName}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                      s.status === 'INACTIVE' ? 'bg-red-50 text-red-700' :
                      s.status === 'GRADUATED' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.status === 'ACTIVE' ? 'bg-emerald-500' :
                        s.status === 'INACTIVE' ? 'bg-red-500' :
                        s.status === 'GRADUATED' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`}></span>
                      {STATUS_LABELS[s.status] || s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {data.recentStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-xs text-slate-500">Chưa có sinh viên nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
