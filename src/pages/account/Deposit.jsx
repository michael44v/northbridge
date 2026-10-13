import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, ShieldCheck, Copy, CheckCircle2, Upload, AlertCircle, Eye, EyeOff, PlusCircle, Bitcoin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('crypto'); // Default to crypto deposit
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 3: Completed pending review

  // Card details state
  const [card, setCard] = useState(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [revealedCardDetails, setRevealedCardDetails] = useState(null);

  // Crypto / receipt state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState('');
  const btcAddress = "bc1q02jp6lut3qrjs746q7xtjdz4me29erg5weyukn";

  useEffect(() => {
    fetchSavedCard();
  }, []);

  const fetchSavedCard = async () => {
    setCardLoading(true);
    try {
      const res = await api.get('?action=get_card_details_basic');
      if (res.data.status === 'success' && res.data.data) {
        setCard(res.data.data);
      } else {
        setCard(null);
      }
    } catch (e) {
      setCard(null);
    } finally {
      setCardLoading(false);
    }
  };

  const handleRevealCard = async (e) => {
    e.preventDefault();
    if (!pin || pin.length < 4) return toast.error('Enter 4-digit PIN');
    setLoading(true);
    try {
      const res = await api.post('?action=get_card_details', { pin });
      if (res.data.status === 'success') {
        setRevealedCardDetails(res.data.data);
        setRevealed(true);
        setShowPinModal(false);
        setPin('');
        toast.success('Card details revealed');
      } else {
        toast.error(res.data.message || 'Invalid PIN');
      }
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF receipt');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptUrl(reader.result);
      setReceiptFile(file);
      toast.success('Receipt attached');
    };
    reader.readAsDataURL(file);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid deposit amount');

    if (method === 'crypto') {
      if (!receiptUrl) {
        return toast.error('Please upload your payment receipt before submitting');
      }

      setLoading(true);
      try {
        const res = await api.post('?action=deposit', {
          method: 'crypto',
          amount: parseFloat(amount),
          receipt_url: receiptUrl
        });

        if (res.data.status === 'success') {
          setStep(3);
          toast.success('Deposit submitted for admin approval!');
        } else {
          toast.error(res.data.message || 'Deposit failed');
        }
      } catch (err) {
        toast.error('Failed to submit deposit');
      } finally {
        setLoading(false);
      }
    } else if (method === 'card') {
      setLoading(true);
      try {
        const res = await api.post('?action=deposit', {
          method: 'card',
          amount: parseFloat(amount)
        });

        if (res.data.status === 'success') {
          setStep(3);
          toast.success('Card deposit processed successfully');
        } else {
          toast.error(res.data.message || 'Deposit failed');
        }
      } catch (err) {
        toast.error('Deposit failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-chase-navy">Deposit & Add Funds</h1>
        <p className="text-gray-500">Add funds to your account via Crypto (BTC) or Saved Card</p>
      </div>

      {/* Saved Card Section */}
      <div className="bg-white rounded-2xl border border-chase-border p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-chase-navy flex items-center gap-2">
            <CreditCard className="text-chase-blue" size={20} /> Saved Card
          </h2>
          <span className="text-xs text-gray-400 font-medium">(Carding is optional)</span>
        </div>

        {cardLoading ? (
          <div className="text-sm text-gray-500 italic py-2">Checking saved card...</div>
        ) : !card ? (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={24} />
              <div>
                <p className="text-sm font-bold text-amber-900">No Saved Card Found</p>
                <p className="text-xs text-amber-700">You haven't added a virtual card yet. Adding a card is optional for deposits.</p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/account/cards')} className="whitespace-nowrap">
              <PlusCircle size={16} className="mr-1.5" /> Add Card
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-chase-navy via-chase-mid to-chase-blue text-white p-5 rounded-2xl relative shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">Meridian Trust Card</p>
                <p className="text-xs font-semibold text-gray-200">{card.network?.toUpperCase() || 'VISA'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (revealed) {
                    setRevealed(false);
                    setRevealedCardDetails(null);
                  } else {
                    setShowPinModal(true);
                  }
                }}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealed ? 'Hide Details' : 'See Card Details'}
              </button>
            </div>

            <div className="font-mono text-lg tracking-widest font-bold">
              {revealed && revealedCardDetails ? (
                revealedCardDetails.card_number
              ) : (
                `•••• •••• •••• ${card.card_number_last4}`
              )}
            </div>

            <div className="flex justify-between items-end text-xs font-mono">
              <div>
                <span className="text-[9px] uppercase block text-gray-300">Expiry</span>
                <span className="font-bold">{revealed && revealedCardDetails ? revealedCardDetails.expiry : '••/••'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase block text-gray-300">CVV</span>
                <span className="font-bold">{revealed && revealedCardDetails ? revealedCardDetails.cvv : '***'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase block text-gray-300">Status</span>
                <span className="font-bold uppercase text-green-300">{card.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Deposit Section */}
      <div className="bg-white rounded-2xl border border-chase-border shadow-lg overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-chase-navy">Select Deposit Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod('crypto')}
                className={`p-5 rounded-2xl border-2 transition-all text-left space-y-2 ${
                  method === 'crypto'
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                    : 'border-gray-100 hover:border-amber-400/50'
                }`}
              >
                <div className={`p-3 rounded-xl inline-block ${method === 'crypto' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Bitcoin size={24} />
                </div>
                <div>
                  <p className="font-bold text-chase-navy">Pay in Crypto (BTC)</p>
                  <p className="text-xs text-gray-500">Pay via BTC & upload receipt for admin approval</p>
                </div>
              </button>

              {card && (
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-5 rounded-2xl border-2 transition-all text-left space-y-2 ${
                    method === 'card'
                      ? 'border-chase-blue bg-chase-light/30 ring-1 ring-chase-blue'
                      : 'border-gray-100 hover:border-chase-blue/50'
                  }`}
                >
                  <div className={`p-3 rounded-xl inline-block ${method === 'card' ? 'bg-chase-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-chase-navy">Pay with Saved Card</p>
                    <p className="text-xs text-gray-500">Direct card deposit</p>
                  </div>
                </button>
              )}
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-6 pt-4 animate-fade-in">
              <Input
                label="Amount to Deposit (USD)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              {method === 'crypto' && (
                <div className="space-y-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">BTC Deposit Address</label>
                    <div className="flex items-center gap-2 bg-white p-3.5 rounded-xl border border-gray-300">
                      <p className="font-mono text-xs sm:text-sm font-bold text-chase-navy break-all flex-1">{btcAddress}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(btcAddress)}
                        className="p-2 text-chase-blue hover:text-chase-navy hover:bg-gray-100 rounded-lg shrink-0"
                        title="Copy Address"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block">Upload Payment Receipt *</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        receiptUrl ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-chase-blue bg-white'
                      }`}>
                        <Upload className={`mx-auto mb-2 ${receiptUrl ? 'text-green-600' : 'text-gray-400'}`} size={32} />
                        <p className="text-sm font-medium text-gray-700">
                          {receiptFile ? `Attached: ${receiptFile.name}` : 'Click or drop file to upload receipt'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</p>
                      </div>
                    </div>
                    {receiptUrl && (
                      <p className="text-xs font-bold text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 size={14} /> Receipt attached successfully!
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-chase-light/50 p-4 rounded-xl flex gap-3 items-center border border-chase-border">
                <ShieldCheck className="text-chase-blue shrink-0" size={20} />
                <p className="text-xs text-chase-navy/70 font-medium">All deposit transactions are verified and protected with 256-bit encryption.</p>
              </div>

              <Button type="submit" className="w-full py-4 text-lg font-bold" loading={loading}>
                Submit Deposit <ArrowRight className="ml-2" size={20} />
              </Button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 size={80} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-chase-navy">
              {method === 'crypto' ? 'Deposit Submitted for Approval!' : 'Deposit Successful!'}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
              {method === 'crypto'
                ? `Your BTC crypto deposit request of $${amount} and receipt have been submitted to the admin for review. Your account balance will reflect once approved.`
                : `Your card deposit of $${amount} has been processed and credited to your account.`}
            </p>
            <div className="pt-4 max-w-sm mx-auto">
              <Button onClick={() => navigate('/dashboard')} className="w-full py-3 font-bold">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-chase-navy text-center mb-2">Enter Transaction PIN</h3>
            <p className="text-xs text-gray-500 text-center mb-6">Enter your 4-digit PIN to unmask saved card details</p>

            <form onSubmit={handleRevealCard} className="space-y-6">
              <Input
                type="password"
                placeholder="••••"
                maxLength="4"
                className="text-center text-2xl tracking-[1em]"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                autoFocus
              />
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" type="button" onClick={() => setShowPinModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={loading}>
                  Verify
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;