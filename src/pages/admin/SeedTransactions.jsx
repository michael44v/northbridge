import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, ArrowLeft, Database, Calendar } from 'lucide-react';

export const defaultSeedTransactions = [
  { date: '2026-08-01', description: 'Salary Deposit - Apex Corp', amount: '4500.00', type: 'credit' },
  { date: '2026-08-03', description: 'Amazon Online Purchase', amount: '124.50', type: 'debit' },
  { date: '2026-08-05', description: 'Utility Bill Payment', amount: '85.20', type: 'debit' },
  { date: '2026-08-08', description: 'Consulting Fee Credit', amount: '1200.00', type: 'credit' },
  { date: '2026-08-10', description: 'Supermarket Grocery Purchase', amount: '210.35', type: 'debit' },
  { date: '2026-08-12', description: 'Dividend Transfer', amount: '350.00', type: 'credit' },
  { date: '2026-08-15', description: 'Gym Membership Subscription', amount: '49.99', type: 'debit' },
  { date: '2026-08-18', description: 'Coffee Shop Payment', amount: '14.25', type: 'debit' },
  { date: '2026-08-22', description: 'Investment Return Credit', amount: '800.00', type: 'credit' }
];

const SeedTransactions = ({ embeddedUserId, onClose, onSuccess }) => {
  const { userId: paramUserId } = useParams();
  const userId = embeddedUserId || paramUserId;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || '');
  const [transactions, setTransactions] = useState(defaultSeedTransactions);
  const [submitting, setSubmitting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(!embeddedUserId);

  useEffect(() => {
    if (!embeddedUserId) {
      fetchUsers();
    }
  }, [embeddedUserId]);

  useEffect(() => {
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [userId]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('?action=admin_get_users');
      if (res.data.status === 'success') {
        setUsers(res.data.data);
        if (!selectedUserId && res.data.data.length > 0) {
          setSelectedUserId(res.data.data[0].id);
        }
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const addRow = () => {
    const today = new Date().toISOString().split('T')[0];
    setTransactions([
      ...transactions,
      { date: today, description: 'New Transaction', amount: '100.00', type: 'credit' }
    ]);
  };

  const removeRow = (index) => {
    if (transactions.length <= 1) {
      toast.error('You must keep at least one transaction row.');
      return;
    }
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    if (transactions.length < 9) {
      toast.error('Minimum 9 transactions required to seed');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('?action=admin_seed_transactions', {
        user_id: selectedUserId,
        transactions: transactions.map(t => ({
          date: t.date,
          narration: t.description,
          amount: t.amount,
          type: t.type
        }))
      });

      if (res.data.status === 'success') {
        toast.success(res.data.message || 'Transactions seeded successfully!');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        if (!embeddedUserId) navigate('/admin/users');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to seed transactions');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-6">
      {!embeddedUserId && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-sm font-semibold text-gray-600 hover:text-chase-blue transition-colors"
          >
            <ArrowLeft size={16} className="mr-1.5" /> Back to Users
          </button>
          <h1 className="text-2xl font-bold text-chase-navy flex items-center gap-2">
            <Database className="text-chase-blue" size={24} /> Seed User Transactions
          </h1>
        </div>
      )}

      {!embeddedUserId && users.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-chase-border shadow-sm">
          <label className="block text-sm font-bold text-chase-navy mb-2">Select Target User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-chase-border rounded-lg outline-none focus:border-chase-blue"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name} ({u.email}) - Acc: {u.account_number}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-2xl border border-chase-border shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-chase-navy">Transaction History Rows ({transactions.length})</h2>
            <p className="text-xs text-gray-500">Edit the date, description/narration, amount and type for each transaction (min 9 txns).</p>
          </div>
          <Button type="button" variant="secondary" onClick={addRow} className="text-xs flex items-center gap-1">
            <Plus size={14} /> Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-chase-border text-xs font-bold text-gray-500 uppercase">
                <th className="p-3">#</th>
                <th className="p-3 min-w-[140px]">Date</th>
                <th className="p-3 min-w-[200px]">Description / Narration</th>
                <th className="p-3 min-w-[120px]">Type</th>
                <th className="p-3 min-w-[130px]">Amount</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chase-border">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-400">{idx + 1}</td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={tx.date}
                      onChange={(e) => handleRowChange(idx, 'date', e.target.value)}
                      className="w-full p-1.5 border border-chase-border rounded-lg text-xs outline-none focus:border-chase-blue bg-white"
                      required
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={tx.description}
                      onChange={(e) => handleRowChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Salary Credit"
                      className="w-full p-1.5 border border-chase-border rounded-lg text-xs outline-none focus:border-chase-blue bg-white"
                      required
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={tx.type}
                      onChange={(e) => handleRowChange(idx, 'type', e.target.value)}
                      className={`w-full p-1.5 border border-chase-border rounded-lg text-xs font-bold outline-none ${
                        tx.type === 'credit' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                      }`}
                    >
                      <option value="credit">Credit (+)</option>
                      <option value="debit">Debit (-)</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={tx.amount}
                      onChange={(e) => handleRowChange(idx, 'amount', e.target.value)}
                      className="w-full p-1.5 border border-chase-border rounded-lg text-xs font-mono font-bold outline-none focus:border-chase-blue bg-white"
                      required
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-chase-border">
          {onClose && (
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="button" onClick={handleSave} loading={submitting} className="flex items-center gap-2">
            <Save size={16} /> Seed Transactions ({transactions.length})
          </Button>
        </div>
      </div>
    </div>
  );

  return content;
};

export default SeedTransactions;
