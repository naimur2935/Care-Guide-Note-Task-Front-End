import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, LoaderCircle, ShieldCheck, Users } from 'lucide-react';
import { api, toList } from './api.js';
import BrandMark from './components/BrandMark.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import { Field } from './components/ui.jsx';
import Toast from './components/Toast.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import InterestGroupsPage from './pages/InterestGroupsPage.jsx';
import NoteEditorPage from './pages/NoteEditorPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem('notes-token') || localStorage.getItem('token'),
  );
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(token));
  const [bootError, setBootError] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    api('/auth/me', { token })
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch((error) => {
        localStorage.removeItem('notes-token');
        localStorage.removeItem('notes-user');
        localStorage.removeItem('token');
        localStorage.removeItem('me');
        if (active) {
          setToken(null);
          setBootError(error.message);
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const showNotice = useCallback((message, type = 'success') => {
    setNotice({ message, type, key: Date.now() });
  }, []);

  function startSession(data) {
    localStorage.setItem('notes-token', data.token);
    localStorage.setItem('notes-user', JSON.stringify(data.user));
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    setToken(data.token);
    setUser(data.user);
    setBootError('');
  }

  function signOut() {
    localStorage.removeItem('notes-token');
    localStorage.removeItem('notes-user');
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    setToken(null);
    setUser(null);
    showNotice('You have been signed out.');
  }

  return (
    <BrowserRouter>
      {checkingSession ? (
        <div className={"[.note-editor-page_&]:h-auto [.note-editor-page_&]:min-h-[240px] [height:100vh] [display:flex] [align-items:center] [justify-content:center] [gap:9px] [color:#68756c] [font-size:12px]"}><LoaderCircle className={"animate-spin"} size={26} /><span>Loading your account…</span></div>
      ) : (
        <AppRoutes
          user={user}
          onSession={startSession}
          onSignOut={signOut}
          initialError={bootError}
          notify={showNotice}
        />
      )}
      <Toast notice={notice} onDismiss={() => setNotice(null)} />
    </BrowserRouter>
  );
}

function AppRoutes({ user, onSession, onSignOut, initialError, notify }) {
  const navigate = useNavigate();

  function handleSession(data) {
    onSession(data);
    navigate('/overview', { replace: true });
  }

  const authPage = (mode) => (
    user
      ? <Navigate to="/overview" replace />
      : <AuthScreen mode={mode} onSession={handleSession} initialError={initialError} />
  );

  return (
    <Routes>
      <Route path="/login" element={authPage('login')} />
      <Route path="/signup" element={authPage('signup')} />
      <Route
        element={user
          ? <DashboardLayout user={user} onSignOut={onSignOut} />
          : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage user={user} notify={notify} />} />
        <Route path="/notes" element={<NotesPage notify={notify} />} />
        <Route path="/notes/new" element={<NoteEditorPage notify={notify} />} />
        <Route path="/notes/:noteId/edit" element={<NoteEditorPage notify={notify} />} />
        <Route path="/community" element={<CommunityPage user={user} notify={notify} />} />
        <Route path="/interests" element={<InterestGroupsPage notify={notify} />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminPage user={user} notify={notify} /> : <Navigate to="/overview" replace />}
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/overview' : '/login'} replace />} />
    </Routes>
  );
}

function AuthScreen({ mode, onSession, initialError }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === 'signup';
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    if (isRegister && password.length < 6) {
      setError('Choose a password with at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      const data = await api(isRegister ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: isRegister
          ? {
              name: String(form.get('name') || '').trim(),
              email,
              password,
              interests: toList(String(form.get('interests') || '')),
            }
          : { email, password },
      });
      onSession(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={"[min-height:100vh] [min-height:100svh] [padding:24px_16px] [display:grid] [place-items:center] [background:#f7f8f6] max-[560px]:[padding:16px]"}>
      <section className={"[width:min(100%,_420px)] [padding:29px] [background:#fff] [border:1px_solid_var(--line)] [border-radius:10px] [box-shadow:0_8px_30px_#253b2d0b] max-[560px]:[padding:22px_18px]"}>
        <header className={"[display:flex] [align-items:center] [justify-content:center] [gap:9px] [margin-bottom:23px] [color:#27382d] [font-size:16px] [font-weight:700]"}><BrandMark /><span>Note & Activity Tracker</span></header>
        <div className={"[text-align:center] [&_h1]:[margin:9px_0_5px] [&_h1]:[color:var(--ink)] [&_h1]:[font:25px/1.25_var(--serif)] [&_p]:[margin:0] [&_p]:[color:var(--muted)] [&_p]:[font-size:12px] [&_p]:[line-height:1.6] max-[560px]:[&_h1]:[font-size:22px]"}>
          <span className={"[color:var(--green)] [font-size:9px] [font-weight:700] [letter-spacing:1.2px]"}>{isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isRegister ? 'Enter your details to get started.' : 'Sign in to see your notes.'}</p>
        </div>
        <form onSubmit={submit} className={"[display:grid] [gap:14px] [margin-top:23px] max-[560px]:[gap:12px] max-[560px]:[margin-top:17px]"}>
          {isRegister && <Field label="Name" name="name" placeholder="Your name" autoComplete="name" required />}
          <Field label="Email address" name="email" placeholder="you@example.com" type="email" autoComplete="email" required />
          <label className={"[min-width:0] [display:grid] [gap:6px] [color:#455149] [font-size:12px] [font-weight:600] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_textarea]:[width:100%] [&_textarea]:[min-width:0] [&_textarea]:[padding:10px_11px] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:#fff] [&_textarea]:[border:1px_solid_#dfe5df] [&_textarea]:[border-radius:6px] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:[font-weight:400] [&_select]:[width:100%] [&_select]:[min-width:0] [&_select]:[padding:10px_11px] [&_select]:[color:var(--ink)] [&_select]:[background:#fff] [&_select]:[border:1px_solid_#dfe5df] [&_select]:[border-radius:6px] [&_select]:[outline:none] [&_select]:[font-size:13px] [&_select]:[font-weight:400] [&_textarea]:[resize:vertical] [&_textarea]:[line-height:1.6] [&_input::placeholder]:[color:#a2aaa4] [&_textarea::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [&_textarea:focus]:[border-color:#7da389] [&_textarea:focus]:[box-shadow:0_0_0_3px_#58836317] [&_select:focus]:[border-color:#7da389] [&_select:focus]:[box-shadow:0_0_0_3px_#58836317] [&_small]:[color:var(--soft)] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"}>
            <span>Password</span>
            <div className={"[position:relative] [&_input]:[padding-right:54px]"}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 6 : undefined}
                required
              />
              <button type="button" className={"[position:absolute] [top:50%] [right:10px] [transform:translateY(-50%)] [padding:4px] [color:var(--green)] [background:transparent] [border:0] [font-size:11px] [font-weight:600]"} onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {isRegister && <Field label="Interests (optional)" name="interests" placeholder="Reading, design, cooking" hint="Separate interests with commas." />}
          {error && <div className={"[padding:9px_11px] [color:#a34a40] [background:#fff2ef] [border:1px_solid_#f2d8d3] [border-radius:6px] [font-size:11px] [line-height:1.5]"} role="alert">{error}</div>}
          <button type="submit" className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)] [width:100%] [min-height:42px] [margin-top:1px]"} disabled={busy}>
            {busy && <LoaderCircle className={"animate-spin"} size={17} />}
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            {!busy && <ArrowRight size={17} />}
          </button>
        </form>
        <div className={"[display:flex] [justify-content:center] [align-items:center] [flex-wrap:wrap] [gap:5px] [margin-top:19px] [padding-top:16px] [border-top:1px_solid_#edf0ed] [color:var(--muted)] [font-size:11px] [&_button]:[padding:0] [&_button]:[color:var(--green)] [&_button]:[background:none] [&_button]:[border:0] [&_button]:[font-size:11px] [&_button]:[font-weight:700]"}>
          {isRegister ? 'Already have an account?' : 'New to Note & Activity Tracker?'}
          <button type="button" onClick={() => navigate(isRegister ? '/login' : '/signup')}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>
        <div className={"[display:flex] [align-items:center] [justify-content:center] [gap:5px] [margin-top:17px] [color:var(--soft)] [font-size:10px]"}><ShieldCheck size={14} /> Your notes are only visible to you.</div>
      </section>
    </main>
  );
}

export default App;
