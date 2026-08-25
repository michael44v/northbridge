import React from 'react';
import { AlertOctagon, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SuspendedAccountModal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleContactSupport = () => {
    // Open chat or email support
    const chatBtn = document.querySelector('[aria-label="Open support chat"], button[title*="chat"]');
    if (chatBtn) {
      chatBtn.click();
    } else {
      window.location.href = 'mailto:support@starlingcrestfinance.com';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center border border-red-100 relative">
        <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <AlertOctagon size={48} className="animate-pulse" />
        </div>

        <h2 className="text-2xl font-black text-chase-navy mb-3 tracking-tight">
          ACCOUNT SUSPENDED
        </h2>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Your account has been temporarily suspended due to regulatory compliance or security reasons. Access to banking services and transfers is restricted.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleContactSupport}
            className="w-full py-3.5 px-4 bg-chase-blue hover:bg-chase-navy text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} /> Contact Support
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3.5 px-4 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200"
          >
            <LogOut size={18} /> Cancel & Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccountModal;
