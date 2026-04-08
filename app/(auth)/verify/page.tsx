'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Checking your account...');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if user is already logged in and confirmed
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        // User is logged in, check if email is confirmed
        if (session.user.email_confirmed_at) {
          // Email confirmed, go to dashboard
          router.push('/dashboard');
          return;
        } else {
          // Waiting for confirmation
          const pendingEmail = localStorage.getItem('pendingVerificationEmail');
          if (pendingEmail) {
            setEmail(pendingEmail);
          }
          setMessage('Please check your email and click the confirmation link.');
          setLoading(false);
        }
      } else {
        // No session, check if there's a pending email
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        if (pendingEmail) {
          setEmail(pendingEmail);
          setMessage('Please check your email and click the confirmation link we sent to ' + pendingEmail);
        } else {
          setMessage('No pending verification found. Please sign up or log in.');
        }
        setLoading(false);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try signing up again.');
      setLoading(false);
    }
  };

  const handleCheckAgain = async () => {
    setLoading(true);
    await checkSession();
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
        </div>

        <div className="card space-y-6 text-center">
          {loading ? (
            <div className="py-8">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-zinc-400">{message}</p>
            </div>
          ) : (
            <>
              <p className="text-zinc-300">{message}</p>
              
              {email && (
                <div className="bg-zinc-800/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-zinc-500 mb-2">Sent to:</p>
                  <p className="text-amber-400 font-medium">{email}</p>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleCheckAgain}
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Checking...' : "I've confirmed my email"}
                </button>

                <Link
                  href="/login"
                  className="block w-full text-center text-zinc-500 hover:text-zinc-400 text-sm"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-zinc-500">
          <p>Didn't receive the email?</p>
          <p className="mt-1">Check your spam folder or{</p>
          <a href="/signup" className="text-amber-500 hover:text-amber-400">
            try signing up again
          </a>
        </div>
      </div>
    </div>
  );
}
