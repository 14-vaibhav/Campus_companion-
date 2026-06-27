import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, register as registerApi, googleLogin } from '../services/authService';
import toast from 'react-hot-toast';

const HAS_GOOGLE_CLIENT = import.meta.env.VITE_GOOGLE_CLIENT_ID &&
  import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your-google-client-id-here.apps.googleusercontent.com';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ─── Email / Password ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginApi(form.email, form.password);
        const { token, user } = res.data;
        login(token, user);
        toast.success(`Welcome back, ${user.username}!`);
        navigate(user.role === 'admin' ? '/control-center' : '/home');
      } else {
        await registerApi(form.username, form.email, form.password);
        toast.success('Account created! Please sign in.');
        setMode('login');
        setForm(f => ({ ...f, username: '', password: '' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google OAuth ─── */
  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      // Exchange Google access token for app JWT via backend
      const res = await googleLogin(tokenResponse.access_token);
      const { token, user } = res.data;
      login(token, user);
      toast.success(`Welcome, ${user.username}!`);
      navigate(user.role === 'admin' ? '/control-center' : '/home');
    } catch (err) {
      // If backend doesn't have /api/auth/google yet, show clear message
      const msg = err.response?.status === 404
        ? 'Google login not configured on server yet. Use email login.'
        : err.response?.data?.message || 'Google sign-in failed';
      toast.error(msg, { duration: 5000 });
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => { toast.error('Google sign-in was cancelled'); setGoogleLoading(false); },
  });

  const handleGoogleClick = () => {
    if (!HAS_GOOGLE_CLIENT) {
      toast('Add your Google Client ID to .env → VITE_GOOGLE_CLIENT_ID', { icon: '🔧', duration: 5000 });
      return;
    }
    setGoogleLoading(true);
    triggerGoogleLogin();
  };

  /* ─── Guest ─── */
  const handleGuestLogin = () => {
    setGuestLoading(true);
    setTimeout(() => {
      loginAsGuest();
      toast('Browsing as Guest — sign in to unlock all features.', { icon: '👋' });
      navigate('/home');
      setGuestLoading(false);
    }, 600);
  };

  /* ─── Shared button style ─── */
  const socialBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '12px 16px', borderRadius: 'var(--radius-lg)',
    fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 15,
    cursor: 'pointer', transition: 'all 0.2s', width: '100%',
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #f4fafd 0%, #fff5f5 50%, #ffdad8 100%)',
    }}>
      {/* Sunset orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,107,0.20) 0%, transparent 70%)', top: -150, right: -100, pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(253,215,59,0.14) 0%, transparent 70%)', bottom: -200, left: -150, pointerEvents: 'none', animation: 'orbFloat 10s ease-in-out infinite reverse' }} />
      <div style={{ position: 'fixed', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,179,176,0.18) 0%, transparent 70%)', top: '35%', left: '5%', pointerEvents: 'none', animation: 'orbFloat 6s ease-in-out infinite 2s' }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: 'linear-gradient(135deg, #ae2f34, #ff6b6b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 16px 40px rgba(174,47,52,0.35)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 34 }}>school</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 32, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>CampusHub</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 6, fontSize: 15 }}>
            {mode === 'login' ? 'Welcome back to your campus.' : 'Join your campus community.'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)', borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 12px 40px rgba(174,47,52,0.12)',
          padding: '28px',
        }}>
          {/* Tab Toggle */}
          <div style={{ display: 'flex', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '10px', borderRadius: 'calc(var(--radius-lg) - 4px)',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                background: mode === m ? '#ffffff' : 'transparent',
                color: mode === m ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                boxShadow: mode === m ? '0 2px 8px rgba(174,47,52,0.10)' : 'none',
              }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon" style={{ fontSize: 22 }}>person</span>
                <input className="input-field" type="text" name="username" placeholder="Full Name"
                  value={form.username} onChange={handleChange} required autoComplete="name" />
              </div>
            )}
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon" style={{ fontSize: 22 }}>alternate_email</span>
              <input className="input-field" type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon" style={{ fontSize: 22 }}>lock</span>
              <input className="input-field" type={showPass ? 'text' : 'password'} name="password"
                placeholder="Password" value={form.password} onChange={handleChange} required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{ paddingRight: 48 }} />
              <button type="button" className="btn-icon" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-outline)' }}>
                  {showPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -6 }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
                  Forgot password?
                </button>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', marginTop: 4, opacity: loading ? 0.75 : 1, justifyContent: 'center' }}>
              {loading
                ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'spin 1s linear infinite' }}>progress_activity</span>{mode === 'login' ? ' Signing in...' : ' Creating account...'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-outline-variant)' }} />
            <span style={{ fontSize: 11, color: 'var(--color-outline)', fontWeight: 700, letterSpacing: '0.06em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-outline-variant)' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleClick} disabled={googleLoading}
            style={{ ...socialBtn, border: '1.5px solid var(--color-outline-variant)', background: 'rgba(255,255,255,0.92)', color: '#3c4043', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 10, opacity: googleLoading ? 0.75 : 1 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(174,47,52,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
          >
            {googleLoading
              ? <span className="material-symbols-outlined" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              : <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
            }
            {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
            {!HAS_GOOGLE_CLIENT && (
              <span style={{ marginLeft: 6, fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Setup needed</span>
            )}
          </button>

          {/* Guest */}
          <button onClick={handleGuestLogin} disabled={guestLoading}
            style={{ ...socialBtn, border: '1.5px dashed var(--color-outline-variant)', background: 'rgba(255,250,248,0.8)', color: 'var(--color-on-surface-variant)', opacity: guestLoading ? 0.7 : 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(174,47,52,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-outline-variant)'; e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.background = 'rgba(255,250,248,0.8)'; }}
          >
            {guestLoading
              ? <span className="material-symbols-outlined" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              : <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_outline</span>
            }
            {guestLoading ? 'Entering...' : 'Continue as Guest'}
          </button>

          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-outline)', textAlign: 'center', lineHeight: 1.5 }}>
            👀 Guest mode lets you browse all services without an account.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      `}</style>
    </div>
  );
}
