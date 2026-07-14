import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MyAccountSettings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    gradeAlerts: true,
  });

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    linkedin: false,
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleToggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleLink = (key) => {
    setLinkedAccounts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg('Cập nhật các tùy chọn tài khoản thành công.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">Cài đặt tài khoản của tôi</h2>
        <p className="text-sm text-text-secondary mt-1">Quản lý liên kết tài khoản sinh viên, cảnh báo thông báo và các thiết lập bảo mật.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-success/10 text-success rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="card space-y-4">
          <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">notifications</span>
            Kênh nhận thông báo
          </h3>
          
          <div className="divide-y divide-border/30 space-y-4">
            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Thông báo học vụ qua Email</p>
                <p className="text-xs text-text-secondary mt-0.5">Nhận thông báo môn học và ghi chú từ khoa qua địa chỉ email của bạn.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.emailAlerts}
                onChange={() => handleToggleNotif('emailAlerts')}
                className="w-10 h-6 bg-border border-none rounded-full cursor-pointer focus:ring-transparent text-primary"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Thông báo lịch học qua SMS</p>
                <p className="text-xs text-text-secondary mt-0.5">Nhận cập nhật tức thời về thay đổi lịch học và phòng học qua tin nhắn SMS.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.smsAlerts}
                onChange={() => handleToggleNotif('smsAlerts')}
                className="w-10 h-6 bg-border border-none rounded-full cursor-pointer focus:ring-transparent text-primary"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Thông báo công bố điểm số</p>
                <p className="text-xs text-text-secondary mt-0.5">Nhận thông báo ngay lập tức khi giảng viên công bố điểm số hoặc đánh giá học tập.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.gradeAlerts}
                onChange={() => handleToggleNotif('gradeAlerts')}
                className="w-10 h-6 bg-border border-none rounded-full cursor-pointer focus:ring-transparent text-primary"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">link</span>
            Tài khoản liên kết bên thứ ba
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background border border-border rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-text-primary">Tài khoản Google</p>
                <p className="text-[10px] text-text-secondary mt-0.5">Sử dụng để đăng nhập một lần (Single Sign-On).</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleLink('google')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-fast ${
                  linkedAccounts.google ? 'bg-success/10 text-success' : 'bg-background text-text-secondary border border-border'
                }`}
              >
                {linkedAccounts.google ? 'Đã liên kết' : 'Liên kết tài khoản'}
              </button>
            </div>

            <div className="p-4 bg-background border border-border rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-text-primary">Tài khoản LinkedIn</p>
                <p className="text-[10px] text-text-secondary mt-0.5">Sử dụng để liên kết hồ sơ nghề nghiệp.</p>
              </div>
              <button 
                type="button"
                onClick={() => handleToggleLink('linkedin')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-fast ${
                  linkedAccounts.linkedin ? 'bg-success/10 text-success' : 'bg-background text-text-secondary border border-border'
                }`}
              >
                {linkedAccounts.linkedin ? 'Đã liên kết' : 'Liên kết tài khoản'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button 
            type="submit"
            className="btn-primary"
          >
            Lưu cài đặt tài khoản
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyAccountSettings;
