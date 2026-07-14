import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'USER',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAddModal]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi tải danh sách tài khoản hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      setErrorMsg("Lỗi bảo mật: Bạn không thể tự xóa tài khoản quản trị viên của chính mình.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản người dùng này không?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await userService.delete(userId);
      setSuccessMsg('Đã xóa tài khoản vĩnh viễn.');
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi xóa tài khoản.');
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const errors = {};

    if (!newUserData.username.trim()) errors.username = 'Vui lòng nhập tên đăng nhập';
    if (!newUserData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!newUserData.email.trim()) errors.email = 'Vui lòng nhập địa chỉ email';
    if (!newUserData.password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (newUserData.password.trim().length < 6) {
      errors.password = 'Mật khẩu phải có tối thiểu 6 ký tự';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setModalLoading(true);
    try {
      await authService.register(
        newUserData.username,
        newUserData.password,
        newUserData.fullName,
        newUserData.email,
        newUserData.role
      );
      setSuccessMsg('Tạo tài khoản hệ thống thành công.');
      setFieldErrors({});
      setShowAddModal(false);
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi đăng ký tài khoản mới.');
    } finally {
      setModalLoading(false);
    }
  };

  // Calculations
  const adminsCount = users.filter(u => u.role === 'ADMIN').length;
  const standardUsersCount = users.filter(u => u.role === 'USER').length;

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          u.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-lg pb-2xl text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary font-bold">Quản lý tài khoản</h2>
          <p className="font-body-md text-body-md text-text-secondary">Quản trị tài khoản của quản trị viên và sinh viên trên toàn hệ thống.</p>
        </div>
        <button 
          onClick={() => {
            setNewUserData({ username: '', password: '', fullName: '', email: '', role: 'USER' });
            setFieldErrors({});
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-title-md text-title-md hover:opacity-90 transition-all duration-fast font-bold shadow-soft"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span>Thêm tài khoản</span>
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Tổng số tài khoản</p>
              <p className="text-2xl font-bold text-white mt-0.5">{users.length}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[28px]">groups</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-violet-600 to-violet-400">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Số quản trị viên</p>
              <p className="text-2xl font-bold text-white mt-0.5">{adminsCount}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[28px]">admin_panel_settings</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-emerald-600 to-emerald-400">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Người dùng chuẩn</p>
              <p className="text-2xl font-bold text-white mt-0.5">{standardUsersCount}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-white text-[28px]">person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Segment */}
      <div className="card !p-0 overflow-hidden flex flex-col">
        {/* Filters Bar */}
        <div className="p-md flex flex-wrap items-center justify-between gap-4 border-b border-border bg-slate-50">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined">search</span>
              <input 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="input-field pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-body-sm w-full outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                placeholder="Tìm kiếm họ tên, tên đăng nhập, email..." 
                type="text"
              />
            </div>
            

          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-2xl">
              <span className="animate-spin material-symbols-outlined !text-[48px] text-primary">sync</span>
              <p className="mt-md text-text-secondary font-medium">Đang kết nối danh sách tài khoản...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-2xl text-text-secondary">
              <span className="material-symbols-outlined !text-[48px]">person_off</span>
              <p className="mt-md font-medium">Không tìm thấy tài khoản người dùng nào.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-body-sm table-col-divider">
              <thead className="bg-slate-50 border-b border-border">
                <tr className="text-text-secondary">
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider">Tên đăng nhập</th>
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider">Họ và tên</th>
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider">Địa chỉ Email</th>
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider">Vai trò</th>
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider">Trạng thái</th>
                  <th className="table-cell px-lg py-md font-label-sm font-bold uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-primary font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row-hover transition-all duration-fast group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                          {user?.username?.substring(0, 2)?.toUpperCase() || '??'}
                        </div>
                        <span className="font-title-md text-title-md text-primary font-bold">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-primary font-semibold">{user.fullName || 'Chưa đặt tên'}</td>
                    <td className="px-6 py-4 font-body-md text-body-md text-text-secondary">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === 'ADMIN' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.enabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-success' : 'bg-warning'}`}></span>
                        {user.enabled ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="p-2 text-text-secondary hover:text-error hover:bg-red-50 rounded-xl disabled:opacity-30 transition-all duration-fast"
                        title="Xóa tài khoản"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal - rendered at document root via portal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-2xl shadow-elevated border border-border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-lg py-md border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-headline-lg text-title-md text-primary font-bold">
                Tạo tài khoản hệ thống mới
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setFieldErrors({}); }}
                className="material-symbols-outlined text-text-secondary hover:text-primary"
              >
                close
              </button>
            </div>
            
              <form onSubmit={handleAddUserSubmit} className="p-lg space-y-md">
              <div className="space-y-xs">
                <label className="text-xs font-bold text-text-secondary uppercase">Tên đăng nhập *</label>
                <input 
                  value={newUserData.username}
                  onChange={e => {
                    setNewUserData(prev => ({ ...prev, username: e.target.value }));
                    if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: '' }));
                  }}
                  placeholder="Tên đăng nhập" 
                  className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.username ? 'border-red-500' : 'border-border'}`}
                  type="text"
                />
                {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
              </div>

              <div className="space-y-xs">
                <label className="text-xs font-bold text-text-secondary uppercase">Họ và tên *</label>
                <input 
                  value={newUserData.fullName}
                  onChange={e => {
                    setNewUserData(prev => ({ ...prev, fullName: e.target.value }));
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Họ và tên đầy đủ" 
                  className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.fullName ? 'border-red-500' : 'border-border'}`}
                  type="text"
                />
                {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
              </div>

              <div className="space-y-xs">
                <label className="text-xs font-bold text-text-secondary uppercase">Địa chỉ Email *</label>
                <input 
                  value={newUserData.email}
                  onChange={e => {
                    setNewUserData(prev => ({ ...prev, email: e.target.value }));
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="email@example.com" 
                  className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.email ? 'border-red-500' : 'border-border'}`}
                  type="email"
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-xs">
                <label className="text-xs font-bold text-text-secondary uppercase">Mật khẩu *</label>
                <input 
                  value={newUserData.password}
                  onChange={e => {
                    setNewUserData(prev => ({ ...prev, password: e.target.value }));
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" 
                  className={`input-field w-full bg-white border rounded-xl px-md py-sm text-body-sm outline-none focus:ring-1 focus:ring-primary ${fieldErrors.password ? 'border-red-500' : 'border-border'}`}
                  type="password"
                />
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              <div className="space-y-xs">
                <label className="text-xs font-bold text-text-secondary uppercase">Vai trò *</label>
                <div className="relative">
                  <select 
                    value={newUserData.role}
                    onChange={e => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                    className="input-field w-full appearance-none bg-white border border-border rounded-xl px-md py-sm pr-9 text-body-sm outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="USER">USER (Sinh viên / Nhân viên)</option>
                    <option value="ADMIN">ADMIN (Quản trị hệ thống)</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-[18px] material-symbols-outlined">expand_more</span>
                </div>
              </div>

              {Object.keys(fieldErrors).length > 0 && (
                <div className="p-md bg-danger/5 border border-danger/20 rounded-xl text-sm flex items-center gap-2 text-danger">
                  <span className="material-symbols-outlined text-danger">error</span>
                  <span>Vui lòng kiểm tra lại các trường bắt buộc.</span>
                </div>
              )}

              <div className="pt-md border-t border-border flex justify-end space-x-sm">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setFieldErrors({}); }}
                  className="btn-secondary px-md py-2 border border-border hover:bg-slate-200 rounded-xl font-title-md text-sm text-text-secondary transition-all duration-fast font-semibold"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={modalLoading}
                  className="btn-primary px-md py-2 bg-primary text-white hover:opacity-90 rounded-xl font-title-md text-sm transition-all duration-fast font-semibold shadow-soft disabled:opacity-70"
                >
                  {modalLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
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

export default UserManagement;
