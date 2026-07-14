import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Sinh viên', path: '/admin/students', icon: 'group' },
    { name: 'Khoa đào tạo', path: '/admin/departments', icon: 'account_balance' },
    { name: 'Lớp học', path: '/admin/classrooms', icon: 'meeting_room' },
    { name: 'Tài khoản', path: '/admin/users', icon: 'manage_accounts' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0F172A] flex flex-col z-40">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-white text-lg">school</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">EduManager</h1>
              <p className="text-xs text-slate-400">Cổng quản trị viên</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 py-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin/dashboard'}
            >
              {({ isActive }) => (
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-white shadow-sm border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <span className={`material-symbols-outlined text-xl ${isActive ? 'text-blue-400' : ''}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20 shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.fullName || 'Quản trị hệ thống'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@school.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-lg">dashboard</span>
            </div>
            <span className="text-base font-semibold text-slate-800">Bảng điều hành EduManager</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
              QUẢN TRỊ VIÊN
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
