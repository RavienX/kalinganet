import { useState, useEffect } from "react";

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

const SERVICES = [
  { id: 1, cat: "Health", icon: "🏥", title: "Free Medical Consultation", office: "City Health Office", addr: "City Hall Compound, Brgy. Aduas Norte", contact: "(044) 463-0251", sched: "Mon–Fri, 8AM–5PM", elig: "All registered senior citizens and PWDs", desc: "Free consultation with government physicians including basic diagnostics, blood pressure monitoring, and prescription of essential medicines.", tags: ["Health", "Free"] },
  { id: 2, cat: "Health", icon: "💊", title: "Free Medicines – Botika ng Bayan", office: "City Health Office", addr: "City Hall Compound, Cabanatuan City", contact: "(044) 463-0251", sched: "Mon–Fri, 8AM–5PM", elig: "Senior citizens with OSCA ID; PWDs with PWD ID", desc: "Generic medicines at no cost including maintenance meds for hypertension, diabetes, and asthma.", tags: ["Health", "Free", "Medicines"] },
  { id: 3, cat: "Health", icon: "🩺", title: "PhilHealth Z-Benefit Package", office: "PhilHealth – Nueva Ecija", addr: "Maharlika Highway, Cabanatuan City", contact: "(044) 940-1234", sched: "Mon–Fri, 8AM–5PM", elig: "Senior citizens 60+ enrolled in PhilHealth", desc: "Covers catastrophic illnesses including cancer, kidney disease, and heart conditions. Up to ₱1,000,000 in hospital benefits per year.", tags: ["Health", "PhilHealth", "Senior"] },
  { id: 4, cat: "Health", icon: "👁️", title: "Free Eye Exam & Reading Glasses", office: "CSWDO", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 463-1158", sched: "Quarterly (check OSCA)", elig: "Senior citizens 60+ and registered PWDs", desc: "Eye examination by visiting ophthalmologists and free reading glasses for qualified beneficiaries during medical missions.", tags: ["Health", "Free", "Medical Mission"] },
  { id: 5, cat: "Financial", icon: "💰", title: "Monthly Stipend (SPISC)", office: "CSWDO", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 463-1158", sched: "Monthly – check OSCA", elig: "Indigent seniors; 60–79: ₱500/mo; 80+: ₱1,000/mo", desc: "Social Pension for Indigent Senior Citizens. Monthly cash grant for unattached, indigent seniors with no regular income.", tags: ["Financial", "Monthly", "Senior"] },
  { id: 6, cat: "Financial", icon: "🏷️", title: "20% Discount & VAT Exemption", office: "OSCA", addr: "City Hall, Cabanatuan City", contact: "(044) 463-0100", sched: "Ongoing – use OSCA ID", elig: "All senior citizens 60+ with valid OSCA ID", desc: "20% discount on medicines, medical services, transportation, restaurants, hotels, and more. VAT exempt on basic goods.", tags: ["Financial", "Discount", "Senior"] },
  { id: 7, cat: "Financial", icon: "♿", title: "PWD 20% Discount", office: "CPDAO", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 463-2200", sched: "Ongoing – use PWD ID", elig: "All registered PWDs with valid PWD ID", desc: "20% discount on medicines, medical consultations, public transportation, and admission fees to cultural and leisure centers.", tags: ["Financial", "Discount", "PWD"] },
  { id: 8, cat: "Financial", icon: "🏦", title: "SSS Retirement Pension", office: "SSS – Nueva Ecija Branch", addr: "Burgos Ave., Cabanatuan City", contact: "1455 (SSS Hotline)", sched: "Mon–Fri, 8AM–5PM", elig: "SSS members aged 60–65 with 120+ contributions", desc: "Monthly pension for retired SSS members. Apply in person. Processing takes 4–6 weeks.", tags: ["Financial", "Pension", "Senior"] },
  { id: 9, cat: "Legal", icon: "⚖️", title: "Free Legal Assistance – PAO", office: "Public Attorney's Office", addr: "Hall of Justice, Cabanatuan City", contact: "(044) 463-5000", sched: "Mon–Fri, 8AM–5PM", elig: "Indigent senior citizens and PWDs (income threshold applies)", desc: "Free legal advice, document preparation, and court representation in civil, criminal, labor, and administrative cases.", tags: ["Legal", "Free", "Assistance"] },
  { id: 10, cat: "Legal", icon: "📄", title: "Free Notarial Services", office: "OSCA", addr: "City Hall, Cabanatuan City", contact: "(044) 463-0100", sched: "Mon–Fri, 8AM–12PM", elig: "Senior citizens 60+ with valid OSCA ID", desc: "Free notarization of affidavits, consent forms, deed of donation, and special powers of attorney.", tags: ["Legal", "Free", "Senior"] },
  { id: 11, cat: "Social", icon: "🎓", title: "Livelihood Training Program", office: "CSWDO / TESDA", addr: "CSWDO Office, City Hall Compound", contact: "(044) 463-1158", sched: "Quarterly (check CSWDO)", elig: "PWDs 18–59; seniors 60–70 in good health", desc: "Skills training: food processing, handicrafts, computer literacy, and small enterprise development. Starter kits upon graduation.", tags: ["Social", "Training", "Livelihood"] },
  { id: 12, cat: "Social", icon: "🏠", title: "Housing Assistance – NHA", office: "NHA – Region III", addr: "San Fernando, Pampanga", contact: "(045) 961-0039", sched: "Mon–Fri, 8AM–5PM", elig: "Homeless or disaster-affected seniors and PWDs (income-based)", desc: "Resettlement housing and home modification grants for PWDs (ramps, grab bars, wider doorways).", tags: ["Social", "Housing"] },
  { id: 13, cat: "Social", icon: "🍱", title: "Supplemental Feeding Program", office: "CSWDO", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 463-1158", sched: "Mon–Fri (via barangay)", elig: "Malnourished senior citizens (nutritional assessment required)", desc: "Daily nutritional supplementation for at-risk elderly coordinated through barangay health workers.", tags: ["Social", "Nutrition", "Senior"] },
  { id: 14, cat: "Social", icon: "🚌", title: "Free or Reduced Transportation", office: "LTFRB", addr: "Bus terminals & jeepney routes", contact: "1342 (LTFRB Hotline)", sched: "Daily – show ID", elig: "All senior citizens with OSCA ID; all PWDs with PWD ID", desc: "20% discount on all public transportation. Both groups entitled to priority seating nationwide.", tags: ["Social", "Transport", "Discount"] },
];

const OFFICES = [
  { name: "OSCA – Office for Senior Citizens Affairs", addr: "City Hall, Cabanatuan City", contact: "(044) 463-0100", hours: "Mon–Fri, 8AM–5PM", icon: "🏛️" },
  { name: "CSWDO – City Social Welfare & Development", addr: "City Hall Compound, Cabanatuan City", contact: "(044) 463-1158", hours: "Mon–Fri, 8AM–5PM", icon: "🤝" },
  { name: "CPDAO – City PWD Affairs Office", addr: "City Hall Annex, Cabanatuan City", contact: "(044) 463-2200", hours: "Mon–Fri, 8AM–5PM", icon: "♿" },
  { name: "City Health Office", addr: "City Hall Compound, Cabanatuan City", contact: "(044) 463-0251", hours: "Mon–Fri, 8AM–5PM", icon: "🏥" },
  { name: "Public Attorney's Office (PAO)", addr: "Hall of Justice, Cabanatuan City", contact: "(044) 463-5000", hours: "Mon–Fri, 8AM–5PM", icon: "⚖️" },
  { name: "PhilHealth – Nueva Ecija Branch", addr: "Maharlika Highway, Cabanatuan City", contact: "(044) 940-1234", hours: "Mon–Fri, 8AM–5PM", icon: "💙" },
];

const REQS = [
  { title: "Senior Citizen (OSCA ID)", icon: "👴", reqs: ["Original PSA Birth Certificate", "1 Valid Government-issued ID", "2 pcs 1×1 colored ID photo", "Proof of residency (barangay certificate)"], where: "OSCA Office, City Hall, Cabanatuan City", contact: "(044) 463-0100" },
  { title: "Person with Disability (PWD ID)", icon: "♿", reqs: ["Medical Certificate from a licensed physician", "PSA Birth Certificate or valid government ID", "2 pcs 1×1 colored ID photo", "Barangay certificate of residency"], where: "CPDAO Office, City Hall Annex, Cabanatuan City", contact: "(044) 463-2200" },
];

const FAQS = [
  { q: "Can I use my OSCA/PWD ID anywhere in the Philippines?", a: "Yes. Your OSCA or PWD ID is valid nationwide. You are entitled to discounts and benefits in any city or municipality, not just in Cabanatuan City." },
  { q: "My parent is bedridden. Can I register on their behalf?", a: "Yes. A representative (child, spouse, or caregiver) may register on their behalf with a Special Power of Attorney, your own valid ID, and the required documents." },
  { q: "Is there an age requirement for the PWD ID?", a: "There is no minimum age. Infants and children with disabilities may also be registered by a parent or guardian." },
  { q: "How do I renew my OSCA or PWD ID?", a: "Visit the OSCA or CPDAO office before your ID expires. Bring your old ID, an updated 1×1 photo, and proof of residency. Renewal is free." },
  { q: "What if a business refuses to honor my discount?", a: "Report it to OSCA (senior discounts) or CPDAO (PWD discounts), or file a complaint with the DTI. Violations are punishable under RA 9994 and RA 7277." },
  { q: "Are there livelihood programs for PWDs?", a: "Yes. TESDA and CSWDO offer skills training programs. Visit the CSWDO office at City Hall to ask about available slots and schedules." },
];

const NAV = ["Home", "Services", "Register", "Offices", "FAQ"];

export default function KalingaNet() {
  const [page, setPage] = useState("Home");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [svc, setSvc] = useState(null);
  const [faq, setFaq] = useState(null);

  const go = (p) => { setPage(p); setSvc(null); setFaq(null); window.scrollTo(0, 0); };

  const filtered = SERVICES.filter(s =>
    (cat === "All" || s.cat === cat) &&
    (!q || s.title.toLowerCase().includes(q.toLowerCase()) ||
      s.desc.toLowerCase().includes(q.toLowerCase()))
  );

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100% !important; max-width: none !important; overflow-x: hidden; background: #F7FAF9; font-family: 'Lora', Georgia, serif; }
    #root { width: 100% !important; max-width: none !important; }
    .w { width: 100%; padding-left: 40px; padding-right: 40px; }
    .btn-p { display:inline-flex; align-items:center; gap:6px; background:#0D7A6B; color:#fff; border:none; padding:11px 24px; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:background .15s,transform .1s; white-space:nowrap; }
    .btn-p:hover { background:#085C50; transform:translateY(-1px); }
    .btn-o { display:inline-flex; align-items:center; gap:6px; background:transparent; color:#0D7A6B; border:1.5px solid #0D7A6B; padding:10px 22px; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all .15s; white-space:nowrap; }
    .btn-o:hover { background:#E6F5F2; }
    .card { background:#fff; border:1px solid #D8E8E4; border-radius:14px; transition:box-shadow .2s,transform .2s; }
    .card:hover { box-shadow:0 6px 24px rgba(13,122,107,.13); transform:translateY(-2px); }
    .pill { display:inline-block; font-size:11px; font-family:'DM Sans',sans-serif; font-weight:600; padding:3px 10px; border-radius:20px; }
    .nb { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; background:none; border:none; cursor:pointer; padding:7px 13px; border-radius:8px; color:#5A7080; transition:all .15s; }
    .nb:hover { color:#0D7A6B; background:#E6F5F2; }
    .nb.on { color:#0D7A6B; background:#E6F5F2; font-weight:600; }
    .cp { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; padding:7px 16px; border-radius:20px; cursor:pointer; border:1.5px solid transparent; transition:all .15s; }
    .si { width:100%; padding:12px 16px 12px 44px; border:1.5px solid #D8E8E4; border-radius:10px; font-size:15px; color:#1C2B3A; background:#fff; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .2s; }
    .si:focus { border-color:#0D7A6B; }
    .ir { display:flex; gap:8px; align-items:flex-start; padding:9px 0; border-bottom:1px solid #f0f4f3; font-family:'DM Sans',sans-serif; font-size:14px; }
    .ir:last-child { border-bottom:none; }
    .fqb { width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:18px 0; font-family:'Lora',serif; font-size:16px; font-weight:600; color:#1C2B3A; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .oc { background:#fff; border:1px solid #D8E8E4; border-radius:14px; padding:22px; display:flex; gap:16px; transition:box-shadow .2s; }
    .oc:hover { box-shadow:0 4px 20px rgba(13,122,107,.10); }
    .ov { position:fixed; inset:0; background:rgba(0,0,0,.48); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; }
    .mo { background:#fff; border-radius:18px; width:100%; max-width:540px; max-height:90vh; overflow-y:auto; padding:32px; position:relative; animation:sUp .22s ease; }
    @keyframes sUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .fd { animation:fUp .35s ease both; }
    @keyframes fUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    .g2 { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:16px; }
    .g4 { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:16px; }
    .hero { display:flex; gap:48px; align-items:center; padding:56px 0 40px; }
    .st { display:grid; grid-template-columns:1fr 1fr; gap:14px; flex-shrink:0; }
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#12A08C;border-radius:3px}
    @media(max-width:680px){ .hero{flex-direction:column;} .st{width:100%;} .w{padding-left:20px;padding-right:20px;} }
  `;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 10px rgba(0,0,0,.07)", width: "100%" }}>
        <div className="w" style={{ height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("Home")}>
            <div style={{ width: 36, height: 36, background: T.teal, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: T.teal, lineHeight: 1.1 }}>KalingaNet</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: T.light }}>Cabanatuan City</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {NAV.map(n => <button key={n} className={`nb ${page === n ? "on" : ""}`} onClick={() => go(n)}>{n}</button>)}
          </div>
          <button className="btn-p" style={{ fontSize: 13, padding: "8px 18px" }} onClick={() => go("Register")}>Get ID ↗</button>
        </div>
      </nav>

      <div style={{ width: "100%", minHeight: "calc(100vh - 62px)" }}>

        {/* ── HOME ── */}
        {page === "Home" && (
          <div className="fd">
            <div className="w">
              <div className="hero">
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
                    <span style={{ fontSize: 12 }}>🌿</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.teal, fontWeight: 600 }}>Cabanatuan City Official Portal</span>
                  </div>
                  <h1 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, lineHeight: 1.15, color: T.navy, marginBottom: 18 }}>
                    Services for<br />
                    <span style={{ color: T.teal }}>Senior Citizens</span><br />
                    <span style={{ color: T.amber }}>& PWDs</span>
                  </h1>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.75, marginBottom: 30, maxWidth: 460 }}>
                    Find government benefits, health programs, financial assistance, and more — all in one place. No app needed. Free to use.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button className="btn-p" style={{ fontSize: 15, padding: "12px 26px" }} onClick={() => go("Services")}>Browse All Services →</button>
                    <button className="btn-o" style={{ fontSize: 15, padding: "12px 26px" }} onClick={() => go("Register")}>How to Get Your ID</button>
                  </div>
                </div>
                <div className="st">
                  {[
                    { num: "14+", lbl: "Services Listed", icon: "📋", c: T.teal },
                    { num: "Free", lbl: "To Use", icon: "✅", c: T.amber },
                    { num: "4", lbl: "Categories", icon: "🗂️", c: "#3D4FBF" },
                    { num: "24/7", lbl: "Available", icon: "🕐", c: "#A03070" },
                  ].map((s, i) => (
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
                  <div key={c} className="card" style={{ padding: "22px 20px", cursor: "pointer", background: col.bg, border: `1px solid ${col.bdr}` }}
                    onClick={() => { setCat(c); go("Services"); }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{catIcon[c]}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: col.text, marginBottom: 4 }}>{c}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted }}>{SERVICES.filter(s => s.cat === c).length} services available</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w" style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Most Important Benefits</h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, marginBottom: 20 }}>Essential services every senior citizen and PWD should know about.</p>
              <div className="g2">
                {SERVICES.filter(s => [5, 6, 7, 9].includes(s.id)).map(s => <SCard key={s.id} s={s} onClick={() => setSvc(s)} />)}
              </div>
            </div>

            <div className="w" style={{ paddingBottom: 64 }}>
              <div style={{ background: T.teal, borderRadius: 18, padding: "36px 40px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Don't have your ID yet?</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.85)" }}>Registration is free. Learn what you need to bring.</div>
                </div>
                <button className="btn-p" style={{ background: "#fff", color: T.teal, padding: "12px 28px", fontSize: 15 }} onClick={() => go("Register")}>How to Register →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {page === "Services" && (
          <div className="w fd" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 6 }}>All Services & Benefits</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 28 }}>Browse all programs for senior citizens and PWDs in Cabanatuan City.</p>
            <div style={{ position: "relative", marginBottom: 18 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: .45 }}>🔍</span>
              <input className="si" placeholder="Search services, benefits, programs…" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {["All", "Health", "Financial", "Legal", "Social"].map(c => {
                const on = cat === c, col = catCol[c];
                return <button key={c} className="cp"
                  style={{ background: on ? (col ? col.bg : T.tealF) : "#fff", color: on ? (col ? col.text : T.teal) : T.muted, border: `1.5px solid ${on ? (col ? col.bdr : T.teal) : T.border}` }}
                  onClick={() => setCat(c)}>{c}</button>;
              })}
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, marginBottom: 16 }}>Showing {filtered.length} of {SERVICES.length} services</div>
            <div className="g2">
              {filtered.map(s => <SCard key={s.id} s={s} onClick={() => setSvc(s)} />)}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'DM Sans',sans-serif", color: T.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div>No results for "{q}"</div>
                <button style={{ marginTop: 14, color: T.teal, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} onClick={() => { setQ(""); setCat("All"); }}>Clear search</button>
              </div>
            )}
          </div>
        )}

        {/* ── REGISTER ── */}
        {page === "Register" && (
          <div className="w fd" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 8 }}>How to Register</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 32 }}>Getting your OSCA or PWD ID is free and opens access to discounts, benefits, and programs.</p>
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
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 18, padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.navy, marginBottom: 24 }}>Step-by-Step Process</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24 }}>
                {[
                  { n: "1", t: "Prepare Documents", d: "Gather all requirements listed above before your visit." },
                  { n: "2", t: "Visit the Office", d: "Go to OSCA or CPDAO, Mon–Fri, 8AM–5PM." },
                  { n: "3", t: "Fill Out the Form", d: "Accomplish the registration form at the office. Simple and free." },
                  { n: "4", t: "Get Your ID", d: "Receive your ID same day or within 3–5 working days." },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ width: 38, height: 38, background: T.teal, color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>{s.n}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: T.navy, marginBottom: 5 }}>{s.t}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── OFFICES ── */}
        {page === "Offices" && (
          <div className="w fd" style={{ paddingTop: 40, paddingBottom: 64 }}>
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
            <div style={{ background: "#FFF5F5", border: "1px solid #FFC5C5", borderRadius: 18, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#A03030", marginBottom: 16 }}>🆘 Emergency Hotlines</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                {[{ lbl: "Emergency / 911", num: "911" }, { lbl: "Cabanatuan City Hotline", num: "(044) 463-0100" }, { lbl: "PNP – Nueva Ecija", num: "(044) 463-3333" }, { lbl: "BJMP", num: "(044) 463-4444" }].map((h, i) => (
                  <div key={i} style={{ fontFamily: "'DM Sans',sans-serif" }}>
                    <div style={{ fontSize: 12, color: "#A03030", fontWeight: 600, marginBottom: 3 }}>{h.lbl}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#C0392B" }}>{h.num}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {page === "FAQ" && (
          <div className="w fd" style={{ paddingTop: 40, paddingBottom: 64 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Frequently Asked Questions</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: T.muted, fontSize: 15, marginBottom: 32 }}>Common questions about senior citizen and PWD services.</p>
            <div style={{ marginBottom: 48 }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <button className="fqb" onClick={() => setFaq(faq === i ? null : i)}>
                    <span>{f.q}</span>
                    <span style={{ fontSize: 22, color: T.teal, flexShrink: 0, display: "block", transition: "transform .2s", transform: faq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {faq === i && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.75, paddingBottom: 20, paddingRight: 32 }}>{f.a}</div>}
                </div>
              ))}
            </div>
            <div style={{ background: T.tealF, border: `1px solid ${T.border}`, borderRadius: 18, padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Still have a question?</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>Visit the OSCA or CSWDO office, or call the Cabanatuan City hotline.</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <button className="btn-p" onClick={() => go("Offices")}>View All Offices →</button>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text }}>📞 <strong>(044) 463-0100</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: T.navy, color: "rgba(255,255,255,.72)", width: "100%" }}>
        <div className="w" style={{ paddingTop: 40, paddingBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: T.teal, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
                <span style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>KalingaNet</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.75 }}>A free public information service for senior citizens and PWDs in Cabanatuan City. Maintained by OSCA and CSWDO.</p>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Quick Links</div>
              {NAV.map(n => <div key={n} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 9, cursor: "pointer" }} onClick={() => go(n)}>{n}</div>)}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Contact</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 2.1 }}>
                <div>📍 City Hall, Cabanatuan City</div>
                <div>📞 (044) 463-0100 (OSCA)</div>
                <div>📞 (044) 463-1158 (CSWDO)</div>
                <div>🕐 Mon–Fri, 8:00 AM – 5:00 PM</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, fontFamily: "'DM Sans',sans-serif", fontSize: 12, textAlign: "center" }}>
            KalingaNet © 2025 · Cabanatuan City Government · A BPA Capstone Project · NEUST
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {svc && (
        <div className="ov" onClick={() => setSvc(null)}>
          <div className="mo" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSvc(null)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.muted }}>✕</button>
            <div style={{ fontSize: 38, marginBottom: 8 }}>{svc.icon}</div>
            <span className="pill" style={{ background: catCol[svc.cat].bg, color: catCol[svc.cat].text, marginBottom: 14, display: "inline-block" }}>{svc.cat}</span>
            <h2 style={{ fontSize: 21, fontWeight: 700, color: T.navy, lineHeight: 1.3, marginBottom: 12 }}>{svc.title}</h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.75, marginBottom: 22 }}>{svc.desc}</p>
            <div style={{ background: T.bg, borderRadius: 12, padding: 16 }}>
              {[
                { icon: "🏛️", lbl: "Office", val: svc.office },
                { icon: "📍", lbl: "Address", val: svc.addr },
                { icon: "📞", lbl: "Contact", val: svc.contact },
                { icon: "🕐", lbl: "Schedule", val: svc.sched },
                { icon: "✅", lbl: "Eligibility", val: svc.elig },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: T.light, textTransform: "uppercase", letterSpacing: ".05em" }}>{r.lbl}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text, marginTop: 2 }}>{r.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {svc.tags.map(t => <span key={t} className="pill" style={{ background: T.tealF, color: T.teal }}>{t}</span>)}
            </div>
            <button className="btn-p" style={{ marginTop: 20, width: "100%" }} onClick={() => { setSvc(null); go("Offices"); }}>Find the Office →</button>
          </div>
        </div>
      )}
    </>
  );
}

function SCard({ s, onClick }) {
  const col = catCol[s.cat];
  return (
    <div className="card" style={{ padding: 20, cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{s.icon}</span>
        <span className="pill" style={{ background: col.bg, color: col.text, border: `1px solid ${col.bdr}` }}>{s.cat}</span>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: T.navy, lineHeight: 1.4, marginBottom: 7 }}>{s.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.desc}</p>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.light }}>📞 {s.contact}</div>
      <div style={{ marginTop: 10, color: T.teal, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>View details →</div>
    </div>
  );
}