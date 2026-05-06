import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Supabase ──────────────────────────────────────────────────────────────────
// 🔧 Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://qenorezexgpzvxsogpzi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_u3uDFKChn86Mv-WLVopRuw_nQfgaQOe";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BARANGAYS = ["Aduas Norte", "Aduas Sur", "Caalibangbangan", "Paco", "Sangitan", "Zulueta", "Bonifacio", "Maharlika", "Sta. Arcadia", "Gen. Tinio"];

// ── Theme ─────────────────────────────────────────────────────────────────────
const C = {
    teal: "#0D7A6B", tealL: "#12A08C", tealD: "#085C50", tealF: "#E8F5F2",
    navy: "#1A2E44", navyL: "#243B55",
    amber: "#E8912A", amberF: "#FDF3E7",
    text: "#1C2B3A", muted: "#5A7080", light: "#8FA8B8",
    bg: "#F4F7F6", card: "#FFFFFF", border: "#DDE8E4",
    green: "#1A7F4B", greenF: "#E6F5ED",
    red: "#C0392B", redF: "#FEF0EE",
    blue: "#2563EB", blueF: "#EEF3FF",
    purple: "#6D3DBF", purpleF: "#F2EEFF",
};

const catColor = {
    Health: { bg: "#E8F5F2", text: "#0D7A6B", dot: "#0D7A6B" },
    Financial: { bg: "#FDF3E7", text: "#B86B10", dot: "#E8912A" },
    Legal: { bg: "#EEF0FB", text: "#3D4FBF", dot: "#3D4FBF" },
    Social: { bg: "#FBF0F5", text: "#A03070", dot: "#A03070" },
};

const badge = (label, bg, text) => (
    <span style={{ display: "inline-block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: bg, color: text }}>{label}</span>
);

const statusBadge = (s) => {
    const m = { Active: { bg: C.greenF, t: C.green }, Inactive: { bg: "#F0F0F0", t: "#666" }, Pending: { bg: C.amberF, t: C.amber }, "Pending Verification": { bg: C.amberF, t: C.amber }, Published: { bg: C.greenF, t: C.green }, Draft: { bg: "#F0F0F0", t: "#777" }, Approved: { bg: C.greenF, t: C.green }, Rejected: { bg: C.redF, t: C.red } };
    const d = m[s] || { bg: "#eee", t: "#555" };
    return badge(s, d.bg, d.t);
};

const typeBadge = (t) => t === "Senior Citizen" || t === "senior"
    ? badge(t === "senior" ? "Senior Citizen" : t, C.tealF, C.teal)
    : badge(t === "pwd" ? "PWD" : t, C.purpleF, C.purple);

function Stat({ icon, label, value, sub, color }) {
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
            <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 26, fontWeight: 700, color: color, lineHeight: 1 }}>{value}</div>
                {sub && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>{sub}</div>}
            </div>
        </div>
    );
}

function Modal({ title, onClose, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: C.card, borderRadius: 16, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: 32, position: "relative", animation: "mUp .2s ease" }}>
                <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}>✕</button>
                <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 24 }}>{title}</h2>
                {children}
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</label>
            {children}
        </div>
    );
}

const inp = { width: "100%", padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.text, background: "#fff", outline: "none" };
const sel = { ...inp };

