import React, { useState } from 'react';
import { Shield, X, Check, Lock, User, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  currentUser,
}) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSignIn({
        uid: `goog-${Date.now()}`,
        email: 'sit24sc025@sairamtap.edu.in',
        displayName: 'Sairam SRE Operator',
        role: 'admin',
      });
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSuccess(true);
    setTimeout(() => {
      onSignIn({
        uid: `usr-${Date.now()}`,
        email: email.trim(),
        displayName: displayName.trim() || email.split('@')[0],
        role,
      });
      setIsSuccess(false);
      onClose();
    }, 500);
  };

  const handleQuickPersona = (pEmail: string, pName: string, pRole: UserRole) => {
    setIsSuccess(true);
    setTimeout(() => {
      onSignIn({
        uid: `pers-${Date.now()}`,
        email: pEmail,
        displayName: pName,
        role: pRole,
      });
      setIsSuccess(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-mono text-xs text-zinc-100">
      <div className="bg-[#0c0e14] border border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-5 py-4 bg-[#08090f] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Operator Authentication Gate</h3>
              <p className="text-[11px] text-zinc-400 font-mono">RBAC Identity Verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Google Sign-in Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Single Sign-On (SSO)
              </span>
              <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40">
                RECOMMENDED
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mb-3">
              Authenticate via enterprise Google Workspace credentials for instant RBAC authorization.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold font-sans flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
            >
              {/* Google G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.6-5.2 3.6-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.07.72-2.45 1.16-4.03 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.25 21.46 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.2C.44 8.1 0 9.99 0 12s.44 3.9 1.2 5.42l4.08-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.54 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with sit24sc025@sairamtap.edu.in</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-[#0c0e14] px-3 text-[10px] text-zinc-500 uppercase tracking-widest absolute">
              Or Custom Credentials
            </span>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Operator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sre-lead@enterprise.internal"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Callsign / Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Operator Bravo"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">RBAC Authority</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="admin">Admin (Remediation)</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-sans transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black animate-spin" />
                  <span>Validating RBAC Tokens...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate Operator</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block mb-2">QUICK TEST PERSONAS:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('sre.commander@scyld.ai', 'Commander Ricardo', 'admin')}
                className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 text-left transition-colors"
              >
                <div className="font-bold text-zinc-200">SRE Commander</div>
                <div className="text-[10px] text-amber-400">Admin (Full Control)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('auditor@compliance.org', 'Lead Auditor', 'viewer')}
                className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-left transition-colors"
              >
                <div className="font-bold text-zinc-200">Security Auditor</div>
                <div className="text-[10px] text-zinc-400">Viewer (Audit Only)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
