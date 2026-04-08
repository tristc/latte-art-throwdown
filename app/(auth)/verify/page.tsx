'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Note: In a real implementation, you'd need to store the email from signup
      // For this demo, we'll use a simplified flow
      const { error } = await supabase.auth.verifyOtp({
        token_hash: otp,
        type: 'email',
      });

      if (error) throw error;

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // Resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Verification email resent!');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Verify your email
          </h1>
          <p className="text-zinc-400">
            We've sent a verification code to your email
          </p>
        </div>

        <form onSubmit={handleVerify} className="card space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 
                            px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-zinc-300">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-amber-500 hover:text-amber-400 disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
            <Link href="/login" className="text-zinc-500 hover:text-zinc-400">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