// ══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminPanel() {
    const [page, setPage] = useState("Dashboard");
    const [bens, setBens] = useState([]);
    const [svcs, setSvcs] = useState([]);
    const [anns, setAnns] = useState([]);
    const [search, setSearch] = useState("");
    const [typeF, setTypeF] = useState("All");
    const [statusF, setStatusF] = useState("All");
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [confirm, setConfirm] = useState(null);

    // Supabase live data
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [idApplications, setIdApplications] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingApps, setLoadingApps] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [appSearch, setAppSearch] = useState("");
    const [appFilter, setAppFilter] = useState("All");
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
    const [userForm, setUserForm] = useState({});

    // ── Fetch from Supabase ────────────────────────────────────────────────────
    useEffect(() => {
        fetchBeneficiaries();
        fetchServices();
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (page === "Registered Users") fetchUsers();
        if (page === "ID Applications") fetchApplications();
    }, [page]);

    const fetchBeneficiaries = async () => {
        const { data, error } = await supabase.from("beneficiaries").select("*").order("registered", { ascending: false });
        if (!error && data) setBens(data);
    };

    const fetchServices = async () => {
        const { data, error } = await supabase.from("services").select("*").order("id", { ascending: true });
        if (!error && data) setSvcs(data);
    };

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase.from("announcements").select("*").order("date", { ascending: false });
        if (!error && data) setAnns(data);
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .order("created_at", { ascending: false });
        setLoadingUsers(false);
        if (!error) setRegisteredUsers(data || []);
    };

    const fetchApplications = async () => {
        setLoadingApps(true);
        const { data, error } = await supabase
            .from("id_applications")
            .select("*")
            .order("applied_at", { ascending: false });
        setLoadingApps(false);
        if (!error) setIdApplications(data || []);
    };

    const deleteUser = async (userId) => {
        await supabase.from("user_profiles").delete().eq("id", userId);
        setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
        setConfirmDeleteUser(null);
    };

    const saveUserEdit = async () => {
        const { id, ...updates } = userForm;
        const { error } = await supabase.from("user_profiles").update(updates).eq("id", id);
        if (!error) {
            setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
            setSelectedUser(null);
        }
    };

    const updateAppStatus = async (appId, newStatus) => {
        const { error } = await supabase
            .from("id_applications")
            .update({ status: newStatus })
            .eq("id", appId);
        if (!error) {
            setIdApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
            const app = idApplications.find(a => a.id === appId);
            if (app) {
                // Update status on user profile
                await supabase.from("user_profiles").update({ id_status: newStatus }).eq("id", app.user_id);

                // Auto-add to beneficiaries when approved
                if (newStatus === "Approved") {
                    const age = app.birthdate
                        ? Math.floor((new Date() - new Date(app.birthdate)) / (365.25 * 24 * 60 * 60 * 1000))
                        : null;
                    await supabase.from("beneficiaries").insert({
                        name: `${app.first_name} ${app.last_name}`,
                        type: app.id_type === "senior" ? "Senior Citizen" : "PWD",
                        age,
                        barangay: app.address || "—",
                        contact: app.contact || "—",
                        status: "Active",
                        registered: new Date().toISOString().slice(0, 10),
                        lastVisit: new Date().toISOString().slice(0, 10),
                        stipend: false,
                        conditions: "—",
                        gender: "—",
                        id_number: app.id_number,
                        email: app.email,
                    });
                    await fetchBeneficiaries();
                }
            }
            setSelectedApp(null);
        }
    };

    // ── Beneficiary CRUD ──────────────────────────────────────────────────────
    const openAdd = (kind, defaults = {}) => { setForm(defaults); setModal({ kind, data: null }); };
    const openEdit = (kind, data) => { setForm({ ...data }); setModal({ kind, data }); };
    const closeModal = () => setModal(null);

    const filteredBens = bens.filter(b => {
        const q = search.toLowerCase();
        const matchQ = !q || (b.name || "").toLowerCase().includes(q) || (b.id || "").toString().includes(q) || (b.barangay || "").toLowerCase().includes(q);
        const matchT = typeF === "All" || b.type === typeF;
        const matchS = statusF === "All" || b.status === statusF;
        return matchQ && matchT && matchS;
    });

    const saveBen = async () => {
        if (!form.name || !form.type || !form.barangay) return;
        if (modal.data) {
            const { id, ...updates } = form;
            await supabase.from("beneficiaries").update(updates).eq("id", id);
        } else {
            await supabase.from("beneficiaries").insert({
                ...form,
                registered: new Date().toISOString().slice(0, 10),
                lastVisit: new Date().toISOString().slice(0, 10),
            });
        }
        await fetchBeneficiaries();
        closeModal();
    };

    const deleteBen = async (id) => {
        await supabase.from("beneficiaries").delete().eq("id", id);
        await fetchBeneficiaries();
        setConfirm(null);
    };

    const saveSvc = async () => {
        if (!form.title) return;
        if (modal.data) {
            const { id, ...updates } = form;
            await supabase.from("services").update({ ...updates, lastUpdated: new Date().toISOString().slice(0, 10) }).eq("id", id);
        } else {
            await supabase.from("services").insert({ ...form, beneficiaries: 0, lastUpdated: new Date().toISOString().slice(0, 10) });
        }
        await fetchServices();
        closeModal();
    };

    const saveAnn = async () => {
        if (!form.title) return;
        if (modal.data) {
            const { id, ...updates } = form;
            await supabase.from("announcements").update(updates).eq("id", id);
        } else {
            await supabase.from("announcements").insert({ ...form });
        }
        await fetchAnnouncements();
        closeModal();
    };

    const deleteSvc = async (id) => {
        await supabase.from("services").delete().eq("id", id);
        await fetchServices();
    };

    const deleteAnn = async (id) => {
        await supabase.from("announcements").delete().eq("id", id);
        await fetchAnnouncements();
    };

    const toggleAnnStatus = async (id) => {
        const ann = anns.find(a => a.id === id);
        if (!ann) return;
        const newStatus = ann.status === "Published" ? "Draft" : "Published";
        await supabase.from("announcements").update({ status: newStatus }).eq("id", id);
        await fetchAnnouncements();
    };

    const totalSenior = bens.filter(b => b.type === "Senior Citizen").length;
    const totalPWD = bens.filter(b => b.type === "PWD").length;
    const active = bens.filter(b => b.status === "Active").length;
    const stipend = bens.filter(b => b.stipend).length;

    const PAGES = ["Dashboard", "Beneficiaries", "Services", "Announcements", "Registered Users", "ID Applications", "Reports"];
    const PAGE_ICONS = { Dashboard: "📊", Beneficiaries: "👥", Services: "📋", Announcements: "📢", "Registered Users": "🧑‍💻", "ID Applications": "🪪", Reports: "📈" };

    // ── Filtered live data ────────────────────────────────────────────────────
    const filteredUsers = registeredUsers.filter(u => {
        const q = userSearch.toLowerCase();
        return !q || (u.first_name + " " + u.last_name).toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });

    const filteredApps = idApplications.filter(a => {
        const q = appSearch.toLowerCase();
        const matchQ = !q || (a.first_name + " " + a.last_name).toLowerCase().includes(q) || (a.id_number || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q);
        const matchF = appFilter === "All" || a.id_type === appFilter || a.status === appFilter;
        return matchQ && matchF;
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%!important; max-width:none!important; overflow-x:hidden; background:${C.bg}; font-family:'Plus Jakarta Sans',sans-serif; }
        #root { width:100%!important; max-width:none!important; }
        @keyframes mUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fd { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fd { animation:fd .35s ease both; }
        .row-hover:hover { background:#F7FBF9!important; }
        table { border-collapse:collapse; width:100%; }
        th { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; color:${C.muted}; text-transform:uppercase; letter-spacing:.06em; padding:10px 14px; text-align:left; border-bottom:1px solid ${C.border}; white-space:nowrap; }
        td { font-family:'DM Sans',sans-serif; font-size:13.5px; color:${C.text}; padding:12px 14px; border-bottom:1px solid #F0F4F2; vertical-align:middle; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 14px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:500; color:${C.muted}; transition:all .15s; border:none; background:transparent; width:100%; text-align:left; }
        .nav-item:hover { background:${C.tealF}; color:${C.teal}; }
        .nav-item.on { background:${C.teal}; color:#fff; font-weight:600; }
        .btn { display:inline-flex; align-items:center; gap:6px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; padding:8px 16px; border-radius:8px; cursor:pointer; border:none; transition:all .15s; }
        .btn-p { background:${C.teal}; color:#fff; }
        .btn-p:hover { background:${C.tealD}; }
        .btn-s { background:#fff; color:${C.text}; border:1px solid ${C.border}; }
        .btn-s:hover { background:${C.bg}; }
        .btn-d { background:${C.redF}; color:${C.red}; }
        .btn-d:hover { background:#fde0dd; }
        .btn-y { background:${C.amberF}; color:#A85E0A; }
        .btn-y:hover { background:#fae5c8; }
        .btn-g { background:${C.greenF}; color:${C.green}; }
        .btn-g:hover { background:#c8ecdb; }
        .scard { background:#fff; border:1px solid ${C.border}; border-radius:14px; padding:22px 24px; }
      `}</style>

            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
                {/* ── SIDEBAR ── */}
                <aside style={{ width: 230, background: C.navy, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                    <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, background: C.teal, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>KalingaNet</div>
                                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(255,255,255,.45)" }}>Admin Panel</div>
                            </div>
                        </div>
                    </div>
                    <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
                        {PAGES.map(p => (
                            <button key={p} className={`nav-item ${page === p ? "on" : ""}`} onClick={() => setPage(p)}>
                                <span>{PAGE_ICONS[p]}</span>
                                <span>{p}</span>
                                {p === "ID Applications" && idApplications.filter(a => a.status === "Pending Verification").length > 0 && (
                                    <span style={{ marginLeft: "auto", background: C.amber, color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                                        {idApplications.filter(a => a.status === "Pending Verification").length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                    <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.35)" }}>KalingaNet Admin v2.0</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.25)", marginTop: 2 }}>Cabanatuan City OSCA & CSWDO</div>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <header style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 18, color: C.navy }}>{page}</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>KalingaNet · Cabanatuan City OSCA & CSWDO</div>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
                            {(page === "Registered Users" || page === "ID Applications") && (
                                <button className="btn btn-s" style={{ fontSize: 12 }} onClick={() => page === "Registered Users" ? fetchUsers() : fetchApplications()}>🔄 Refresh</button>
                            )}
                        </div>
                    </header>

                    <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

                        {/* ══ DASHBOARD ══ */}
                        {page === "Dashboard" && (
                            <div className="fd">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                                    <Stat icon="👥" label="Total Beneficiaries" value={bens.length} sub={`${active} active`} color={C.teal} />
                                    <Stat icon="👴" label="Senior Citizens" value={totalSenior} sub="registered" color={C.navy} />
                                    <Stat icon="♿" label="Persons w/ Disability" value={totalPWD} sub="registered" color={C.purple} />
                                    <Stat icon="💰" label="Stipend Recipients" value={stipend} sub="monthly beneficiaries" color={C.amber} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                    <div className="scard">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Recent Registrations</div>
                                            <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setPage("Beneficiaries")}>View all</button>
                                        </div>
                                        {bens.slice(-5).reverse().map(b => (
                                            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid #F0F4F2` }}>
                                                <div>
                                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>{b.name}</div>
                                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{b.barangay} · {b.registered}</div>
                                                </div>
                                                {typeBadge(b.type)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="scard">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>Announcements</div>
                                            <button className="btn btn-s" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setPage("Announcements")}>Manage</button>
                                        </div>
                                        {anns.map(a => (
                                            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid #F0F4F2` }}>
                                                <div style={{ flex: 1, marginRight: 10 }}>
                                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>{a.title}</div>
                                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{a.date} · {a.audience}</div>
                                                </div>
                                                {statusBadge(a.status)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══ BENEFICIARIES ══ */}
                        {page === "Beneficiaries" && (
                            <div className="fd">
                                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: .4 }}>🔍</span>
                                        <input style={{ ...inp, paddingLeft: 32 }} placeholder="Search by name, ID, barangay…" value={search} onChange={e => setSearch(e.target.value)} />
                                    </div>
                                    <select style={{ ...sel, width: 160 }} value={typeF} onChange={e => setTypeF(e.target.value)}>
                                        <option value="All">All Types</option>
                                        <option value="Senior Citizen">Senior Citizen</option>
                                        <option value="PWD">PWD</option>
                                    </select>
                                    <select style={{ ...sel, width: 140 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <button className="btn btn-p" onClick={() => openAdd("beneficiary", { type: "Senior Citizen", status: "Active", stipend: false, gender: "Female" })}>+ Add Beneficiary</button>
                                </div>
                                <div className="scard" style={{ padding: 0, overflow: "auto" }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th><th>Name</th><th>Type</th><th>Age</th><th>Barangay</th><th>Contact</th><th>Status</th><th>Stipend</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBens.map(b => (
                                                <tr key={b.id} className="row-hover">
                                                    <td style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{b.id}</td>
                                                    <td><div style={{ fontWeight: 600 }}>{b.name}</div><div style={{ fontSize: 11, color: C.muted }}>{b.gender} · {b.conditions !== "None" ? b.conditions : "—"}</div></td>
                                                    <td>{typeBadge(b.type)}</td>
                                                    <td>{b.age}</td>
                                                    <td>{b.barangay}</td>
                                                    <td>{b.contact}</td>
                                                    <td>{statusBadge(b.status)}</td>
                                                    <td>{b.stipend ? badge("Yes", C.greenF, C.green) : badge("No", "#F0F0F0", "#777")}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 6 }}>
                                                            <button className="btn btn-s" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit("beneficiary", b)}>Edit</button>
                                                            <button className="btn btn-d" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setConfirm(b.id)}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredBens.length === 0 && (
                                        <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>No beneficiaries found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ SERVICES ══ */}
                        {page === "Services" && (
                            <div className="fd">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{svcs.length} service{svcs.length !== 1 ? "s" : ""} total</div>
                                    <button className="btn btn-p" onClick={() => openAdd("service", { category: "Health", status: "Active" })}>+ Add Service</button>
                                </div>
                                <div className="scard" style={{ padding: 0, overflow: "auto" }}>
                                    <table>
                                        <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Office</th><th>Contact</th><th>Schedule</th><th>Status</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {svcs.map(s => {
                                                const col = catColor[s.category] || {};
                                                return (
                                                    <tr key={s.id} className="row-hover">
                                                        <td style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{s.id}</td>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{s.title}</div>
                                                            {s.desc && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, marginTop: 2, maxWidth: 200 }}>{s.desc.length > 60 ? s.desc.slice(0, 60) + "…" : s.desc}</div>}
                                                        </td>
                                                        <td><span style={{ background: col.bg, color: col.text, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20 }}>{s.category}</span></td>
                                                        <td style={{ fontSize: 12 }}>{s.office}</td>
                                                        <td style={{ fontSize: 12, color: C.muted }}>{s.contact || "—"}</td>
                                                        <td style={{ fontSize: 12, color: C.muted }}>{s.schedule}</td>
                                                        <td>{statusBadge(s.status)}</td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: 6 }}>
                                                                <button className="btn btn-s" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit("service", s)}>Edit</button>
                                                                <button className="btn btn-d" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => { if (window.confirm("Delete this service?")) deleteSvc(s.id); }}>Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {svcs.length === 0 && (
                                        <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>No services yet. Click "+ Add Service" to create one.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ ANNOUNCEMENTS ══ */}
                        {page === "Announcements" && (
                            <div className="fd">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{anns.length} announcement{anns.length !== 1 ? "s" : ""}</div>
                                    <button className="btn btn-p" onClick={() => openAdd("announcement", { type: "Notice", status: "Draft", audience: "All" })}>+ New Announcement</button>
                                </div>
                                {anns.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>
                                        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                                        <div>No announcements yet. Click "+ New Announcement" to create one.</div>
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gap: 14 }}>
                                        {anns.map(a => (
                                            <div key={a.id} className="scard" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                                                        {statusBadge(a.status)}
                                                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{a.type} · {a.audience} · {a.date}</span>
                                                    </div>
                                                    <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 4 }}>{a.title}</div>
                                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{a.body}</div>
                                                </div>
                                                <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                                    <button className="btn btn-y" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => toggleAnnStatus(a.id)}>{a.status === "Published" ? "Unpublish" : "Publish"}</button>
                                                    <button className="btn btn-s" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit("announcement", a)}>Edit</button>
                                                    <button className="btn btn-d" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => { if (window.confirm("Delete this announcement?")) deleteAnn(a.id); }}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ REGISTERED USERS (Supabase) ══ */}
                        {page === "Registered Users" && (
                            <div className="fd">
                                <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
                                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: .4 }}>🔍</span>
                                        <input style={{ ...inp, paddingLeft: 32 }} placeholder="Search by name or email…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                                    </div>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}</div>
                                </div>

                                {loadingUsers ? (
                                    <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>
                                        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                                        Loading registered users from Supabase…
                                    </div>
                                ) : (
                                    <div className="scard" style={{ padding: 0, overflow: "auto" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>#</th><th>Name</th><th>Email</th><th>Contact</th><th>Birthdate</th><th>Address</th><th>ID Type</th><th>ID Number</th><th>ID Status</th><th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map((u, i) => (
                                                    <tr key={u.id} className="row-hover">
                                                        <td style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{i + 1}</td>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</div>
                                                        </td>
                                                        <td style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{u.email}</td>
                                                        <td>{u.contact || "—"}</td>
                                                        <td style={{ fontSize: 12, color: C.muted }}>{u.birthdate || "—"}</td>
                                                        <td style={{ fontSize: 12, color: C.muted, maxWidth: 180 }}>{u.address || "—"}</td>
                                                        <td>{u.id_type ? typeBadge(u.id_type) : <span style={{ color: C.light, fontSize: 12 }}>None yet</span>}</td>
                                                        <td style={{ fontFamily: "monospace", fontSize: 12, color: C.teal, fontWeight: 600 }}>{u.id_number || "—"}</td>
                                                        <td>{u.id_status ? statusBadge(u.id_status) : <span style={{ color: C.light, fontSize: 12 }}>—</span>}</td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: 6 }}>
                                                                <button className="btn btn-s" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => { setUserForm({ ...u }); setSelectedUser(u); }}>Edit</button>
                                                                <button className="btn btn-d" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setConfirmDeleteUser(u)}>Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && !loadingUsers && (
                                            <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>
                                                {userSearch ? `No users matching "${userSearch}"` : "No registered users yet."}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ ID APPLICATIONS (Supabase) ══ */}
                        {page === "ID Applications" && (
                            <div className="fd">
                                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                                    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: .4 }}>🔍</span>
                                        <input style={{ ...inp, paddingLeft: 32 }} placeholder="Search by name, ID number, email…" value={appSearch} onChange={e => setAppSearch(e.target.value)} />
                                    </div>
                                    <select style={{ ...sel, width: 200 }} value={appFilter} onChange={e => setAppFilter(e.target.value)}>
                                        <option value="All">All Applications</option>
                                        <option value="senior">Senior Citizen</option>
                                        <option value="pwd">PWD</option>
                                        <option value="Pending Verification">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>
                                        {filteredApps.filter(a => a.status === "Pending Verification").length} pending · {filteredApps.length} total
                                    </div>
                                </div>

                                {loadingApps ? (
                                    <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>
                                        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                                        Loading ID applications from Supabase…
                                    </div>
                                ) : (
                                    <div className="scard" style={{ padding: 0, overflow: "auto" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th><th>Email</th><th>Contact</th><th>ID Type</th><th>ID Number</th><th>Applied</th><th>Status</th><th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredApps.map(a => (
                                                    <tr key={a.id} className="row-hover">
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{a.first_name} {a.last_name}</div>
                                                            <div style={{ fontSize: 11, color: C.muted }}>{a.address || "—"}</div>
                                                        </td>
                                                        <td style={{ fontSize: 12, color: C.muted }}>{a.email}</td>
                                                        <td style={{ fontSize: 12 }}>{a.contact || "—"}</td>
                                                        <td>{typeBadge(a.id_type)}</td>
                                                        <td style={{ fontFamily: "monospace", fontSize: 12, color: C.teal, fontWeight: 600 }}>{a.id_number}</td>
                                                        <td style={{ fontSize: 12, color: C.muted }}>{a.applied_at ? new Date(a.applied_at).toLocaleDateString("en-PH") : "—"}</td>
                                                        <td>{statusBadge(a.status)}</td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: 6 }}>
                                                                <button className="btn btn-s" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setSelectedApp(a)}>View</button>
                                                                {a.status === "Pending Verification" && (
                                                                    <>
                                                                        <button className="btn btn-g" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => updateAppStatus(a.id, "Approved")}>✓ Approve</button>
                                                                        <button className="btn btn-d" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => updateAppStatus(a.id, "Rejected")}>✕ Reject</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredApps.length === 0 && !loadingApps && (
                                            <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "'DM Sans',sans-serif", color: C.muted }}>
                                                {appSearch ? `No applications matching "${appSearch}"` : "No ID applications yet."}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ REPORTS ══ */}
                        {page === "Reports" && (
                            <div className="fd">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
                                    <div className="scard">
                                        <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 14 }}>Beneficiaries by Type</div>
                                        {[{ label: "Senior Citizens", value: totalSenior, color: C.teal }, { label: "PWD", value: totalPWD, color: C.purple }].map(r => (
                                            <div key={r.label} style={{ marginBottom: 12 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{r.label}</span>
                                                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
                                                </div>
                                                <div style={{ background: C.border, borderRadius: 4, height: 6 }}>
                                                    <div style={{ width: `${Math.round(r.value / bens.length * 100)}%`, height: "100%", background: r.color, borderRadius: 4 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="scard">
                                        <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 14 }}>Online ID Applications</div>
                                        {[
                                            { label: "Total Applications", value: idApplications.length, color: C.navy },
                                            { label: "Senior Citizen", value: idApplications.filter(a => a.id_type === "senior").length, color: C.teal },
                                            { label: "PWD", value: idApplications.filter(a => a.id_type === "pwd").length, color: C.purple },
                                            { label: "Pending", value: idApplications.filter(a => a.status === "Pending Verification").length, color: C.amber },
                                            { label: "Approved", value: idApplications.filter(a => a.status === "Approved").length, color: C.green },
                                        ].map(r => (
                                            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{r.label}</span>
                                                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {/* ── BENEFICIARY FORM MODAL ── */}
            {modal?.kind === "beneficiary" && (
                <Modal title={modal.data ? "Edit Beneficiary" : "Add New Beneficiary"} onClose={closeModal}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Full Name"><input style={{ ...inp, gridColumn: "span 2" }} value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></Field>
                        <Field label="Type">
                            <select style={sel} value={form.type || "Senior Citizen"} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                <option>Senior Citizen</option><option>PWD</option>
                            </select>
                        </Field>
                        <Field label="Gender">
                            <select style={sel} value={form.gender || "Female"} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                                <option>Female</option><option>Male</option>
                            </select>
                        </Field>
                        <Field label="Age"><input style={inp} type="number" value={form.age || ""} onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) }))} /></Field>
                        <Field label="Barangay">
                            <select style={sel} value={form.barangay || ""} onChange={e => setForm(f => ({ ...f, barangay: e.target.value }))}>
                                <option value="">Select barangay</option>
                                {BARANGAYS.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </Field>
                        <Field label="Contact Number"><input style={inp} value={form.contact || ""} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></Field>
                        <Field label="Status">
                            <select style={sel} value={form.status || "Active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                <option>Active</option><option>Inactive</option><option>Pending</option>
                            </select>
                        </Field>
                        <Field label="Stipend Recipient">
                            <select style={sel} value={form.stipend ? "Yes" : "No"} onChange={e => setForm(f => ({ ...f, stipend: e.target.value === "Yes" }))}>
                                <option>No</option><option>Yes</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Medical Conditions / Disability Type">
                        <input style={inp} value={form.conditions || ""} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} placeholder="e.g. Hypertension, Visual Impairment" />
                    </Field>
                    <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                        <button className="btn btn-s" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-p" onClick={saveBen}>{modal.data ? "Save Changes" : "Add Beneficiary"}</button>
                    </div>
                </Modal>
            )}

            {/* ── SERVICE FORM MODAL ── */}
            {modal?.kind === "service" && (
                <Modal title={modal.data ? "Edit Service" : "Add New Service"} onClose={closeModal}>
                    <Field label="Service Title *">
                        <input style={inp} value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Free Medical Consultation" />
                    </Field>
                    <Field label="Description">
                        <textarea style={{ ...inp, resize: "vertical", minHeight: 72 }} value={form.desc || ""} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Brief description of the service…" />
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Category">
                            <select style={sel} value={form.category || "Health"} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                {["Health", "Financial", "Legal", "Social"].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Status">
                            <select style={sel} value={form.status || "Active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                <option>Active</option><option>Inactive</option>
                            </select>
                        </Field>
                        <Field label="Office / Department">
                            <input style={inp} value={form.office || ""} onChange={e => setForm(f => ({ ...f, office: e.target.value }))} placeholder="e.g. City Health Office" />
                        </Field>
                        <Field label="Contact Number">
                            <input style={inp} value={form.contact || ""} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="e.g. (044) 463-0251" />
                        </Field>
                        <Field label="Schedule">
                            <input style={inp} value={form.schedule || ""} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} placeholder="Mon–Fri, 8AM–5PM" />
                        </Field>
                        <Field label="Address / Location">
                            <input style={inp} value={form.addr || ""} onChange={e => setForm(f => ({ ...f, addr: e.target.value }))} placeholder="e.g. City Hall, Cabanatuan City" />
                        </Field>
                    </div>
                    <Field label="Eligibility">
                        <input style={inp} value={form.elig || ""} onChange={e => setForm(f => ({ ...f, elig: e.target.value }))} placeholder="e.g. Senior Citizens (60+) and PWDs" />
                    </Field>
                    <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                        <button className="btn btn-s" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-p" onClick={saveSvc}>{modal.data ? "Save Changes" : "Add Service"}</button>
                    </div>
                </Modal>
            )}

            {/* ── ANNOUNCEMENT FORM MODAL ── */}
            {modal?.kind === "announcement" && (
                <Modal title={modal.data ? "Edit Announcement" : "New Announcement"} onClose={closeModal}>
                    <Field label="Title *"><input style={inp} value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Free Medical Mission – April 2025" /></Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                        <Field label="Date"><input style={inp} type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
                        <Field label="Type">
                            <select style={sel} value={form.type || "Notice"} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                <option>Notice</option><option>Event</option><option>Program</option>
                            </select>
                        </Field>
                        <Field label="Audience">
                            <select style={sel} value={form.audience || "All"} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                                <option>All</option><option>Senior Citizens</option><option>PWD</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Status">
                        <select style={sel} value={form.status || "Draft"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                            <option>Draft</option><option>Published</option>
                        </select>
                    </Field>
                    <Field label="Content *">
                        <textarea style={{ ...inp, resize: "vertical", minHeight: 100 }} value={form.body || ""} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write the full announcement content here…" />
                    </Field>
                    <div style={{ background: "#F7FAF9", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                        💡 <strong>Tip:</strong> Set status to <strong>Published</strong> to make it visible to users on the KalingaNet portal. <strong>Draft</strong> keeps it hidden.
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                        <button className="btn btn-s" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-p" onClick={saveAnn}>{modal.data ? "Save Changes" : "Publish"}</button>
                    </div>
                </Modal>
            )}

            {/* ── ID APPLICATION DETAIL MODAL ── */}
            {selectedApp && (
                <Modal title="ID Application Details" onClose={() => setSelectedApp(null)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "14px 16px", background: C.tealF, borderRadius: 12 }}>
                        <span style={{ fontSize: 36 }}>{selectedApp.id_type === "senior" ? "👴" : "♿"}</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 17, color: C.navy }}>{selectedApp.first_name} {selectedApp.last_name}</div>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{selectedApp.id_type === "senior" ? "Senior Citizen (OSCA ID)" : "Person with Disability (PWD ID)"}</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>{statusBadge(selectedApp.status)}</div>
                    </div>
                    {[
                        { label: "ID Number", val: selectedApp.id_number },
                        { label: "Email", val: selectedApp.email },
                        { label: "Contact", val: selectedApp.contact || "—" },
                        { label: "Birthdate", val: selectedApp.birthdate || "—" },
                        { label: "Address", val: selectedApp.address || "—" },
                        { label: "Applied", val: selectedApp.applied_at ? new Date(selectedApp.applied_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                    ].map((f, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                            <span style={{ color: C.muted, fontWeight: 600 }}>{f.label}</span>
                            <span style={{ color: C.text, textAlign: "right", maxWidth: 240 }}>{f.val}</span>
                        </div>
                    ))}
                    {/* Uploaded Documents */}
                    {(selectedApp.doc_photo || selectedApp.doc_birth_cert || selectedApp.doc_valid_id || selectedApp.doc_med_cert || selectedApp.doc_barangay_cert) && (
                        <div style={{ marginTop: 20 }}>
                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Uploaded Documents</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { key: "doc_photo", label: "1×1 Photo" },
                                    { key: "doc_birth_cert", label: "Birth Certificate" },
                                    { key: "doc_valid_id", label: "Valid ID" },
                                    { key: "doc_med_cert", label: "Medical Certificate" },
                                    { key: "doc_barangay_cert", label: "Barangay Certificate" },
                                ].filter(d => selectedApp[d.key]).map(d => {
                                    const url = selectedApp[d.key];
                                    const isPdf = url && url.toLowerCase().includes(".pdf");
                                    return (
                                        <div key={d.key} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", background: C.bg }}>
                                            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: C.muted, padding: "6px 10px", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>{d.label}</div>
                                            {isPdf ? (
                                                <div style={{ padding: "14px 10px", textAlign: "center" }}>
                                                    <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                                                    <a href={url} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.teal, fontWeight: 600, textDecoration: "none" }}>View PDF ↗</a>
                                                </div>
                                            ) : (
                                                <a href={url} target="_blank" rel="noreferrer">
                                                    <img src={url} alt={d.label} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {!(selectedApp.doc_photo || selectedApp.doc_birth_cert || selectedApp.doc_valid_id || selectedApp.doc_med_cert || selectedApp.doc_barangay_cert) && (
                        <div style={{ marginTop: 16, padding: "12px 14px", background: "#FDF3E7", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#A85E0A" }}>
                            ⚠️ No documents uploaded for this application.
                        </div>
                    )}
                    {selectedApp.status === "Pending Verification" && (
                        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                            <button className="btn btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => updateAppStatus(selectedApp.id, "Approved")}>✓ Approve Application</button>
                            <button className="btn btn-d" style={{ flex: 1, justifyContent: "center" }} onClick={() => updateAppStatus(selectedApp.id, "Rejected")}>✕ Reject Application</button>
                        </div>
                    )}
                </Modal>
            )}

            {/* ── EDIT USER MODAL ── */}
            {selectedUser && (
                <Modal title="Edit Registered User" onClose={() => setSelectedUser(null)}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="First Name">
                            <input style={inp} value={userForm.first_name || ""} onChange={e => setUserForm(f => ({ ...f, first_name: e.target.value }))} />
                        </Field>
                        <Field label="Last Name">
                            <input style={inp} value={userForm.last_name || ""} onChange={e => setUserForm(f => ({ ...f, last_name: e.target.value }))} />
                        </Field>
                        <Field label="Email">
                            <input style={inp} value={userForm.email || ""} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
                        </Field>
                        <Field label="Contact">
                            <input style={inp} value={userForm.contact || ""} onChange={e => setUserForm(f => ({ ...f, contact: e.target.value }))} />
                        </Field>
                        <Field label="Birthdate">
                            <input style={inp} type="date" value={userForm.birthdate || ""} onChange={e => setUserForm(f => ({ ...f, birthdate: e.target.value }))} />
                        </Field>
                        <Field label="ID Type">
                            <select style={sel} value={userForm.id_type || ""} onChange={e => setUserForm(f => ({ ...f, id_type: e.target.value }))}>
                                <option value="">None</option>
                                <option value="senior">Senior Citizen</option>
                                <option value="pwd">PWD</option>
                            </select>
                        </Field>
                        <Field label="ID Status">
                            <select style={sel} value={userForm.id_status || ""} onChange={e => setUserForm(f => ({ ...f, id_status: e.target.value }))}>
                                <option value="">—</option>
                                <option value="Pending Verification">Pending Verification</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </Field>
                        <Field label="ID Number">
                            <input style={inp} value={userForm.id_number || ""} onChange={e => setUserForm(f => ({ ...f, id_number: e.target.value }))} />
                        </Field>
                    </div>
                    <Field label="Home Address">
                        <input style={inp} value={userForm.address || ""} onChange={e => setUserForm(f => ({ ...f, address: e.target.value }))} />
                    </Field>
                    <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
                        <button className="btn btn-s" onClick={() => setSelectedUser(null)}>Cancel</button>
                        <button className="btn btn-p" onClick={saveUserEdit}>Save Changes</button>
                    </div>
                </Modal>
            )}

            {/* ── DELETE USER CONFIRM ── */}
            {confirmDeleteUser && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <div style={{ fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 8 }}>Delete User?</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 6 }}>
                            You are about to delete <strong>{confirmDeleteUser.first_name} {confirmDeleteUser.last_name}</strong>.
                        </div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.red, marginBottom: 24 }}>
                            This will remove their profile data. This action cannot be undone.
                        </div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button className="btn btn-s" onClick={() => setConfirmDeleteUser(null)}>Cancel</button>
                            <button className="btn btn-d" onClick={() => deleteUser(confirmDeleteUser.id)}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}


            {confirm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <div style={{ fontWeight: 700, fontSize: 17, color: C.navy, marginBottom: 8 }}>Delete Beneficiary?</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 24 }}>This action cannot be undone. The beneficiary record will be permanently removed.</div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button className="btn btn-s" onClick={() => setConfirm(null)}>Cancel</button>
                            <button className="btn btn-d" onClick={() => deleteBen(confirm)}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}