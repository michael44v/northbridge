import React from 'react';
import { Shield, Lock } from 'lucide-react';

const VisaLogo = () => (
  <svg className="h-6 w-auto inline-block" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.86 3.08L25.33 30.65H16.48L9.82 8.44C9.42 6.84 8.22 5.56 6.72 4.86C4.02 3.66 0 2.5 0 2.5L0.2 1.6H14.12C16.02 1.6 17.62 2.9 18.02 4.8L21.42 22.3L30.12 3.08H38.86ZM70.46 22.88C70.56 15.68 60.16 15.28 60.26 10.88C60.26 9.48 61.56 8.08 64.36 7.78C65.76 7.58 69.56 7.48 73.86 9.48L75.36 2.58C73.36 1.88 70.36 1.28 66.46 1.28C58.36 1.28 52.56 5.58 52.46 11.68C52.36 16.28 56.56 18.88 59.76 20.48C63.06 22.08 64.16 23.08 64.16 24.48C64.06 26.58 61.56 27.48 59.16 27.58C55.06 27.68 50.86 26.38 48.26 25.18L46.76 32.28C49.46 33.48 54.46 34.48 59.56 34.58C68.26 34.58 73.96 30.28 73.86 23.68M93.36 30.65H100L94.16 3.08H88.06C86.56 3.08 85.26 3.98 84.66 5.28L72.36 30.65H81.26L83.06 25.65H93.86L94.86 30.65M85.56 18.85L89.16 8.95L91.26 18.85H85.56ZM51.36 3.08L44.46 30.65H36.06L42.96 3.08H51.36Z" fill="white"/>
  </svg>
);

const MastercardLogo = () => (
  <svg className="h-7 w-auto inline-block" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="15" r="14" fill="#EB001B"/>
    <circle cx="32" cy="15" r="14" fill="#F79E1B" fillOpacity="0.9"/>
  </svg>
);

const CardLogo = ({ network }) => {
  const net = (network || 'visa').toLowerCase();
  if (net === 'mastercard') return <MastercardLogo />;
  return <VisaLogo />;
};

const VirtualCardUI = ({ card, revealed, onReveal, onFreeze }) => {
  const isFrozen = card?.status === 'frozen';

  const formatCardDigits = () => {
    if (revealed && card?.card_number) {
      const clean = card.card_number.replace(/\s+/g, '');
      if (clean.length === 16) {
        return clean.match(/.{1,4}/g).join('  ');
      }
      return card.card_number;
    }
    const last4 = card?.card_number_last4 || '****';
    return `••••  ••••  ••••  ${last4}`;
  };

  return (
    <div className={`relative w-full max-w-sm h-56 rounded-2xl p-6 text-white shadow-2xl transition-all overflow-hidden ${
      isFrozen ? 'grayscale opacity-80' : 'bg-gradient-to-br from-chase-navy via-chase-mid to-chase-blue'
    }`}>
      {/* Abstract Shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-chase-blue/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="font-serif font-bold text-lg tracking-tight text-amber-200">
            Meridian Trust <span className="font-sans font-normal opacity-70 text-xs block">Virtual Card</span>
          </div>
          <div className="text-right">
            <CardLogo network={card?.network} />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Card Number</p>
          <p className="text-xl font-mono tracking-[0.15em] font-bold">
            {formatCardDigits()}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-50">Expiry</p>
            <p className="font-bold">{revealed ? card?.expiry : '••/••'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold opacity-50">CVV</p>
            <p className="font-bold">{revealed ? card?.cvv : '•••'}</p>
          </div>
          <Shield size={24} className="opacity-50" />
        </div>
      </div>

      {isFrozen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <Lock size={32} />
            <span className="font-black uppercase tracking-widest text-sm">Card Frozen</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualCardUI;