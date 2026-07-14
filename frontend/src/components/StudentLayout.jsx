import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/student/dashboard' },
    { name: 'Hồ sơ cá nhân', path: '/student/profile' },
    { name: 'Khoa đào tạo', path: '/student/departments' },
    { name: 'Lớp học', path: '/student/classrooms' },
    { name: 'Cài đặt', path: '/student/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="flex justify-center w-full bg-white border-b border-border shadow-navbar fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center w-full max-w-7xl h-16 px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                <span className="material-symbols-outlined text-white text-sm">school</span>
              </div>
              <span className="text-lg font-bold text-text-primary">StudentPortal</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-text-primary">{user?.fullName || 'Sinh viên'}</span>
              <span className="text-xs text-text-muted">StudentPortal</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <main className="mt-20 mb-12 flex-grow px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer className="py-6 border-t border-border bg-background mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© 2026 EduManager. Tất cả hồ sơ học tập được mã hóa bảo mật an toàn.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-text-primary transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-text-primary transition-colors">Cổng hỗ trợ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
