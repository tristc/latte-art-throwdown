import Link from 'next/link';
import { Coffee, Trophy, Users, Calendar } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-6">
            <Coffee className="w-5 h-5 text-amber-500" />
            <span className="text-amber-400 font-medium">The Ultimate Latte Art Competition Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Latte Art
            <span className="gradient-text"> Throwdown</span>
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Host and compete in professional latte art competitions. 
            Blind judging, real-time brackets, and photo voting — 
            all in one powerful PWA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto w-full">
          <div className="card card-hover">
            <Trophy className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tournament Brackets</h3>
            <p className="text-zinc-400">
              Automatic single elimination brackets with real-time progression
            </p>
          </div>

          <div className="card card-hover">
            <Users className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blind Judging</h3>
            <p className="text-zinc-400">
              Fair A vs B comparison voting with anonymous cups
            </p>
          </div>

          <div className="card card-hover">
            <Calendar className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Heat Management</h3>
            <p className="text-zinc-400">
              Built-in timers for practice, service, and cleanup phases
            </p>
          </div>
        </div>
      </section>

      {/* Install PWA CTA */}
      <section className="border-t border-zinc-800 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Install as an App</h2>
          <p className="text-zinc-400 mb-6">
            Add Latte Art Throwdown to your home screen for quick access.
            Works offline and feels like a native app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">1</span>
              <span>Open in Safari/Chrome</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">2</span>
              <span>Tap Share/Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">3</span>
              <span>Add to Home Screen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-zinc-500 text-sm">
          <p>© 2025 Latte Art Throwdown. Built for the coffee community.</p>
        </div>
      </footer>
    </div>
  );
}
