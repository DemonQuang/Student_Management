import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('USER');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setEmailError('');
    setFullNameError('');
    setApiError('');

    if (!username.trim()) {
      setUsernameError('Vui lòng nhập tên đăng nhập');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    }

    if (!isLogin) {
      if (!email.trim()) {
        setEmailError('Vui lòng nhập địa chỉ email');
        isValid = false;
      }
      if (!fullName.trim()) {
        setFullNameError('Vui lòng nhập họ và tên');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const userData = await login(username, password);
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          if (userData.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }, 1000);
      } else {
        await register(username, password, fullName, email, role);
        setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err) {
      setApiError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-[420px]">
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-elevated mb-4">
              <span className="material-symbols-outlined text-white text-[28px] fill">school</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">EduManager</h1>
            <p className="text-sm text-text-secondary mt-1">
              {isLogin ? 'Hệ thống đăng nhập bảo mật' : 'Đăng ký tài khoản mới'}
            </p>
          </div>

          {/* Card */}
          <div className="card !p-8">
            {apiError && (
              <div className="mb-4 p-3 bg-danger-light text-danger rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{apiError}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-success-light text-emerald-700 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="username">Tên đăng nhập</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <span className="material-symbols-outlined text-base">person</span>
                  </span>
                  <input 
                    className={`input-field pl-10 ${usernameError ? '!border-danger !ring-2 !ring-danger/20' : ''}`}
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập" 
                    type="text"
                  />
                  {usernameError && (
                    <p className="text-xs text-danger mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span> {usernameError}
                    </p>
                  )}
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="email">Địa chỉ Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                      <span className="material-symbols-outlined text-base">mail</span>
                    </span>
                    <input 
                      className={`input-field pl-10 ${emailError ? '!border-danger !ring-2 !ring-danger/20' : ''}`}
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com" 
                      type="email"
                    />
                    {emailError && (
                      <p className="text-xs text-danger mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span> {emailError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="fullName">Họ và tên</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                      <span className="material-symbols-outlined text-base">badge</span>
                    </span>
                    <input 
                      className={`input-field pl-10 ${fullNameError ? '!border-danger !ring-2 !ring-danger/20' : ''}`}
                      id="fullName" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Họ và tên đầy đủ" 
                      type="text"
                    />
                    {fullNameError && (
                      <p className="text-xs text-danger mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span> {fullNameError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="password">Mật khẩu</label>
                  {isLogin && <a className="text-xs text-primary hover:underline font-medium" href="#">Quên mật khẩu?</a>}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <span className="material-symbols-outlined text-base">lock</span>
                  </span>
                  <input 
                    className={`input-field pl-10 ${passwordError ? '!border-danger !ring-2 !ring-danger/20' : ''}`}
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    type="password"
                  />
                  {passwordError && (
                    <p className="text-xs text-danger mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span> {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="role">Vai trò</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-field"
                  >
                    <option value="USER">Sinh viên / Người dùng thường</option>
                    <option value="ADMIN">Quản trị viên nhà trường</option>
                  </select>
                </div>
              )}

              <button 
                disabled={loading}
                className="btn-primary w-full py-3 text-base"
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-base">sync</span>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-secondary">
                {isLogin ? (
                  <>
                    Bạn chưa có tài khoản?{' '}
                    <button onClick={() => { setIsLogin(false); setApiError(''); }} className="text-primary font-semibold hover:underline">
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản hệ thống?{' '}
                    <button onClick={() => { setIsLogin(true); setApiError(''); }} className="text-primary font-semibold hover:underline">
                      Đăng nhập tại đây
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-text-muted">
            © 2026 EduManager Systems. Bảo lưu mọi quyền.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
