import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, CreditCard, AlertCircle, CheckCircle, Lock } from 'lucide-react';

const CustomAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    account_number: '',
    account_name: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomAccounts();
  }, []);

  const fetchCustomAccounts = async () => {
    try {
      const res = await api.get('?action=admin_get_custom_accounts');
      if (res.data.status === 'success') {
        setAccounts(res.data.data);
      }
    } catch (e) {
      toast.error('Failed to load custom accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_create_custom_account', form);
      if (res.data.status === 'success') {
        toast.success('Custom account created');
        setShowCreateModal(false);
        setForm({ account_number: '', account_name: '', status: 'active' });
        fetchCustomAccounts();
      } else {
        toast.error(res.data.message || 'Error creating account');
      }
    } catch (e) {
      toast.error('Error creating custom account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await api.post('?action=admin_toggle_custom_account_status', { id, status: newStatus });
      if (res.data.status === 'success') {
        toast.success(`Account status updated to ${newStatus}`);
        fetchCustomAccounts();
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      toast.error('Failed to update account status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Custom Accounts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-chase-navy">Custom Accounts</h1>
          <p className="text-gray-500">Create and manage custom account numbers for transfer resolution and suspension controls.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={18} className="mr-2" /> Add Custom Account
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-chase-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-chase-border text-xs uppercase font-bold text-gray-500 tracking-wider">
                <th className="p-4">Account Holder Name</th>
                <th className="p-4">Account Number</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chase-border text-sm">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No custom accounts created yet.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-chase-navy">{acc.account_name}</td>
                    <td className="p-4 font-mono font-semibold text-chase-blue">{acc.account_number}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        acc.status === 'suspended'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {acc.status === 'suspended' ? <Lock size={12} /> : <CheckCircle size={12} />}
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(acc.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant={acc.status === 'suspended' ? 'outline' : 'secondary'}
                        className="text-xs px-3 py-1.5"
                        onClick={() => handleToggleStatus(acc.id, acc.status)}
                      >
                        {acc.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-chase-navy flex items-center gap-2">
              <CreditCard size={20} className="text-chase-blue" />
              Create Custom Account
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Account Name"
                placeholder="e.g. Settlement Vault / John Doe"
                value={form.account_name}
                onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                required
              />
              <Input
                label="Account Number"
                placeholder="10-digit or custom account string"
                value={form.account_number}
                onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-bold text-chase-navy uppercase tracking-wider">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-chase-border rounded-xl focus:ring-2 focus:ring-chase-blue outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} className="flex-1">
                  Save Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAccounts;
