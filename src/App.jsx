import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Supabase ──────────────────────────────────────────────────────────────────
// 🔧 Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://qenorezexgpzvxsogpzi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u3uDFKChn86Mv-WLVopRuw_nQfgaQOe";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  teal: "#0D7A6B", tealL: "#12A08C", tealD: "#085C50", tealF: "#E6F5F2",
  amber: "#E8912A", navy: "#1A2E44", text: "#1C2B3A",
  muted: "#5A7080", light: "#8A9EAD", bg: "#F7FAF9", border: "#D8E8E4",
};
const catCol = {
  Health: { bg: "#E6F5F2", text: "#0D7A6B", bdr: "#A8D8D0" },
  Financial: { bg: "#FDF3E7", text: "#B86B10", bdr: "#F0C88A" },
  Legal: { bg: "#EEF0FB", text: "#3D4FBF", bdr: "#B0B8F0" },
  Social: { bg: "#FBF0F5", text: "#A03070", bdr: "#EAB0D0" },
};
const catIcon = { Health: "🏥", Financial: "💰", Legal: "⚖️", Social: "🤝" };

const OFFICES = [
  { name: "OSCA – Office for Senior Citizens Affairs", addr: "City Hall, Cabanatuan City", contact: "+63 919 081 3749", hours: "Mon–Fri, 8AM–5PM", icon: "🏛️" },
  { name: "CSWDO – City Social Welfare & Development", addr: "City Hall Compound, Cabanatuan City", contact: "091-908-10246", hours: "Mon–Fri, 8AM–5PM", icon: "🤝" },
  { name: "CPDAO – City PWD Affairs Office", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 958 5270", hours: "Mon–Fri, 8AM–5PM", icon: "♿" },
  { name: "City Health Office", addr: "City Hall Compound, Cabanatuan City", contact: "09190811348", hours: "Mon–Fri, 8AM–5PM", icon: "🏥" },

];
const REQS = [
  { title: "Senior Citizen (OSCA ID)", icon: "👴", reqs: ["Original PSA Birth Certificate", "1 Valid Government-issued ID", "2 pcs 1×1 colored ID photo", "Proof of residency (barangay certificate)"], where: "OSCA Office, City Hall, Cabanatuan City", contact: "+63 919 081 3749" },
  { title: "Person with Disability (PWD ID)", icon: "♿", reqs: ["Medical Certificate from a licensed physician", "PSA Birth Certificate or valid government ID", "2 pcs 1×1 colored ID photo", "Barangay certificate of residency"], where: "CPDAO Office, City Hall Annex, Cabanatuan City", contact: "(044) 958 5270" },
];

function generateIDNumber(type) {
  const prefix = type === "senior" ? "OSCA" : "PWD";
  return `${prefix}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
}

// ── Shared CSS ────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { width:100%!important; max-width:none!important; overflow-x:hidden; background:#F7FAF9; font-family:'Lora',Georgia,serif; }
  #root { width:100%!important; max-width:none!important; }
  .w  { width:100%; padding-left:40px; padding-right:40px; }
  .btn-p  { display:inline-flex;align-items:center;gap:6px;background:#0D7A6B;color:#fff;border:none;padding:11px 24px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s,transform .1s;white-space:nowrap; }
  .btn-p:hover  { background:#085C50;transform:translateY(-1px); }
  .btn-o  { display:inline-flex;align-items:center;gap:6px;background:transparent;color:#0D7A6B;border:1.5px solid #0D7A6B;padding:10px 22px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap; }
  .btn-o:hover  { background:#E6F5F2; }
  .btn-red { display:inline-flex;align-items:center;gap:6px;background:transparent;color:#C0392B;border:1.5px solid #C0392B;padding:7px 16px;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s; }
  .btn-red:hover { background:#FFF5F5; }
  .card { background:#fff;border:1px solid #D8E8E4;border-radius:14px;transition:box-shadow .2s,transform .2s; }
  .card:hover { box-shadow:0 6px 24px rgba(13,122,107,.13);transform:translateY(-2px); }
  .pill { display:inline-block;font-size:11px;font-family:'DM Sans',sans-serif;font-weight:600;padding:3px 10px;border-radius:20px; }
  .nb { font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;background:none;border:none;cursor:pointer;padding:7px 13px;border-radius:8px;color:#5A7080;transition:all .15s; }
  .nb:hover { color:#0D7A6B;background:#E6F5F2; }
  .nb.on { color:#0D7A6B;background:#E6F5F2;font-weight:600; }
  .cp { font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;padding:7px 16px;border-radius:20px;cursor:pointer;border:1.5px solid transparent;transition:all .15s; }
  .si { width:100%;padding:12px 16px 12px 44px;border:1.5px solid #D8E8E4;border-radius:10px;font-size:15px;color:#1C2B3A;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s; }
  .si:focus { border-color:#0D7A6B; }
  .fi { width:100%;padding:12px 16px;border:1.5px solid #D8E8E4;border-radius:10px;font-size:15px;color:#1C2B3A;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s; }
  .fi:focus { border-color:#0D7A6B;box-shadow:0 0 0 3px rgba(13,122,107,.08); }
  .fi.err { border-color:#C0392B; }
  .sel { width:100%;padding:12px 16px;border:1.5px solid #D8E8E4;border-radius:10px;font-size:15px;color:#1C2B3A;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;appearance:none;cursor:pointer; }
  .sel:focus { border-color:#0D7A6B;box-shadow:0 0 0 3px rgba(13,122,107,.08); }
  .ir { display:flex;gap:8px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0f4f3;font-family:'DM Sans',sans-serif;font-size:14px; }
  .ir:last-child { border-bottom:none; }
  .fqb { width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:18px 0;font-family:'Lora',serif;font-size:16px;font-weight:600;color:#1C2B3A;display:flex;justify-content:space-between;align-items:center;gap:12px; }
  .oc { background:#fff;border:1px solid #D8E8E4;border-radius:14px;padding:22px;display:flex;gap:16px;transition:box-shadow .2s; }
  .oc:hover { box-shadow:0 4px 20px rgba(13,122,107,.10); }
  .ov { position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px; }
  .mo { background:#fff;border-radius:18px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;padding:32px;position:relative;animation:sUp .22s ease; }
  @keyframes sUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .fd { animation:fUp .35s ease both; }
  @keyframes fUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .g2 { display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px; }
  .g4 { display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px; }
  .hero { display:flex;gap:48px;align-items:center;padding:56px 0 40px; }
  .st { display:grid;grid-template-columns:1fr 1fr;gap:14px;flex-shrink:0; }
  .auth-bg { min-height:100vh;display:flex;align-items:stretch;background:linear-gradient(135deg,#0D7A6B 0%,#085C50 55%,#1A2E44 100%); }
  .auth-left { flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:60px 64px;color:#fff; }
  .auth-right { width:500px;flex-shrink:0;background:#fff;display:flex;flex-direction:column;justify-content:center;padding:52px 48px;overflow-y:auto; }
  .form-group { margin-bottom:16px; }
  .form-label { display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#1C2B3A;margin-bottom:6px; }
  .err-msg { font-family:'DM Sans',sans-serif;font-size:12px;color:#C0392B;margin-top:5px; }
  .id-card { background:linear-gradient(135deg,#0D7A6B 0%,#085C50 100%);border-radius:18px;padding:28px;color:#fff;position:relative;overflow:hidden; }
  .id-card::before { content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.07); }
  .id-card::after  { content:'';position:absolute;bottom:-40px;left:-20px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.05); }
  .toast { position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:99999;padding:13px 24px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;box-shadow:0 4px 24px rgba(0,0,0,.18);animation:toastIn .25s ease;white-space:nowrap; }
  @keyframes toastIn { from{opacity:0;transform:translate(-50%,12px)} to{opacity:1;transform:translate(-50%,0)} }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#12A08C;border-radius:3px}
  @media(max-width:900px){
    .auth-left{display:none} .auth-right{width:100%;padding:40px 28px}
    .hero{flex-direction:column} .st{width:100%;grid-template-columns:1fr 1fr} .w{padding-left:16px;padding-right:16px}
  }
  @media(max-width:640px){
    .nav-links{display:none!important}
    .nav-mobile-menu{display:flex!important}
    .g2{grid-template-columns:1fr!important}
    .g4{grid-template-columns:1fr 1fr!important}
    .reg-grid{grid-template-columns:1fr!important}
    .reg-grid .form-group{grid-column:span 1!important}
    .cta-box{flex-direction:column!important;align-items:flex-start!important;gap:16px!important;padding:24px 20px!important}
    .st{grid-template-columns:1fr 1fr!important}
    .fqb{font-size:14px}
    .mo{padding:22px 18px;max-height:95vh}
    .id-grid{grid-template-columns:1fr!important}
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser(session.user);
        setUserProfile(profile);
        setScreen("app");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setCurrentUser(null); setUserProfile(null); setScreen("login"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
    return data;
  };

  const handleLogin = async (user, profile) => {
    setCurrentUser(user);
    setUserProfile(profile);
    showToast(`Welcome back, ${profile.first_name}!`);
    setScreen("app");
  };

  const handleRegister = async (user, profile) => {
    setCurrentUser(user);
    setUserProfile(profile);
    showToast(`Account created! Welcome, ${profile.first_name}!`);
    setScreen("app");
  };

  const handleUpdateProfile = (updated) => setUserProfile(updated);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    showToast("Logged out successfully.", "info");
    setScreen("login");
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className="toast" style={{ background: toast.type === "success" ? T.teal : toast.type === "error" ? "#C0392B" : T.navy, color: "#fff" }}>
          {toast.msg}
        </div>
      )}
      {screen === "login" && <LoginPage onLogin={handleLogin} goRegister={() => setScreen("register")} showToast={showToast} />}
      {screen === "register" && <RegisterPage onRegister={handleRegister} goLogin={() => setScreen("login")} showToast={showToast} />}
      {screen === "app" && currentUser && userProfile && (
        <MainApp
          currentUser={currentUser}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          showToast={showToast}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin, goRegister, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    if (!pass) e.pass = "Password is required.";
    setErrs(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase(), password: pass });
    if (error) {
      setErrs({ pass: error.message.includes("Invalid") ? "Incorrect email or password." : error.message });
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single();
    setLoading(false);
    onLogin(data.user, profile);
  };

  return (
    <div className="auth-bg fd">
      <div className="auth-left">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 50, height: 50, background: "rgba(255,255,255,.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 24, color: "#fff" }}>KalingaNet</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.6)" }}>Cabanatuan City</div>
          </div>
        </div>
        <h1 style={{ fontSize: "clamp(26px,3vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
          Your gateway to<br />city services.
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.85, maxWidth: 380 }}>
          Sign in to access benefits, apply for your OSCA or PWD ID, and stay updated on programs for senior citizens and persons with disability.
        </p>
      </div>
      <div className="auth-right">
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Sign In</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted }}>Welcome back. Enter your credentials to continue.</p>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className={`fi ${errs.email ? "err" : ""}`} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          {errs.email && <div className="err-msg">{errs.email}</div>}
        </div>
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label className="form-label">Password</label>
          <input className={`fi ${errs.pass ? "err" : ""}`} type="password" placeholder="Your password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
          {errs.pass && <div className="err-msg">{errs.pass}</div>}
        </div>
        <button className="btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15, marginBottom: 22 }} onClick={submit} disabled={loading}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <div style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted }}>
          Don't have an account?{" "}
          <button onClick={goRegister} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, textDecoration: "underline" }}>
            Create one here
          </button>
        </div>
        <div style={{ marginTop: 36, padding: "16px 18px", background: T.tealF, borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.tealD, lineHeight: 1.65 }}>
          <strong>📋 New here?</strong> Create a free account to apply for your OSCA or PWD ID and access all city services online.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER PAGE
// ══════════════════════════════════════════════════════════════════════════════
function RegisterField({ label, k, type = "text", placeholder, span = 1, d, errs, set }) {
  return (
    <div className="form-group" style={{ gridColumn: `span ${span}` }}>
      <label className="form-label">{label}</label>
      <input className={`fi ${errs[k] ? "err" : ""}`} type={type} placeholder={placeholder} value={d[k]} onChange={e => set(k, e.target.value)} />
      {errs[k] && <div className="err-msg">{errs[k]}</div>}
    </div>
  );
}

function RegisterPage({ onRegister, goLogin, showToast }) {
  const [d, setD] = useState({ firstName: "", lastName: "", email: "", birthdate: "", contact: "", address: "", password: "", confirmPassword: "" });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!d.firstName.trim()) e.firstName = "First name is required.";
    if (!d.lastName.trim()) e.lastName = "Last name is required.";
    if (!d.email.trim() || !d.email.includes("@")) e.email = "Valid email is required.";
    if (!d.birthdate) e.birthdate = "Birthdate is required.";
    if (!d.contact.trim()) e.contact = "Contact number is required.";
    if (!d.address.trim()) e.address = "Home address is required.";
    if (!d.password || d.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (d.password !== d.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrs(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: d.email.toLowerCase(),
      password: d.password,
    });
    if (authError) {
      setErrs({ email: authError.message });
      setLoading(false);
      return;
    }

    // 2. Insert profile row
    const profile = {
      id: authData.user.id,
      first_name: d.firstName,
      last_name: d.lastName,
      email: d.email.toLowerCase(),
      birthdate: d.birthdate,
      contact: d.contact,
      address: d.address,
      id_number: null,
      id_type: null,
      id_status: null,
      registered_at: null,
    };
    const { error: profileError } = await supabase.from("user_profiles").insert(profile);
    if (profileError) {
      showToast("Profile save error: " + profileError.message, "error");
      setLoading(false);
      return;
    }
    setLoading(false);
    onRegister(authData.user, profile);
  };

  return (
    <div className="auth-bg fd">
      <div className="auth-left">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 50, height: 50, background: "rgba(255,255,255,.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 24, color: "#fff" }}>KalingaNet</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.6)" }}>Cabanatuan City</div>
          </div>
        </div>
        <h1 style={{ fontSize: "clamp(26px,3vw,42px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
          Create your<br />free account.
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.85, maxWidth: 380, marginBottom: 36 }}>
          Register to apply for your OSCA or PWD ID online and receive a reference number for your office visit.
        </p>
        <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 14, padding: "22px 24px" }}>
          {["Apply for your ID online", "Get a reference number instantly", "Access all 14+ city services", "Secure & completely free"].map((t, i) => (
            <div key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,.88)", marginBottom: i < 3 ? 12 : 0, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 20, background: "rgba(255,255,255,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Create Account</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted }}>Fill in your details below. It only takes a minute.</p>
        </div>
        <div className="reg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <RegisterField label="First Name" k="firstName" placeholder="Juan" d={d} errs={errs} set={set} />
          <RegisterField label="Last Name" k="lastName" placeholder="Dela Cruz" d={d} errs={errs} set={set} />
          <RegisterField label="Email Address" k="email" type="email" placeholder="you@email.com" span={2} d={d} errs={errs} set={set} />
          <RegisterField label="Birthdate" k="birthdate" type="date" placeholder="" span={2} d={d} errs={errs} set={set} />
          <RegisterField label="Contact Number" k="contact" placeholder="09XX-XXX-XXXX" span={2} d={d} errs={errs} set={set} />
          <RegisterField label="Home Address" k="address" placeholder="Brgy., Cabanatuan City" span={2} d={d} errs={errs} set={set} />
          <RegisterField label="Password" k="password" type="password" placeholder="Min. 6 characters" d={d} errs={errs} set={set} />
          <RegisterField label="Confirm Password" k="confirmPassword" type="password" placeholder="Repeat password" d={d} errs={errs} set={set} />
        </div>
        <button className="btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 15, marginTop: 10, marginBottom: 20 }} onClick={submit} disabled={loading}>
          {loading ? "Creating account…" : "Create Account →"}
        </button>
        <div style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted }}>
          Already have an account?{" "}
          <button onClick={goLogin} style={{ background: "none", border: "none", color: T.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, textDecoration: "underline" }}>
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
function MainApp({ currentUser, userProfile, onUpdateProfile, onLogout, showToast }) {
  const [page, setPage] = useState("Home");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [svc, setSvc] = useState(null);
  const [faq, setFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [services, setServices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    supabase.from("services").select("*").eq("status", "Active").order("id").then(({ data }) => { if (data) setServices(data); });
    supabase.from("announcements").select("*").eq("status", "Published").order("date", { ascending: false }).then(({ data }) => { if (data) setAnnouncements(data); });
  }, []);

  const go = (p) => { setPage(p); setSvc(null); setFaq(null); window.scrollTo(0, 0); };

  const filtered = services.filter(s =>
    (cat === "All" || s.category === cat) &&
    (!q || s.title.toLowerCase().includes(q.toLowerCase()) || (s.office || "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <nav style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 10px rgba(0,0,0,.07)", width: "100%" }}>
        <div className="w" style={{ height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("Home")}>
            <div style={{ width: 36, height: 36, background: T.teal, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: T.teal, lineHeight: 1.1 }}>KalingaNet</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: T.light }}>Cabanatuan City</div>
            </div>
          </div>
          <div className="nav-links" style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {["Home", "Services", "Announcements", "Register", "Offices", "FAQ", "My ID"].map(n => (
              <button key={n} className={`nb ${page === n ? "on" : ""}`} onClick={() => go(n)}>
                {n === "My ID" ? `👤 ${userProfile.first_name}` : n}
              </button>
            ))}
          </div>
          <button className="btn-red" onClick={onLogout}>Logout</button>
          <button className="nav-mobile-menu" onClick={() => setMobileMenu(m => !m)} style={{ display: "none", background: "none", border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18 }}>☰</button>
        </div>
      </nav>

      {mobileMenu && (
        <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "8px 16px 16px", gap: 4, position: "sticky", top: 62, zIndex: 199, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
          {["Home", "Services", "Announcements", "Register", "Offices", "FAQ", "My ID"].map(n => (
            <button key={n} className={`nb ${page === n ? "on" : ""}`} style={{ textAlign: "left" }} onClick={() => { go(n); setMobileMenu(false); }}>
              {n === "My ID" ? `👤 ${userProfile.first_name}` : n}
            </button>
          ))}
          <button className="btn-red" style={{ marginTop: 4, alignSelf: "flex-start" }} onClick={onLogout}>Logout</button>
        </div>
      )}
      <div style={{ width: "100%", minHeight: "calc(100vh - 62px)" }} className="fd">

        {/* HOME */}
        {page === "Home" && (
          <div>
            <div className="w">
              <div className="hero">
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
                    <span style={{ fontSize: 12 }}>🌿</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.teal, fontWeight: 600 }}>Cabanatuan City Official Portal</span>
                  </div>
                  <h1 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, lineHeight: 1.15, color: T.navy, marginBottom: 18 }}>
                    Services for<br /><span style={{ color: T.teal }}>Senior Citizens</span><br /><span style={{ color: T.amber }}>& PWDs</span>
                  </h1>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.75, marginBottom: 30, maxWidth: 460 }}>
                    Find government benefits, health programs, financial assistance, and more — all in one place.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button className="btn-p" style={{ fontSize: 15, padding: "12px 26px" }} onClick={() => go("Services")}>Browse All Services →</button>
                    <button className="btn-o" style={{ fontSize: 15, padding: "12px 26px" }} onClick={() => go("My ID")}>My ID & Profile</button>
                  </div>
                </div>
                <div className="st">
                  {[{ num: "14+", lbl: "Services Listed", icon: "📋", c: T.teal }, { num: "Free", lbl: "To Use", icon: "✅", c: T.amber }, { num: "4", lbl: "Categories", icon: "🗂️", c: "#3D4FBF" }, { num: "24/7", lbl: "Available", icon: "🕐", c: "#A03070" }].map((s, i) => (
                    <div key={i} className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.c, fontFamily: "'DM Sans',sans-serif" }}>{s.num}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.muted, marginTop: 3 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w" style={{ marginBottom: 48 }}>
              <div className="g4">
                {Object.entries(catCol).map(([c, col]) => (
                  <div key={c} className="card" style={{ padding: "22px 20px", cursor: "pointer", background: col.bg, border: `1px solid ${col.bdr}` }} onClick={() => { setCat(c); go("Services"); }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{catIcon[c]}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: col.text, marginBottom: 4 }}>{c}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted }}>{services.filter(s => s.category === c).length} services available</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w" style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Most Important Benefits</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, marginBottom: 20 }}>Essential services every senior citizen and PWD should know about.</p>
              <div className="g2">{services.slice(0, 4).map(s => <SCard key={s.id} s={s} onClick={() => setSvc(s)} />)}</div>
            </div>
            {announcements.length > 0 && (
              <div className="w" style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: T.navy }}>📢 Latest Announcements</h2>
                  <button className="btn-o" style={{ fontSize: 13, padding: "8px 18px" }} onClick={() => go("Announcements")}>View All →</button>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, marginBottom: 20 }}>Latest news and programs from the city.</p>
                <div style={{ display: "grid", gap: 14 }}>
                  {announcements.slice(0, 3).map((a, i) => {
                    const typeStyle = {
                      Event: { bg: "#EEF0FB", text: "#3D4FBF" },
                      Program: { bg: "#FBF0F5", text: "#A03070" },
                      Notice: { bg: T.tealF, text: T.teal },
                    }[a.type] || { bg: T.tealF, text: T.teal };
                    return (
                      <div key={i} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: typeStyle.bg, color: typeStyle.text }}>{a.type}</span>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "2px 9px", borderRadius: 20, background: "#F0F4F3", color: T.muted, fontWeight: 500 }}>{a.audience}</span>
                          {a.date && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.light }}>📅 {a.date}</span>}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 5 }}>{a.title}</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{a.body}</div>
                      </div>
                    );
                  })}
                </div>
                {announcements.length > 3 && (
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button className="btn-o" onClick={() => go("Announcements")}>See {announcements.length - 3} more announcement{announcements.length - 3 !== 1 ? "s" : ""} →</button>
                  </div>
                )}
              </div>
            )}
            <div className="w" style={{ paddingBottom: 64 }}>
              <div className="cta-box" style={{ background: T.teal, borderRadius: 18, padding: "36px 40px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Don't have your ID yet?</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.85)" }}>Apply online through your profile. It's free.</div>
                </div>
                <button className="btn-p" style={{ background: "#fff", color: T.teal, padding: "12px 28px", fontSize: 15 }} onClick={() => go("My ID")}>Apply for ID →</button>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {page === "Services" && (
          <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 6 }}>All Services & Benefits</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 28 }}>Browse all programs for senior citizens and PWDs in Cabanatuan City.</p>
            <div style={{ position: "relative", marginBottom: 18 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: .45 }}>🔍</span>
              <input className="si" placeholder="Search services, benefits, programs…" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {["All", "Health", "Financial", "Legal", "Social"].map(c => {
                const on = cat === c, col = catCol[c];
                return <button key={c} className="cp" style={{ background: on ? (col ? col.bg : T.tealF) : "#fff", color: on ? (col ? col.text : T.teal) : T.muted, border: `1.5px solid ${on ? (col ? col.bdr : T.teal) : T.border}` }} onClick={() => setCat(c)}>{c}</button>;
              })}
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, marginBottom: 16 }}>Showing {filtered.length} of {services.length} services</div>
            <div className="g2">{filtered.map(s => <SCard key={s.id} s={s} onClick={() => setSvc(s)} />)}</div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'DM Sans',sans-serif", color: T.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div>No results for "{q}"</div>
                <button style={{ marginTop: 14, color: T.teal, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} onClick={() => { setQ(""); setCat("All"); }}>Clear search</button>
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {page === "Announcements" && (
          <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 6 }}>📢 Announcements</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 32 }}>Latest news, events, and programs from Cabanatuan City OSCA & CSWDO.</p>
            {announcements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "'DM Sans',sans-serif", color: T.muted }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No announcements yet</div>
                <div style={{ fontSize: 14 }}>Check back later for updates from the city.</div>
              </div>
            ) : (
              <>
                {/* Group by type */}
                {["Event", "Program", "Notice"].map(type => {
                  const group = announcements.filter(a => a.type === type);
                  if (!group.length) return null;
                  const typeStyle = {
                    Event: { bg: "#EEF0FB", text: "#3D4FBF", icon: "🗓️" },
                    Program: { bg: "#FBF0F5", text: "#A03070", icon: "📋" },
                    Notice: { bg: T.tealF, text: T.teal, icon: "📌" },
                  }[type];
                  return (
                    <div key={type} style={{ marginBottom: 36 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span style={{ fontSize: 20 }}>{typeStyle.icon}</span>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: T.navy }}>{type}s</h2>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: typeStyle.bg, color: typeStyle.text }}>{group.length}</span>
                      </div>
                      <div style={{ display: "grid", gap: 14 }}>
                        {group.map((a, i) => (
                          <div key={i} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: typeStyle.bg, color: typeStyle.text }}>{a.type}</span>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "2px 9px", borderRadius: 20, background: "#F0F4F3", color: T.muted, fontWeight: 500 }}>{a.audience}</span>
                              {a.date && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.light }}>📅 {a.date}</span>}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 17, color: T.navy, marginBottom: 8, lineHeight: 1.35 }}>{a.title}</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, lineHeight: 1.7 }}>{a.body}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* REGISTER (ID guide) */}
        {page === "Register" && (
          <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 8 }}>How to Get Your ID</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 32 }}>Getting your OSCA or PWD ID is free and opens access to discounts, benefits, and programs.</p>
            {userProfile.id_number ? (
              <div style={{ background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 32, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: T.teal }}>Your ID is already registered!</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted }}>ID No: <strong>{userProfile.id_number}</strong></div>
                </div>
                <button className="btn-p" onClick={() => go("My ID")}>View My ID →</button>
              </div>
            ) : (
              <div style={{ background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 32, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 22 }}>💡</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: T.navy }}>Apply for your ID through My ID — get a reference number instantly.</div>
                </div>
                <button className="btn-p" onClick={() => go("My ID")}>Apply Now →</button>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, marginBottom: 40 }}>
              {REQS.map((r, i) => (
                <div key={i} style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <span style={{ fontSize: 32 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17, color: T.navy }}>{r.title}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.teal, fontWeight: 600 }}>✅ Registration is FREE</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: T.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Requirements</div>
                  {r.reqs.map((req, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 9 }}>
                      <span style={{ color: T.teal, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text, lineHeight: 1.5 }}>{req}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.tealF, borderRadius: 10 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: T.tealD, marginBottom: 4 }}>📍 Where to go</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.text, lineHeight: 1.5 }}>{r.where}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.teal, marginTop: 4 }}>📞 {r.contact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFICES */}
        {page === "Offices" && (
          <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Government Offices & Contacts</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 32 }}>Visit or call these offices for senior citizen or PWD concerns.</p>
            <div className="g2" style={{ marginBottom: 40 }}>
              {OFFICES.map((o, i) => (
                <div key={i} className="oc">
                  <div style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{o.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 12, lineHeight: 1.4 }}>{o.name}</div>
                    <div className="ir"><span style={{ color: T.teal }}>📍</span><span style={{ color: T.muted }}>{o.addr}</span></div>
                    <div className="ir"><span style={{ color: T.teal }}>📞</span><span style={{ fontWeight: 600 }}>{o.contact}</span></div>
                    <div className="ir"><span style={{ color: T.teal }}>🕐</span><span style={{ color: T.muted }}>{o.hours}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {page === "FAQ" && (
          <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Frequently Asked Questions</h1>
            <div style={{ marginBottom: 48 }}>
              {announcements.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 0", fontFamily: "'DM Sans',sans-serif", color: T.muted }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                  <div>No FAQs available yet.</div>
                </div>
              )}
              {announcements.filter(a => a.type === "Notice").map((f, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <button className="fqb" onClick={() => setFaq(faq === i ? null : i)}>
                    <span>{f.title}</span>
                    <span style={{ fontSize: 22, color: T.teal, flexShrink: 0, transition: "transform .2s", transform: faq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {faq === i && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.75, paddingBottom: 20, paddingRight: 32 }}>{f.body}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY ID */}
        {page === "My ID" && (
          <MyIDPage
            userProfile={userProfile}
            onUpdateProfile={onUpdateProfile}
            showToast={showToast}
          />
        )}
      </div>

      <footer style={{ background: T.navy, color: "rgba(255,255,255,.72)", width: "100%" }}>
        <div className="w" style={{ paddingTop: 40, paddingBottom: 24 }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 12, textAlign: "center" }}>
            KalingaNet © 2025 · Cabanatuan City Government · A BPA Capstone Project · NEUST
          </div>
        </div>
      </footer>

      {/* SERVICE MODAL */}
      {svc && (() => {
        const cat = svc.category || svc.cat;
        const col = catCol[cat] || { bg: T.tealF, text: T.teal, bdr: T.border };
        const details = [
          { icon: "🏛️", lbl: "Office", val: svc.office },
          { icon: "📍", lbl: "Address", val: svc.addr || svc.address || svc.office },
          { icon: "📞", lbl: "Contact", val: svc.contact || "—" },
          { icon: "🕐", lbl: "Schedule", val: svc.sched || svc.schedule || "—" },
          { icon: "✅", lbl: "Eligibility", val: svc.elig || svc.eligibility || "Senior Citizens and PWDs" },
        ];
        return (
          <div className="ov" onClick={() => setSvc(null)}>
            <div className="mo" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSvc(null)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.muted }}>✕</button>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{catIcon[cat] || "📋"}</div>
              <span className="pill" style={{ background: col.bg, color: col.text, border: `1px solid ${col.bdr}`, marginBottom: 14, display: "inline-block" }}>{cat}</span>
              <h2 style={{ fontSize: 21, fontWeight: 700, color: T.navy, lineHeight: 1.3, marginBottom: 10 }}>{svc.title}</h2>
              {svc.desc && (
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 20 }}>{svc.desc}</p>
              )}
              <div style={{ background: T.bg, borderRadius: 12, padding: 16 }}>
                {details.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < details.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: T.light, textTransform: "uppercase", letterSpacing: ".05em" }}>{r.lbl}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text, marginTop: 2, lineHeight: 1.5 }}>{r.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 20, padding: "12px 0" }} onClick={() => setSvc(null)}>Close</button>
            </div>
          </div>
        );
      })()}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY ID PAGE — saves ID application to Supabase
// ══════════════════════════════════════════════════════════════════════════════
function MyIDPage({ userProfile, onUpdateProfile, showToast }) {
  const [idType, setIdType] = useState(userProfile.id_type || "");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({ photo: null, birthCert: null, validId: null, medCert: null, barangayCert: null });
  const [uploadProgress, setUploadProgress] = useState("");

  const handleFile = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) { showToast("Only JPG, PNG, or PDF files allowed.", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File must be under 5MB.", "error"); return; }
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const uploadFile = async (file, path) => {
    const { error } = await supabase.storage.from("id-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("id-documents").getPublicUrl(path);
    return data.publicUrl;
  };

  const confirmApply = async () => {
    setLoading(true);
    const idNumber = generateIDNumber(idType);
    const registeredAt = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
    const userId = userProfile.id;
    const docUrls = {};

    // Upload files to Supabase Storage
    const fileKeys = idType === "senior"
      ? [["photo", "1x1 Photo"], ["birthCert", "Birth Certificate"], ["validId", "Valid ID"], ["barangayCert", "Barangay Certificate"]]
      : [["photo", "1x1 Photo"], ["birthCert", "Birth Certificate"], ["medCert", "Medical Certificate"], ["barangayCert", "Barangay Certificate"]];

    try {
      for (const [key, label] of fileKeys) {
        if (files[key]) {
          setUploadProgress(`Uploading ${label}…`);
          const ext = files[key].name.split(".").pop();
          const url = await uploadFile(files[key], `${userId}/${idNumber}/${key}.${ext}`);
          docUrls[key] = url;
        }
      }
    } catch (err) {
      showToast("File upload failed. Please try again.", "error");
      setLoading(false);
      setUploadProgress("");
      return;
    }
    setUploadProgress("");

    // Save to user_profiles
    const updates = { id_type: idType, id_number: idNumber, id_status: "Pending Verification", registered_at: registeredAt };
    const { error: profileErr } = await supabase.from("user_profiles").update(updates).eq("id", userId);

    // Also save to id_applications table for admin view
    const { error: appErr } = await supabase.from("id_applications").insert({
      user_id: userId,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email: userProfile.email,
      contact: userProfile.contact,
      address: userProfile.address,
      birthdate: userProfile.birthdate,
      id_type: idType,
      id_number: idNumber,
      status: "Pending Verification",
      applied_at: new Date().toISOString(),
      doc_photo: docUrls.photo || null,
      doc_birth_cert: docUrls.birthCert || null,
      doc_valid_id: docUrls.validId || null,
      doc_med_cert: docUrls.medCert || null,
      doc_barangay_cert: docUrls.barangayCert || null,
    });

    setLoading(false);
    if (profileErr || appErr) {
      showToast("Error saving application. Please try again.", "error");
      return;
    }
    onUpdateProfile({ ...userProfile, ...updates });
    setConfirm(false);
    showToast("ID application submitted! Documents uploaded successfully.");
  };

  const profile = userProfile;

  return (
    <div className="w" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 4 }}>My Profile & ID</h1>
      <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 36 }}>
        Logged in as <strong>{profile.first_name} {profile.last_name}</strong> · {profile.email}
      </p>
      <div className="id-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
        {/* Profile card */}
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 18, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, background: T.tealF, border: `2px solid ${T.teal}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 19, color: T.navy }}>{profile.first_name} {profile.last_name}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted }}>{profile.email}</div>
            </div>
          </div>
          {[{ icon: "📅", label: "Birthdate", val: profile.birthdate || "—" }, { icon: "📞", label: "Contact", val: profile.contact || "—" }, { icon: "📍", label: "Home Address", val: profile.address || "—" }].map((f, i) => (
            <div key={i} className="ir">
              <span style={{ color: T.teal, fontSize: 16 }}>{f.icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: T.light, textTransform: "uppercase", letterSpacing: ".05em" }}>{f.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text, marginTop: 2 }}>{f.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ID card / Application */}
        <div>
          {profile.id_number ? (
            <>
              <div className="id-card" style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.7)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>🌿 KalingaNet · Cabanatuan City</div>
                <div style={{ fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,.8)", marginBottom: 18 }}>{profile.id_type === "senior" ? "Office for Senior Citizens Affairs" : "City PWD Affairs Office"}</div>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{profile.id_type === "senior" ? "👴" : "♿"}</div>
                <div style={{ fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 4, position: "relative", zIndex: 1 }}>{profile.first_name} {profile.last_name}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 18 }}>{profile.id_type === "senior" ? "Senior Citizen" : "Person with Disability"}</div>
                <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "12px 16px", backdropFilter: "blur(4px)", position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.7)", marginBottom: 3 }}>ID NUMBER</div>
                  <div style={{ fontFamily: "monospace", fontSize: 18, color: "#fff", fontWeight: 700, letterSpacing: ".05em" }}>{profile.id_number}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.6)", position: "relative", zIndex: 1 }}>
                  <span>Applied: {profile.registered_at}</span>
                  <span style={{ background: "rgba(255,255,255,.2)", padding: "2px 8px", borderRadius: 20 }}>{profile.id_status}</span>
                </div>
              </div>
              <div style={{ background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.tealD, lineHeight: 1.7 }}>
                <strong>📋 Next step:</strong> Bring your original documents to the {profile.id_type === "senior" ? "OSCA Office, City Hall" : "CPDAO Office, City Hall Annex"} to complete verification and receive your physical ID.
              </div>
            </>
          ) : (
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 18, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Apply for Your ID</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, lineHeight: 1.65, marginBottom: 22 }}>
                Select your ID type below and submit your application. A reference number will be generated — bring your documents to the office to finalize.
              </p>
              <div className="form-group">
                <label className="form-label">ID Type</label>
                <select className="sel" value={idType} onChange={e => setIdType(e.target.value)}>
                  <option value="">— Select ID Type —</option>
                  <option value="senior">Senior Citizen (OSCA ID) — 60 years old and above</option>
                  <option value="pwd">Person with Disability (PWD ID)</option>
                </select>
              </div>
              {idType === "senior" && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ background: "#E6F5F2", border: "1px solid #A8D8D0", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.tealD }}><strong>Required docs:</strong> PSA Birth Certificate · Valid Gov't ID · 1×1 photo · Barangay Certificate</div>
                  {[["photo", "1×1 ID Photo", "image"], ["birthCert", "PSA Birth Certificate", "both"], ["validId", "Valid Government ID", "both"], ["barangayCert", "Barangay Certificate", "both"]].map(([key, label, type]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label} <span style={{ color: T.muted, fontWeight: 400 }}>(JPG, PNG or PDF · max 5MB)</span></label>
                      <input type="file" accept={type === "image" ? "image/*" : "image/*,application/pdf"} onChange={e => handleFile(key, e)}
                        style={{ width: "100%", padding: "8px 12px", border: `1.5px solid ${files[key] ? T.teal : T.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", background: files[key] ? T.tealF : "#fff" }} />
                      {files[key] && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.teal, marginTop: 4 }}>✓ {files[key].name}</div>}
                    </div>
                  ))}
                </div>
              )}
              {idType === "pwd" && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ background: "#EEF0FB", border: "1px solid #B0B8F0", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#3D4FBF" }}><strong>Required docs:</strong> Medical Certificate · PSA Birth Certificate or valid ID · 1×1 photo · Barangay Certificate</div>
                  {[["photo", "1×1 ID Photo", "image"], ["birthCert", "PSA Birth Certificate / Valid ID", "both"], ["medCert", "Medical Certificate", "both"], ["barangayCert", "Barangay Certificate", "both"]].map(([key, label, type]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label} <span style={{ color: T.muted, fontWeight: 400 }}>(JPG, PNG or PDF · max 5MB)</span></label>
                      <input type="file" accept={type === "image" ? "image/*" : "image/*,application/pdf"} onChange={e => handleFile(key, e)}
                        style={{ width: "100%", padding: "8px 12px", border: `1.5px solid ${files[key] ? T.teal : T.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", background: files[key] ? T.tealF : "#fff" }} />
                      {files[key] && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.teal, marginTop: 4 }}>✓ {files[key].name}</div>}
                    </div>
                  ))}
                </div>
              )}
              {uploadProgress && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.teal, marginBottom: 12, textAlign: "center" }}>⏳ {uploadProgress}</div>}
              {!confirm ? (
                <button className="btn-p" style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 15 }} onClick={() => { if (!idType) { showToast("Please select an ID type.", "error"); return; } setConfirm(true); }}>Submit Application →</button>
              ) : (
                <div style={{ background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.navy, marginBottom: 14, lineHeight: 1.6 }}>
                    Confirm your application for a <strong>{idType === "senior" ? "Senior Citizen (OSCA)" : "PWD"} ID</strong>?
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-p" style={{ flex: 1, justifyContent: "center" }} onClick={confirmApply} disabled={loading}>
                      {loading ? "Submitting…" : "Yes, Submit"}
                    </button>
                    <button className="btn-o" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SERVICE CARD ──────────────────────────────────────────────────────────────
function SCard({ s, onClick }) {
  const cat = s.category || s.cat;
  const col = catCol[cat] || { bg: T.tealF, text: T.teal, bdr: T.border };
  return (
    <div className="card" style={{ padding: 20, cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{catIcon[cat] || "📋"}</span>
        <span className="pill" style={{ background: col.bg, color: col.text, border: `1px solid ${col.bdr}` }}>{cat}</span>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.navy, lineHeight: 1.4, marginBottom: 7 }}>{s.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.desc || s.office}</p>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.light }}>🏛️ {s.office}</div>
      {s.contact && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.light, marginTop: 2 }}>📞 {s.contact}</div>}
      <div style={{ marginTop: 10, color: T.teal, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>View details →</div>
    </div>
  );
}