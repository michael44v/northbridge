import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatUSD } from '../../utils/formatCurrency';
import { Search, UserCircle, Send, DollarSign, Ban, CheckCircle, ArrowUpCircle, Edit, Database, Upload, X, UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import SeedTransactions from './SeedTransactions';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [activeUser, setActiveUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit_full', 'create_user', 'seed_tx', 'balance', 'message', 'status', 'tier'
  const [formData, setFormData] = useState({ amount: '', type: 'credit', narration: '', title: '', message: '', status: '', tier: '' });

  // Create User state
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    account_number: '',
    balance: '0.00',
    ledger_balance: '0.00',
    currency: 'GBP',
    swift_code: 'STRCGB2L',
    routing_code: '10-20-30',
    kyc_tier: '2',
    transfer_limit: '200000.00',
    account_type: 'Savings Account',
    occupation: '',
    dob: '',
    sex: 'Male',
    state: '',
    zipcode: ''
  });

  // Comprehensive Edit User state
  const [userEditForm, setUserEditForm] = useState({
    user_id: '',
    profile_picture: '',
    full_name: '',
    email: '',
    phone: '',
    account_number: '',
    balance: '',
    ledger_balance: '',
    swift_code: '',
    routing_code: '',
    kyc_tier: '',
    status: '',
    transfer_limit: '',
    state: '',
    zipcode: '',
    account_type: '',
    occupation: '',
    dob: '',
    sex: '',
    currency: 'GBP'
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('?action=admin_get_users');
      if (response.data.status === 'success') {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditUserModal = (u) => {
    setActiveUser(u);
    setUserEditForm({
      user_id: u.id || '',
      profile_picture: u.profile_picture || '',
      full_name: u.full_name || '',
      email: u.email || '',
      phone: u.phone || '',
      account_number: u.account_number || '',
      balance: u.balance !== undefined ? u.balance : '0.00',
      ledger_balance: u.ledger_balance !== undefined ? u.ledger_balance : '0.00',
      swift_code: u.swift_code || 'STRCGB2L',
      routing_code: u.routing_code || '10-20-30',
      kyc_tier: u.kyc_tier !== undefined ? u.kyc_tier : '2',
      status: u.status || 'active',
      transfer_limit: u.transfer_limit !== undefined ? u.transfer_limit : '200000.00',
      state: u.state || '',
      zipcode: u.zipcode || '',
      account_type: u.account_type || 'Savings Account',
      occupation: u.occupation || '',
      dob: u.dob || '',
      sex: u.sex || 'Male',
      currency: u.currency || 'GBP'
    });
    setModalType('edit_full');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Please upload a JPG or PNG image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserEditForm(prev => ({ ...prev, profile_picture: reader.result }));
        toast.success('Picture uploaded and updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_create_user', createForm);
      if (res.data.status === 'success') {
        toast.success(res.data.message || 'User created successfully!');
        setModalType(null);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Failed to create user account');
      }
    } catch (err) {
      toast.error('Failed to create user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveFullUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_update_user_full', userEditForm);
      if (res.data.status === 'success') {
        toast.success('User account saved successfully!');
        setModalType(null);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Failed to save user account');
      }
    } catch (err) {
      toast.error('Failed to save user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_adjust_balance', {
        user_id: activeUser.id,
        amount: formData.amount,
        type: formData.type,
        narration: formData.narration
      });
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setModalType(null);
        fetchUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to adjust balance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_send_notification', {
        user_id: activeUser.id,
        title: formData.title,
        message: formData.message
      });
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setModalType(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_upgrade_tier', {
        user_id: activeUser.id,
        tier: formData.tier
      });
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setModalType(null);
        fetchUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update tier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_update_user_status', {
        user_id: activeUser.id,
        status: status
      });
      if (res.data.status === 'success') {
        toast.success(res.data.message);
        setModalType(null);
        fetchUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.account_number?.includes(search)
  );

  if (loading && !users.length) return <div className="p-8 text-center text-gray-500 font-bold">Loading User List...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chase-navy">Manage Users</h1>
          <p className="text-xs text-gray-500">Create, edit, seed transactions and manage bank users.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or account..."
              className="pl-10 pr-4 py-2 bg-white border border-chase-border rounded-lg outline-none focus:border-chase-blue w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setCreateForm({
                full_name: '',
                email: '',
                phone: '',
                password: '',
                account_number: '',
                balance: '0.00',
                ledger_balance: '0.00',
                currency: 'GBP',
                swift_code: 'STRCGB2L',
                routing_code: '10-20-30',
                kyc_tier: '2',
                transfer_limit: '200000.00',
                account_type: 'Savings Account',
                occupation: '',
                dob: '',
                sex: 'Male',
                state: '',
                zipcode: ''
              });
              setModalType('create_user');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-chase-blue hover:bg-chase-navy text-white text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <UserPlus size={18} /> Create Account / User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-chase-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-chase-border">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Account Number</th>
                <th className="px-6 py-4">KYC Tier</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chase-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.profile_picture ? (
                        <img src={u.profile_picture} alt={u.full_name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <UserCircle className="text-gray-400" size={36} />
                      )}
                      <div>
                        <p className="font-bold text-chase-navy">{u.full_name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{u.account_number}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-chase-light text-chase-blue">
                      Tier {u.kyc_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-chase-navy">
                    {u.currency === 'GBP' ? '£' : u.currency === 'EUR' ? '€' : '$'}{Number(u.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEditUserModal(u)}
                        className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                        title="Edit User Account"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => { setActiveUser(u); setModalType('seed_tx'); }}
                        className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                        title="Seed Transaction History"
                      >
                        <Database size={18} />
                      </button>
                      <button
                        onClick={() => { setActiveUser(u); setModalType('balance'); setFormData({ ...formData, amount: '', narration: '' }) }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Adjust Balance"
                      >
                        <DollarSign size={18} />
                      </button>
                      <button
                        onClick={() => { setActiveUser(u); setModalType('message'); setFormData({ ...formData, title: '', message: '' }) }}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <Send size={18} />
                      </button>
                      <button
                        onClick={() => { setActiveUser(u); setModalType('tier'); setFormData({ ...formData, tier: u.kyc_tier }) }}
                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                        title="Manage Tier"
                      >
                        <ArrowUpCircle size={18} />
                      </button>
                      <button
                        onClick={() => { setActiveUser(u); setModalType('status'); }}
                        className={`p-2 rounded-lg transition-colors ${u.status === 'active' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-green-50 text-green-600'}`}
                        title={u.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {u.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User / Account Modal */}
      {modalType === 'create_user' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-chase-navy mb-4 flex items-center gap-2">
              <UserPlus className="text-chase-blue" size={24} /> Create New User Account
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-4 text-left">
              {/* Required Credentials */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-chase-blue">Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Logan"
                      className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                      value={createForm.full_name}
                      onChange={e => setCreateForm({ ...createForm, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                      value={createForm.email}
                      onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +44 7123 456789"
                      className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                      value={createForm.phone}
                      onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Initial Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                      value={createForm.password}
                      onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Account Details & Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Number (Leave blank for auto-gen)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated 10-digit number"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-mono outline-none focus:border-chase-blue"
                    value={createForm.account_number}
                    onChange={e => setCreateForm({ ...createForm, account_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Type</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={createForm.account_type}
                    onChange={e => setCreateForm({ ...createForm, account_type: e.target.value })}
                  >
                    <option value="Savings Account">Savings Account</option>
                    <option value="Checking Account">Checking Account</option>
                    <option value="Corporate Account">Corporate Account</option>
                    <option value="Investment Account">Investment Account</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Starting Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-bold font-mono outline-none focus:border-chase-blue"
                    value={createForm.balance}
                    onChange={e => setCreateForm({ ...createForm, balance: e.target.value, ledger_balance: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Currency</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-bold outline-none focus:border-chase-blue"
                    value={createForm.currency}
                    onChange={e => setCreateForm({ ...createForm, currency: e.target.value })}
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">KYC Tier</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue font-bold"
                    value={createForm.kyc_tier}
                    onChange={e => setCreateForm({ ...createForm, kyc_tier: e.target.value })}
                  >
                    <option value="0">Tier 0 (Unverified)</option>
                    <option value="1">Tier 1 (Basic)</option>
                    <option value="2">Tier 2 (Verified)</option>
                    <option value="3">Tier 3 (VIP)</option>
                  </select>
                </div>
              </div>

              {/* Location & Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineer contractor"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={createForm.occupation}
                    onChange={e => setCreateForm({ ...createForm, occupation: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Date of Birth</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={createForm.dob}
                    onChange={e => setCreateForm({ ...createForm, dob: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-chase-border">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-chase-blue hover:bg-chase-navy text-white rounded-xl font-bold transition-colors shadow-lg"
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Edit User Account Modal */}
      {modalType === 'edit_full' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-chase-navy mb-4">
              Edit User Account: <span className="text-chase-blue">{userEditForm.full_name}</span>
            </h2>

            <form onSubmit={handleSaveFullUser} className="space-y-4 text-left">
              {/* Profile Picture Upload & Preview */}
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">User Profile Picture</label>
                <div className="flex items-center gap-4">
                  {userEditForm.profile_picture ? (
                    <img
                      src={userEditForm.profile_picture}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-chase-blue shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <UserCircle size={48} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Upload a JPG or PNG (simulates Cloudinary upload). The picture shows instantly below and across the platform.</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-chase-blue text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-chase-navy transition-colors">
                      <Upload size={14} /> Upload Picture
                      <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.full_name}
                    onChange={e => setUserEditForm({ ...userEditForm, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.email}
                    onChange={e => setUserEditForm({ ...userEditForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.phone}
                    onChange={e => setUserEditForm({ ...userEditForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.account_number}
                    onChange={e => setUserEditForm({ ...userEditForm, account_number: e.target.value })}
                  />
                </div>
              </div>

              {/* Financial Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Balance ({userEditForm.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-bold font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.balance}
                    onChange={e => setUserEditForm({ ...userEditForm, balance: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Ledger Balance ({userEditForm.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-bold font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.ledger_balance}
                    onChange={e => setUserEditForm({ ...userEditForm, ledger_balance: e.target.value })}
                  />
                </div>
              </div>

              {/* Codes & Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    placeholder="e.g. STRCGB2L"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.swift_code}
                    onChange={e => setUserEditForm({ ...userEditForm, swift_code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Routing Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 10-20-30"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.routing_code}
                    onChange={e => setUserEditForm({ ...userEditForm, routing_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">KYC Tier</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue font-bold"
                    value={userEditForm.kyc_tier}
                    onChange={e => setUserEditForm({ ...userEditForm, kyc_tier: e.target.value })}
                  >
                    <option value="0">Tier 0 (Unverified)</option>
                    <option value="1">Tier 1 (Basic)</option>
                    <option value="2">Tier 2 (Verified)</option>
                    <option value="3">Tier 3 (VIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Status</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue font-bold"
                    value={userEditForm.status}
                    onChange={e => setUserEditForm({ ...userEditForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="frozen">Frozen</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Manual Transfer Limit ({userEditForm.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-mono outline-none focus:border-chase-blue"
                    value={userEditForm.transfer_limit}
                    onChange={e => setUserEditForm({ ...userEditForm, transfer_limit: e.target.value })}
                  />
                </div>
              </div>

              {/* Location & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. California"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.state}
                    onChange={e => setUserEditForm({ ...userEditForm, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Zipcode</label>
                  <input
                    type="text"
                    placeholder="e.g. 90210"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.zipcode}
                    onChange={e => setUserEditForm({ ...userEditForm, zipcode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Type</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.account_type}
                    onChange={e => setUserEditForm({ ...userEditForm, account_type: e.target.value })}
                  >
                    <option value="Savings Account">Savings Account</option>
                    <option value="Checking Account">Checking Account</option>
                    <option value="Corporate Account">Corporate Account</option>
                    <option value="Investment Account">Investment Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineer contractor"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.occupation}
                    onChange={e => setUserEditForm({ ...userEditForm, occupation: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Date of Birth</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.dob}
                    onChange={e => setUserEditForm({ ...userEditForm, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Sex</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm outline-none focus:border-chase-blue"
                    value={userEditForm.sex}
                    onChange={e => setUserEditForm({ ...userEditForm, sex: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-chase-navy uppercase mb-1">Account Currency</label>
                  <select
                    className="w-full p-2.5 bg-white border border-chase-border rounded-lg text-sm font-bold outline-none focus:border-chase-blue"
                    value={userEditForm.currency}
                    onChange={e => setUserEditForm({ ...userEditForm, currency: e.target.value })}
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-chase-border">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-3 px-4 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-lg"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seed Transactions Modal */}
      {modalType === 'seed_tx' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8 p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
            <SeedTransactions
              embeddedUserId={activeUser?.id}
              onClose={() => setModalType(null)}
              onSuccess={fetchUsers}
            />
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {modalType === 'balance' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-chase-navy mb-4">Adjust Balance: {activeUser?.full_name}</h2>
            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'credit' })}
                  className={`py-2 rounded-lg font-bold border-2 transition-all ${formData.type === 'credit' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-100 text-gray-400'}`}
                >
                  ADD FUNDS
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'debit' })}
                  className={`py-2 rounded-lg font-bold border-2 transition-all ${formData.type === 'debit' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-100 text-gray-400'}`}
                >
                  DEDUCT
                </button>
              </div>
              <Input
                label="Amount"
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
              <Input
                label="Narration"
                placeholder="e.g. Manual Adjustment"
                value={formData.narration}
                onChange={e => setFormData({ ...formData, narration: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setModalType(null)}>Cancel</Button>
                <Button type="submit" className="flex-1" loading={submitting}>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {modalType === 'message' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-chase-navy mb-4">Message: {activeUser?.full_name}</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input
                label="Title"
                placeholder="Message subject"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-chase-navy">Message</label>
                <textarea
                  className="w-full p-3 border border-chase-border rounded-lg h-32 focus:border-chase-blue outline-none transition-colors"
                  placeholder="Enter your message..."
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setModalType(null)}>Cancel</Button>
                <Button type="submit" className="flex-1" loading={submitting}>Send Notification</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tier Management Modal */}
      {modalType === 'tier' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <ArrowUpCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-chase-navy mb-2">Manage KYC Tier: {activeUser?.full_name}</h2>
            <p className="text-gray-500 mb-6">Manually adjust the user's KYC verification tier.</p>

            <form onSubmit={handleUpdateTier} className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: t })}
                    className={`py-3 rounded-xl font-black border-2 transition-all ${
                      Number(formData.tier) === t
                      ? 'bg-chase-blue border-chase-blue text-white shadow-lg'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setModalType(null)}>Cancel</Button>
                <Button type="submit" className="flex-1" loading={submitting}>Update Tier</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {modalType === 'status' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeUser?.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {activeUser?.status === 'active' ? <Ban size={32} /> : <CheckCircle size={32} />}
            </div>
            <h2 className="text-xl font-bold text-chase-navy mb-2">
              {activeUser?.status === 'active' ? 'Suspend Account?' : 'Activate Account?'}
            </h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to {activeUser?.status === 'active' ? 'suspend' : 'activate'} <strong>{activeUser?.full_name}</strong>'s account?
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setModalType(null)}>Cancel</Button>
              <Button
                className={`flex-1 ${activeUser?.status === 'active' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                loading={submitting}
                onClick={() => handleUpdateStatus(activeUser?.status === 'active' ? 'suspended' : 'active')}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;