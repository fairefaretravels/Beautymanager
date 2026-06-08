import { useState, useEffect } from "react";

function load(k, fb) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function fmt$(n) { return "$" + Number(n).toFixed(2); }
function today() { return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
function tid() { return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7); }

// ── Palette ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0D14", bg2: "#13131F", bg3: "#1A1A2A", bg4: "#22223A",
  purple: "#7C5CBF", purple2: "#9B7FD4", purple3: "#BBA4E8", purpleL: "#2A1F4A",
  pink: "#D4527A", pinkL: "#3A1525", pinkM: "#8B2F4F",
  gold: "#C9952A", goldL: "#2A2010", goldM: "#8B6820",
  teal: "#2EC4B6", tealL: "#0D2A28",
  green: "#4CAF50", greenL: "#0D1F0F",
  text: "#F0ECF8", muted: "#7A7A9A", border: "#2A2A3F",
  white: "#FFFFFF",
};

const g = {
  app: { fontFamily: "'DM Sans', system-ui, sans-serif", background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.text },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: C.bg2, borderBottom: `0.5px solid ${C.border}` },
  logo: { fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.05em", background: `linear-gradient(135deg, ${C.purple2}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  nav: { display: "flex", gap: 2, padding: "10px 16px", background: C.bg2, borderBottom: `0.5px solid ${C.border}`, overflowX: "auto" },
  tab: (a) => ({ padding: "7px 14px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: a ? 600 : 400, border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", color: a ? C.white : C.muted, background: a ? C.purple : "transparent", transition: "all .15s" }),
  body: { flex: 1, padding: 20, overflowY: "auto" },
  sTitle: { fontSize: 18, fontWeight: 700, marginBottom: 3, color: C.text },
  sSub: { fontSize: 12, color: C.muted, marginBottom: 18 },
  statRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 },
  stat: (col) => ({ background: col || C.bg3, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: "13px 15px" }),
  statLabel: { fontSize: 10, color: C.muted, marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase" },
  statVal: { fontSize: 24, fontWeight: 700, color: C.text, lineHeight: 1 },
  statSub: { fontSize: 11, color: C.muted, marginTop: 3 },
  card: (extra) => ({ background: C.bg3, border: `0.5px solid ${C.border}`, borderRadius: 10, marginBottom: 12, ...extra }),
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: `0.5px solid ${C.border}` },
  cardTitle: { fontSize: 13, fontWeight: 600, color: C.text },
  cardBody: { padding: "14px 16px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  threeCol: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  btn: (type) => {
    const map = {
      primary: { background: C.purple, color: C.white, border: "none" },
      pink: { background: C.pink, color: C.white, border: "none" },
      gold: { background: C.gold, color: C.white, border: "none" },
      teal: { background: C.teal, color: C.bg, border: "none" },
      ghost: { background: "transparent", color: C.muted, border: `0.5px solid ${C.border}` },
      danger: { background: "transparent", color: C.pink, border: `0.5px solid ${C.pink}` },
    };
    return { ...map[type || "ghost"], padding: "6px 14px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderRadius: 6, cursor: "pointer", transition: "all .15s" };
  },
  badge: (type) => {
    const map = {
      purple: { background: C.purpleL, color: C.purple3 },
      pink: { background: C.pinkL, color: "#E8829A" },
      gold: { background: C.goldL, color: "#E8B84A" },
      teal: { background: C.tealL, color: C.teal },
      green: { background: C.greenL, color: C.green },
      gray: { background: C.bg4, color: C.muted },
    };
    return { ...map[type || "gray"], display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em" };
  },
  fi: { padding: "8px 10px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", border: `0.5px solid ${C.border}`, borderRadius: 7, background: C.bg4, color: C.text, outline: "none", width: "100%", boxSizing: "border-box" },
  fg: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 },
  fl: { fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase" },
  fr: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  divider: { height: "0.5px", background: C.border, margin: "12px 0" },
  row: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `0.5px solid ${C.border}` },
};

function Btn({ type, onClick, children, style: ex }) {
  return <button onClick={onClick} style={{ ...g.btn(type), ...ex }}>{children}</button>;
}
function Badge({ type, children }) { return <span style={g.badge(type)}>{children}</span>; }
function Card({ children, style: ex }) { return <div style={g.card(ex)}>{children}</div>; }
function CardHead({ title, action }) { return <div style={g.cardHead}><div style={g.cardTitle}>{title}</div>{action}</div>; }
function FI({ id, placeholder, type, value, onChange, children, rows }) {
  if (children) return <select id={id} style={g.fi} value={value} onChange={onChange}>{children}</select>;
  if (rows) return <textarea id={id} style={{ ...g.fi, resize: "vertical" }} rows={rows} placeholder={placeholder} value={value} onChange={onChange} />;
  return <input id={id} style={g.fi} placeholder={placeholder} type={type || "text"} value={value} onChange={onChange} />;
}
function FG({ label, children }) { return <div style={g.fg}><label style={g.fl}>{label}</label>{children}</div>; }

// ── INIT DATA ─────────────────────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id: tid(), name: "Lace Front Wig 20\"", cat: "Wigs", stock: 8, price: 149, sku: "WIG-LF-20" },
  { id: tid(), name: "HD Closure Wig 18\"", cat: "Wigs", stock: 3, price: 189, sku: "WIG-HD-18" },
  { id: tid(), name: "Clip-In Extensions 24\"", cat: "Extensions", stock: 14, price: 89, sku: "EXT-CI-24" },
  { id: tid(), name: "Tape-In Extensions 18\"", cat: "Extensions", stock: 6, price: 72, sku: "EXT-TI-18" },
  { id: tid(), name: "Mink Lashes 25mm", cat: "Lashes", stock: 22, price: 18, sku: "LSH-MK-25" },
  { id: tid(), name: "Strip Lashes 20mm", cat: "Lashes", stock: 30, price: 12, sku: "LSH-ST-20" },
  { id: tid(), name: "Wig Glue & Bond Kit", cat: "Accessories", stock: 11, price: 24, sku: "ACC-GB-01" },
  { id: tid(), name: "Silk Press Serum", cat: "Care", stock: 5, price: 32, sku: "CAR-SP-01" },
];

const INIT_VENDORS = [
  {
    id: tid(), name: "BellaHair Wholesale", contact: "orders@bellahair.com", rating: 5,
    prices: [
      { item: "Lace Front Wig 20\"", price: 62 },
      { item: "Mink Lashes 25mm", price: 4.50 },
      { item: "Clip-In Extensions 24\"", price: 31 },
      { item: "Wig Glue & Bond Kit", price: 8.20 },
    ]
  },
  {
    id: tid(), name: "GloryLocks Supply", contact: "sales@glorylocks.com", rating: 4,
    prices: [
      { item: "Lace Front Wig 20\"", price: 58 },
      { item: "Mink Lashes 25mm", price: 5.00 },
      { item: "Clip-In Extensions 24\"", price: 28 },
      { item: "HD Closure Wig 18\"", price: 74 },
    ]
  },
  {
    id: tid(), name: "QueenTress Direct", contact: "QueenTress@wholesale.com", rating: 4,
    prices: [
      { item: "Lace Front Wig 20\"", price: 71 },
      { item: "HD Closure Wig 18\"", price: 68 },
      { item: "Mink Lashes 25mm", price: 3.80 },
      { item: "Strip Lashes 20mm", price: 2.10 },
      { item: "Tape-In Extensions 18\"", price: 26 },
    ]
  },
];

const INIT_CONTENT = [
  { id: tid(), title: "Summer Wig Install Tutorial", type: "Demo", platform: "TikTok", product: "Lace Front Wig 20\"", status: "published", date: "Jun 5, 2026", views: "42.1k", notes: "" },
  { id: tid(), title: "Lash Bundle Ad — BOGO Sale", type: "Ad", platform: "Instagram", product: "Mink Lashes 25mm", status: "running", date: "Jun 3, 2026", views: "18.4k", notes: "ROAS 3.2x" },
  { id: tid(), title: "Live Replay — Wig Giveaway", type: "Live", platform: "TikTok", product: "HD Closure Wig 18\"", status: "published", date: "Jun 1, 2026", views: "8.9k", notes: "6,200 peak viewers" },
  { id: tid(), title: "Extension Care Routine", type: "Demo", platform: "YouTube", product: "Clip-In Extensions 24\"", status: "draft", date: "Jun 7, 2026", views: "—", notes: "" },
  { id: tid(), title: "Flash Sale Ad — 48hr", type: "Ad", platform: "TikTok", product: "Strip Lashes 20mm", status: "scheduled", date: "Jun 10, 2026", views: "—", notes: "Budget $120" },
];

const INIT_GIVEAWAYS = [
  { id: tid(), prize: "HD Closure Wig 18\"", value: 189, platform: "TikTok", entries: 847, status: "active", winner: "", date: "Jun 7, 2026", method: "Comment to enter" },
  { id: tid(), prize: "Lash Bundle (3 pairs)", value: 54, platform: "Instagram", entries: 1240, status: "completed", winner: "@beautybyniamh", date: "Jun 1, 2026", method: "Follow + tag a friend" },
];

const INIT_BOXES = [
  {
    id: tid(), name: "Glam Starter Box", tier: "Basic", price: 49, items: [
      { name: "Strip Lashes 20mm", qty: 2 },
      { name: "Wig Glue & Bond Kit", qty: 1 },
    ], active: true, subscribers: 34,
  },
  {
    id: tid(), name: "Queen Box", tier: "Premium", price: 89, items: [
      { name: "Mink Lashes 25mm", qty: 3 },
      { name: "Clip-In Extensions 24\"", qty: 1 },
      { name: "Silk Press Serum", qty: 1 },
    ], active: true, subscribers: 18,
  },
];

const INIT_SALES = [
  { id: tid(), product: "Lace Front Wig 20\"", units: 2, price: 149, channel: "TikTok Live", date: "Jun 7" },
  { id: tid(), product: "Mink Lashes 25mm", units: 5, price: 18, channel: "Etsy", date: "Jun 7" },
  { id: tid(), product: "Clip-In Extensions 24\"", units: 1, price: 89, channel: "Instagram DM", date: "Jun 6" },
  { id: tid(), product: "Strip Lashes 20mm", units: 8, price: 12, channel: "TikTok Live", date: "Jun 6" },
];

// ── DASHBOARD ─────────────────────────────────────────────────────────────
function Dashboard({ products, giveaways, sales, boxes, setView }) {
  const rev = sales.reduce((a, s) => a + s.units * s.price, 0);
  const lowStock = products.filter(p => p.stock < 5).length;
  const activeGive = giveaways.filter(g => g.status === "active").length;
  const subs = boxes.reduce((a, b) => a + b.subscribers, 0);

  return (
    <div>
      <div style={g.sTitle}>Welcome back 👑</div>
      <div style={g.sSub}>{today()}</div>
      <div style={g.statRow}>
        <div style={g.stat()}><div style={g.statLabel}>Today's revenue</div><div style={{ ...g.statVal, color: C.purple2 }}>{fmt$(rev)}</div><div style={g.statSub}>{sales.length} orders</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Low stock alerts</div><div style={{ ...g.statVal, color: lowStock > 0 ? C.pink : C.green }}>{lowStock}</div><div style={g.statSub}>items need reorder</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Active giveaways</div><div style={{ ...g.statVal, color: C.gold }}>{activeGive}</div><div style={g.statSub}>running now</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Box subscribers</div><div style={{ ...g.statVal, color: C.teal }}>{subs}</div><div style={g.statSub}>across all tiers</div></div>
      </div>

      <div style={g.twoCol}>
        <Card>
          <CardHead title="Recent sales" action={<Btn type="ghost" onClick={() => setView("products")}>View all</Btn>} />
          <div style={g.cardBody}>
            {sales.slice(0, 4).map((s, i) => (
              <div key={i} style={{ ...g.row, borderBottom: i < 3 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.product}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{s.channel} · {s.date}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.purple2 }}>{fmt$(s.units * s.price)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Quick actions" />
          <div style={{ ...g.cardBody, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["🎥 Start live session", "live", "primary"],
              ["🎁 Pick giveaway winner", "giveaways", "pink"],
              ["📦 Build a gift box", "boxes", "teal"],
              ["💰 Compare vendor prices", "vendors", "gold"],
            ].map(([label, view, type]) => (
              <Btn key={label} type={type} onClick={() => setView(view)} style={{ width: "100%", padding: "10px 14px", fontSize: 13, textAlign: "left" }}>{label}</Btn>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 4 }}>
        <CardHead title="Low stock — reorder now" />
        <div style={g.cardBody}>
          {products.filter(p => p.stock < 6).length === 0
            ? <div style={{ fontSize: 13, color: C.muted }}>All products well stocked ✓</div>
            : products.filter(p => p.stock < 6).map((p, i) => (
              <div key={i} style={{ ...g.row, borderBottom: i < products.filter(x => x.stock < 6).length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.sku}</div>
                </div>
                <Badge type={p.stock <= 2 ? "pink" : "gold"}>{p.stock} left</Badge>
                <Btn type="primary" onClick={() => setView("vendors")} style={{ padding: "4px 10px", fontSize: 11 }}>Find cheapest</Btn>
              </div>
            ))
          }
        </div>
      </Card>
    </div>
  );
}

// ── LIVE STUDIO ───────────────────────────────────────────────────────────
function LiveStudio({ products, giveaways, setGiveaways }) {
  const [lineup, setLineup] = useState(() => load("gh_lineup", []));
  const [note, setNote] = useState(() => load("gh_livenote", ""));
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [selectedGive, setSelectedGive] = useState("");

  useEffect(() => { save("gh_lineup", lineup); }, [lineup]);
  useEffect(() => { save("gh_livenote", note); }, [note]);

  function addLineup() {
    if (!newItem.trim()) return;
    setLineup(l => [...l, { id: tid(), item: newItem, price: newPrice, sold: false }]);
    setNewItem(""); setNewPrice("");
  }
  function toggleSold(id) { setLineup(l => l.map(x => x.id === id ? { ...x, sold: !x.sold } : x)); }
  function removeLineup(id) { setLineup(l => l.filter(x => x.id !== id)); }

  function spinWinner() {
    const gw = giveaways.find(g => g.id === selectedGive);
    if (!gw) return;
    setSpinning(true); setWinner("");
    const names = ["@glamqueen", "@hairbae22", "@lacefrontlover", "@wiglife", "@beautyobsessed", "@theglowup", "@crownjewel", "@silkpressonly"];
    let count = 0;
    const interval = setInterval(() => {
      setWinner(names[Math.floor(Math.random() * names.length)]);
      count++;
      if (count > 18) {
        clearInterval(interval);
        const w = names[Math.floor(Math.random() * names.length)];
        setWinner(w);
        setSpinning(false);
        setGiveaways(gs => gs.map(g => g.id === selectedGive ? { ...g, winner: w, status: "completed" } : g));
      }
    }, 100);
  }

  const activeGives = giveaways.filter(g => g.status === "active");

  return (
    <div>
      <div style={g.sTitle}>🎥 Live Studio</div>
      <div style={g.sSub}>Prep your TikTok Live session — lineup, talking points, giveaway</div>

      <div style={g.twoCol}>
        <Card>
          <CardHead title="Tonight's product lineup" action={<Badge type="purple">{lineup.filter(x => !x.sold).length} remaining</Badge>} />
          <div style={g.cardBody}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={{ ...g.fi, flex: 1 }} placeholder="Product name" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addLineup()} />
              <input style={{ ...g.fi, width: 80 }} placeholder="$price" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
              <Btn type="primary" onClick={addLineup}>+</Btn>
            </div>
            {lineup.length === 0 && <div style={{ fontSize: 12, color: C.muted, textAlign: "center", padding: "20px 0" }}>Add products to your lineup</div>}
            {lineup.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < lineup.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div onClick={() => toggleSold(item.id)} style={{ width: 16, height: 16, borderRadius: 4, border: item.sold ? "none" : `1.5px solid ${C.border}`, background: item.sold ? C.purple : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.sold && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: item.sold ? C.muted : C.text, textDecoration: item.sold ? "line-through" : "none" }}>{item.item}</div>
                {item.price && <div style={{ fontSize: 13, color: C.purple2, fontWeight: 600 }}>${item.price}</div>}
                <button onClick={() => removeLineup(item.id)} style={{ border: "none", background: "transparent", color: C.muted, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <CardHead title="Live talking points" />
            <div style={g.cardBody}>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder={"Intro: Welcome back to the stream!\n\nTonight: wig install + lash bundle deal\n\nCTA: Comment SIZE + COLOR for your wig\n\nGiveaway: ends at 1,000 likes\n\nPromo code: LIVE20 for 20% off"}
                style={{ ...g.fi, minHeight: 160, resize: "vertical", lineHeight: 1.7 }} />
            </div>
          </Card>

          <Card>
            <CardHead title="🎁 Giveaway winner picker" />
            <div style={g.cardBody}>
              {activeGives.length === 0
                ? <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>No active giveaways — create one in the Giveaways tab</div>
                : <>
                  <FG label="Select giveaway">
                    <FI value={selectedGive} onChange={e => setSelectedGive(e.target.value)}>
                      <option value="">Choose a giveaway...</option>
                      {activeGives.map(gw => <option key={gw.id} value={gw.id}>{gw.prize} ({gw.entries} entries)</option>)}
                    </FI>
                  </FG>
                  <Btn type="pink" onClick={spinWinner} style={{ width: "100%", padding: "10px", fontSize: 13, marginBottom: 12 }}>🎰 Pick winner</Btn>
                  {(spinning || winner) && (
                    <div style={{ textAlign: "center", padding: "14px", background: C.pinkL, borderRadius: 8, border: `0.5px solid ${C.pinkM}` }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{spinning ? "Picking..." : "🎉 Winner!"}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.pink, fontFamily: "'Georgia', serif" }}>{winner}</div>
                    </div>
                  )}
                </>
              }
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── CONTENT ───────────────────────────────────────────────────────────────
function Content({ content, setContent }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState({ title: "", type: "Demo", platform: "TikTok", product: "", status: "draft", date: "", notes: "" });

  function add() {
    if (!form.title.trim()) return;
    setContent(c => [{ id: tid(), views: "—", ...form, date: form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...c]);
    setForm({ title: "", type: "Demo", platform: "TikTok", product: "", status: "draft", date: "", notes: "" });
  }

  const typeColor = { Demo: "teal", Ad: "gold", Live: "pink", Tutorial: "purple" };
  const statusColor = { published: "green", running: "green", scheduled: "purple", draft: "gray" };

  const filtered = typeFilter === "all" ? content : content.filter(c => c.type === typeFilter);

  return (
    <div>
      <div style={g.sTitle}>Content Studio</div>
      <div style={g.sSub}>Organize your ads, demos, tutorials, and live replays</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "Ad", "Demo", "Live", "Tutorial"].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{ ...g.btn(typeFilter === t ? "primary" : "ghost"), borderRadius: 20, fontSize: 12 }}>{t === "all" ? "All content" : t + "s"}</button>
        ))}
      </div>

      <div style={g.statRow}>
        {[["Ads", "Ad", "gold"], ["Demos", "Demo", "teal"], ["Lives", "Live", "pink"], ["Drafts", "draft", "gray"]].map(([label, key, color]) => (
          <div key={label} style={g.stat()}>
            <div style={g.statLabel}>{label}</div>
            <div style={{ ...g.statVal, color: C[color] || C.text }}>{content.filter(c => c.type === key || c.status === key).length}</div>
          </div>
        ))}
      </div>

      <div style={g.twoCol}>
        <Card>
          <CardHead title="Content library" />
          <div style={g.cardBody}>
            {filtered.map((c, i) => (
              <div key={c.id} style={{ padding: "10px 0", borderBottom: i < filtered.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c.platform} · {c.product} · {c.date}</div>
                    {c.notes && <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic", marginTop: 2 }}>{c.notes}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <Badge type={typeColor[c.type] || "gray"}>{c.type}</Badge>
                    <Badge type={statusColor[c.status] || "gray"}>{c.status}</Badge>
                    {c.views !== "—" && <span style={{ fontSize: 10, color: C.muted }}>{c.views} views</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Add content" />
          <div style={g.cardBody}>
            <FG label="Title"><FI placeholder="Content title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></FG>
            <div style={g.fr}>
              <FG label="Type"><FI value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option>Ad</option><option>Demo</option><option>Live</option><option>Tutorial</option></FI></FG>
              <FG label="Platform"><FI value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></FI></FG>
            </div>
            <FG label="Product featured"><FI placeholder="Wig name, lash style..." value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} /></FG>
            <div style={g.fr}>
              <FG label="Status"><FI value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="running">Running</option></FI></FG>
              <FG label="Date"><FI type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></FG>
            </div>
            <FG label="Notes"><FI placeholder="ROAS, peak views, promo code..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></FG>
            <Btn type="primary" onClick={add} style={{ width: "100%" }}>Add to library</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────
function Products({ products, setProducts, sales, setSales }) {
  const [catFilter, setCatFilter] = useState("all");
  const [form, setForm] = useState({ name: "", cat: "Wigs", stock: "", price: "", sku: "" });
  const [saleForm, setSaleForm] = useState({ product: "", units: "1", price: "", channel: "TikTok Live" });

  function addProduct() {
    if (!form.name.trim()) return;
    setProducts(ps => [...ps, { id: tid(), ...form, stock: parseInt(form.stock) || 0, price: parseFloat(form.price) || 0 }]);
    setForm({ name: "", cat: "Wigs", stock: "", price: "", sku: "" });
  }
  function adjustStock(id, d) { setProducts(ps => ps.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + d) } : p)); }
  function logSale() {
    if (!saleForm.product || !saleForm.units) return;
    setSales(ss => [{ id: tid(), product: saleForm.product, units: parseInt(saleForm.units), price: parseFloat(saleForm.price) || 0, channel: saleForm.channel, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }, ...ss]);
    setProducts(ps => ps.map(p => p.name === saleForm.product ? { ...p, stock: Math.max(0, p.stock - parseInt(saleForm.units)) } : p));
    setSaleForm({ product: "", units: "1", price: "", channel: "TikTok Live" });
  }

  const cats = ["all", "Wigs", "Extensions", "Lashes", "Accessories", "Care"];
  const filtered = catFilter === "all" ? products : products.filter(p => p.cat === catFilter);

  return (
    <div>
      <div style={g.sTitle}>Products & Inventory</div>
      <div style={g.sSub}>Track stock levels, prices, and log sales</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} style={{ ...g.btn(catFilter === c ? "primary" : "ghost"), borderRadius: 20, fontSize: 12 }}>{c === "all" ? "All" : c}</button>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {filtered.map(p => {
          const low = p.stock < 5;
          return (
            <div key={p.id} style={{ background: C.bg3, border: `0.5px solid ${low ? C.pinkM : C.border}`, borderRadius: 10, padding: "13px 15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.cat} · {p.sku}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.purple2, fontSize: 16 }}>{fmt$(p.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Badge type={low ? "pink" : "green"}>{low ? `⚠ ${p.stock} left` : `${p.stock} in stock`}</Badge>
                <div style={{ display: "flex", gap: 5 }}>
                  <Btn onClick={() => adjustStock(p.id, -1)} style={{ padding: "3px 8px", fontSize: 12 }}>−</Btn>
                  <Btn onClick={() => adjustStock(p.id, 1)} style={{ padding: "3px 8px", fontSize: 12 }}>+</Btn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={g.twoCol}>
        <Card>
          <CardHead title="Add product" />
          <div style={g.cardBody}>
            <FG label="Product name"><FI placeholder="e.g. HD Lace Wig 22&quot;" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></FG>
            <div style={g.fr}>
              <FG label="Category"><FI value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}><option>Wigs</option><option>Extensions</option><option>Lashes</option><option>Accessories</option><option>Care</option></FI></FG>
              <FG label="SKU"><FI placeholder="WIG-HD-22" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} /></FG>
            </div>
            <div style={g.fr}>
              <FG label="Stock qty"><FI type="number" placeholder="10" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></FG>
              <FG label="Sale price"><FI type="number" placeholder="149" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></FG>
            </div>
            <Btn type="primary" onClick={addProduct} style={{ width: "100%" }}>Add product</Btn>
          </div>
        </Card>

        <Card>
          <CardHead title="Log a sale" />
          <div style={g.cardBody}>
            <FG label="Product"><FI value={saleForm.product} onChange={e => setSaleForm(f => ({ ...f, product: e.target.value }))}><option value="">Select product</option>{products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</FI></FG>
            <div style={g.fr}>
              <FG label="Units sold"><FI type="number" value={saleForm.units} onChange={e => setSaleForm(f => ({ ...f, units: e.target.value }))} /></FG>
              <FG label="Price per unit"><FI type="number" placeholder="149" value={saleForm.price} onChange={e => setSaleForm(f => ({ ...f, price: e.target.value }))} /></FG>
            </div>
            <FG label="Channel"><FI value={saleForm.channel} onChange={e => setSaleForm(f => ({ ...f, channel: e.target.value }))}><option>TikTok Live</option><option>Etsy</option><option>Instagram DM</option><option>Website</option><option>Wholesale</option><option>Pop-up</option></FI></FG>
            <Btn type="pink" onClick={logSale} style={{ width: "100%" }}>Log sale + deduct stock</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── VENDORS ───────────────────────────────────────────────────────────────
function Vendors({ vendors, setVendors }) {
  const [comparing, setComparing] = useState(false);
  const [compareItem, setCompareItem] = useState("");
  const [compareResults, setCompareResults] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", rating: "5" });
  const [priceForm, setPriceForm] = useState({ vendorId: "", item: "", price: "" });

  const allItems = [...new Set(vendors.flatMap(v => v.prices.map(p => p.item)))].sort();

  function compare() {
    if (!compareItem) return;
    const results = vendors
      .map(v => { const p = v.prices.find(x => x.item === compareItem); return p ? { vendor: v.name, price: p.price, contact: v.contact, rating: v.rating } : null; })
      .filter(Boolean)
      .sort((a, b) => a.price - b.price);
    setCompareResults(results);
    setComparing(true);
  }

  function addVendor() {
    if (!form.name.trim()) return;
    setVendors(vs => [...vs, { id: tid(), name: form.name, contact: form.contact, rating: parseInt(form.rating) || 5, prices: [] }]);
    setForm({ name: "", contact: "", rating: "5" });
  }

  function addPrice() {
    if (!priceForm.vendorId || !priceForm.item || !priceForm.price) return;
    setVendors(vs => vs.map(v => v.id === priceForm.vendorId ? { ...v, prices: [...v.prices.filter(p => p.item !== priceForm.item), { item: priceForm.item, price: parseFloat(priceForm.price) }] } : v));
    setPriceForm(f => ({ ...f, item: "", price: "" }));
  }

  return (
    <div>
      <div style={g.sTitle}>Vendor Price Comparison</div>
      <div style={g.sSub}>Find the cheapest source for any product with one tap</div>

      <Card style={{ marginBottom: 16, border: `0.5px solid ${C.purple}` }}>
        <div style={{ ...g.cardBody, background: C.purpleL, borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: C.purple3 }}>🔍 Compare prices across all vendors</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <FG label="Select item to compare">
                <FI value={compareItem} onChange={e => setCompareItem(e.target.value)}>
                  <option value="">Choose an item...</option>
                  {allItems.map(item => <option key={item} value={item}>{item}</option>)}
                </FI>
              </FG>
            </div>
            <Btn type="primary" onClick={compare} style={{ padding: "8px 20px", marginBottom: 10 }}>Compare now →</Btn>
          </div>

          {comparing && compareResults.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Results for: <strong style={{ color: C.purple3 }}>{compareItem}</strong></div>
              {compareResults.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: i === 0 ? C.bg3 : C.bg2, borderRadius: 8, marginBottom: 6, border: i === 0 ? `1px solid ${C.purple}` : `0.5px solid ${C.border}` }}>
                  {i === 0 && <span style={{ fontSize: 16 }}>🏆</span>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.purple3 : C.text }}>{r.vendor}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{r.contact} · {"★".repeat(r.rating)}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? C.purple2 : C.muted }}>{fmt$(r.price)}</div>
                  {i === 0 && <Badge type="purple">Cheapest</Badge>}
                  {i > 0 && <span style={{ fontSize: 11, color: C.pink }}>+{fmt$(r.price - compareResults[0].price)}</span>}
                </div>
              ))}
              {compareResults.length === 0 && <div style={{ fontSize: 12, color: C.muted }}>No vendors carry this item yet.</div>}
            </div>
          )}
        </div>
      </Card>

      <div style={g.twoCol}>
        <Card>
          <CardHead title="Vendor roster" />
          <div style={g.cardBody}>
            {vendors.map((v, i) => (
              <div key={v.id} style={{ padding: "10px 0", borderBottom: i < vendors.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{v.contact}</div>
                    <div style={{ fontSize: 11, color: C.gold, marginTop: 2 }}>{"★".repeat(v.rating)}{"☆".repeat(5 - v.rating)}</div>
                  </div>
                  <Badge type="gray">{v.prices.length} items</Badge>
                </div>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {v.prices.slice(0, 3).map((p, j) => <span key={j} style={{ fontSize: 10, background: C.bg4, color: C.muted, padding: "2px 6px", borderRadius: 4 }}>{p.item}: {fmt$(p.price)}</span>)}
                  {v.prices.length > 3 && <span style={{ fontSize: 10, color: C.muted }}>+{v.prices.length - 3} more</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <CardHead title="Add vendor" />
            <div style={g.cardBody}>
              <FG label="Vendor name"><FI placeholder="BellaHair Wholesale" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></FG>
              <FG label="Contact / website"><FI placeholder="email or URL" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></FG>
              <FG label="Rating"><FI value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}><option value="5">★★★★★ Excellent</option><option value="4">★★★★☆ Good</option><option value="3">★★★☆☆ Average</option><option value="2">★★☆☆☆ Poor</option></FI></FG>
              <Btn type="primary" onClick={addVendor} style={{ width: "100%" }}>Add vendor</Btn>
            </div>
          </Card>

          <Card>
            <CardHead title="Add item price to vendor" />
            <div style={g.cardBody}>
              <FG label="Vendor"><FI value={priceForm.vendorId} onChange={e => setPriceForm(f => ({ ...f, vendorId: e.target.value }))}><option value="">Select vendor</option>{vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</FI></FG>
              <FG label="Item name"><FI placeholder="Lace Front Wig 20&quot;" value={priceForm.item} onChange={e => setPriceForm(f => ({ ...f, item: e.target.value }))} /></FG>
              <FG label="Their price"><FI type="number" placeholder="62.00" step="0.01" value={priceForm.price} onChange={e => setPriceForm(f => ({ ...f, price: e.target.value }))} /></FG>
              <Btn type="gold" onClick={addPrice} style={{ width: "100%" }}>Save price</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── GIVEAWAYS ─────────────────────────────────────────────────────────────
function Giveaways({ giveaways, setGiveaways }) {
  const [form, setForm] = useState({ prize: "", value: "", platform: "TikTok", entries: "", method: "Comment to enter", date: "" });

  function add() {
    if (!form.prize.trim()) return;
    setGiveaways(gs => [{ id: tid(), ...form, value: parseFloat(form.value) || 0, entries: parseInt(form.entries) || 0, status: "active", winner: "", date: form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...gs]);
    setForm({ prize: "", value: "", platform: "TikTok", entries: "", method: "Comment to enter", date: "" });
  }
  function close(id) { setGiveaways(gs => gs.map(g => g.id === id ? { ...g, status: "completed" } : g)); }
  function addEntry(id, n) { setGiveaways(gs => gs.map(g => g.id === id ? { ...g, entries: Math.max(0, g.entries + n) } : g)); }

  return (
    <div>
      <div style={g.sTitle}>Giveaways</div>
      <div style={g.sSub}>Track entries, pick winners, manage fulfillment</div>

      <div style={g.statRow}>
        <div style={g.stat()}><div style={g.statLabel}>Active</div><div style={{ ...g.statVal, color: C.pink }}>{giveaways.filter(g => g.status === "active").length}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Total entries</div><div style={{ ...g.statVal, color: C.purple2 }}>{giveaways.filter(g => g.status === "active").reduce((a, g) => a + g.entries, 0).toLocaleString()}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Completed</div><div style={{ ...g.statVal }}>{giveaways.filter(g => g.status === "completed").length}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Prize value given</div><div style={{ ...g.statVal, color: C.gold }}>{fmt$(giveaways.filter(g => g.status === "completed").reduce((a, g) => a + g.value, 0))}</div></div>
      </div>

      <div style={g.twoCol}>
        <div>
          {giveaways.map((gw, i) => (
            <Card key={gw.id} style={{ border: `0.5px solid ${gw.status === "active" ? C.pink : C.border}` }}>
              <div style={g.cardBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{gw.prize}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{gw.platform} · {gw.date} · {gw.method}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Badge type={gw.status === "active" ? "pink" : "gray"}>{gw.status}</Badge>
                    <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{fmt$(gw.value)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `0.5px solid ${C.border}`, borderBottom: `0.5px solid ${C.border}`, marginBottom: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: C.purple2 }}>{gw.entries.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>entries</span>
                  {gw.status === "active" && <>
                    <Btn onClick={() => addEntry(gw.id, 1)} style={{ padding: "3px 8px", fontSize: 11, marginLeft: "auto" }}>+1</Btn>
                    <Btn onClick={() => addEntry(gw.id, 10)} style={{ padding: "3px 8px", fontSize: 11 }}>+10</Btn>
                    <Btn onClick={() => addEntry(gw.id, 100)} style={{ padding: "3px 8px", fontSize: 11 }}>+100</Btn>
                  </>}
                </div>
                {gw.winner && <div style={{ fontSize: 13, color: C.pink, fontWeight: 600, marginBottom: 8 }}>🎉 Winner: {gw.winner}</div>}
                {gw.status === "active" && <Btn type="ghost" onClick={() => close(gw.id)} style={{ width: "100%", color: C.muted }}>Mark as completed</Btn>}
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHead title="Create giveaway" />
          <div style={g.cardBody}>
            <FG label="Prize"><FI placeholder="HD Closure Wig 18&quot;" value={form.prize} onChange={e => setForm(f => ({ ...f, prize: e.target.value }))} /></FG>
            <div style={g.fr}>
              <FG label="Prize value"><FI type="number" placeholder="189" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} /></FG>
              <FG label="Platform"><FI value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}><option>TikTok</option><option>Instagram</option><option>YouTube</option><option>Facebook</option></FI></FG>
            </div>
            <FG label="Entry method"><FI value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}><option>Comment to enter</option><option>Follow + tag a friend</option><option>Live viewer only</option><option>Purchase entry</option><option>Share to enter</option></FI></FG>
            <div style={g.fr}>
              <FG label="Starting entries"><FI type="number" placeholder="0" value={form.entries} onChange={e => setForm(f => ({ ...f, entries: e.target.value }))} /></FG>
              <FG label="Date"><FI type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></FG>
            </div>
            <Btn type="pink" onClick={add} style={{ width: "100%" }}>Launch giveaway 🎁</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── GIFT BOXES ────────────────────────────────────────────────────────────
function GiftBoxes({ boxes, setBoxes, products }) {
  const [selected, setSelected] = useState(null);
  const [addingItem, setAddingItem] = useState("");
  const [addingQty, setAddingQty] = useState("1");
  const [form, setForm] = useState({ name: "", tier: "Basic", price: "" });

  function createBox() {
    if (!form.name.trim()) return;
    const newBox = { id: tid(), name: form.name, tier: form.tier, price: parseFloat(form.price) || 0, items: [], active: true, subscribers: 0 };
    setBoxes(bs => [...bs, newBox]);
    setSelected(newBox.id);
    setForm({ name: "", tier: "Basic", price: "" });
  }

  function addItem() {
    if (!addingItem || !selected) return;
    setBoxes(bs => bs.map(b => b.id === selected ? { ...b, items: [...b.items.filter(i => i.name !== addingItem), { name: addingItem, qty: parseInt(addingQty) || 1 }] } : b));
    setAddingItem(""); setAddingQty("1");
  }

  function removeItem(boxId, itemName) { setBoxes(bs => bs.map(b => b.id === boxId ? { ...b, items: b.items.filter(i => i.name !== itemName) } : b)); }
  function toggleActive(id) { setBoxes(bs => bs.map(b => b.id === id ? { ...b, active: !b.active } : b)); }
  function addSub(id, n) { setBoxes(bs => bs.map(b => b.id === id ? { ...b, subscribers: Math.max(0, b.subscribers + n) } : b)); }

  const tierColor = { Basic: "teal", Premium: "purple", Elite: "gold" };
  const activeBox = boxes.find(b => b.id === selected);

  return (
    <div>
      <div style={g.sTitle}>Gift Box Builder</div>
      <div style={g.sSub}>Build and manage your subscription box tiers</div>

      <div style={g.statRow}>
        <div style={g.stat()}><div style={g.statLabel}>Box tiers</div><div style={{ ...g.statVal, color: C.teal }}>{boxes.length}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Total subscribers</div><div style={{ ...g.statVal, color: C.purple2 }}>{boxes.reduce((a, b) => a + b.subscribers, 0)}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Monthly revenue</div><div style={{ ...g.statVal, color: C.gold }}>{fmt$(boxes.filter(b => b.active).reduce((a, b) => a + b.price * b.subscribers, 0))}</div></div>
        <div style={g.stat()}><div style={g.statLabel}>Active boxes</div><div style={{ ...g.statVal, color: C.green }}>{boxes.filter(b => b.active).length}</div></div>
      </div>

      <div style={g.twoCol}>
        <div>
          {boxes.map(box => (
            <Card key={box.id} style={{ border: `0.5px solid ${selected === box.id ? C.purple : C.border}`, cursor: "pointer" }} >
              <div style={{ ...g.cardBody }} onClick={() => setSelected(box.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{box.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{box.subscribers} subscribers · {fmt$(box.price)}/mo</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <Badge type={tierColor[box.tier] || "gray"}>{box.tier}</Badge>
                    <Badge type={box.active ? "green" : "gray"}>{box.active ? "Active" : "Paused"}</Badge>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {box.items.map((item, i) => (
                    <span key={i} style={{ fontSize: 11, background: C.bg4, color: C.text, padding: "3px 8px", borderRadius: 6 }}>
                      {item.name} ×{item.qty}
                    </span>
                  ))}
                  {box.items.length === 0 && <span style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>No items yet — click to build</span>}
                </div>
                <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <Btn onClick={() => addSub(box.id, 1)} style={{ padding: "3px 8px", fontSize: 11 }}>+1 sub</Btn>
                  <Btn onClick={() => addSub(box.id, -1)} style={{ padding: "3px 8px", fontSize: 11 }}>-1 sub</Btn>
                  <Btn type={box.active ? "ghost" : "primary"} onClick={() => toggleActive(box.id)} style={{ padding: "3px 8px", fontSize: 11, marginLeft: "auto" }}>{box.active ? "Pause" : "Activate"}</Btn>
                </div>
              </div>
            </Card>
          ))}

          <Card>
            <CardHead title="Create new box" />
            <div style={g.cardBody}>
              <FG label="Box name"><FI placeholder="Glam Starter Box" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></FG>
              <div style={g.fr}>
                <FG label="Tier"><FI value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}><option>Basic</option><option>Premium</option><option>Elite</option></FI></FG>
                <FG label="Monthly price"><FI type="number" placeholder="49" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></FG>
              </div>
              <Btn type="teal" onClick={createBox} style={{ width: "100%" }}>Create box →</Btn>
            </div>
          </Card>
        </div>

        <Card>
          <CardHead title={activeBox ? `Building: ${activeBox.name}` : "Select a box to build"} />
          <div style={g.cardBody}>
            {!activeBox
              ? <div style={{ fontSize: 12, color: C.muted, textAlign: "center", padding: "30px 0" }}>Click any box on the left to start adding items</div>
              : <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Box contents</div>
                  {activeBox.items.length === 0 && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 10 }}>Empty — add items below</div>}
                  {activeBox.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.bg4, borderRadius: 7, marginBottom: 5 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>Qty: {item.qty}</div>
                      </div>
                      <button onClick={() => removeItem(activeBox.id, item.name)} style={{ border: "none", background: "transparent", color: C.muted, cursor: "pointer", fontSize: 16 }}>×</button>
                    </div>
                  ))}
                </div>

                <div style={{ ...g.divider }} />

                <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Add item to box</div>
                <FG label="Product">
                  <FI value={addingItem} onChange={e => setAddingItem(e.target.value)}>
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </FI>
                </FG>
                <FG label="Quantity"><FI type="number" placeholder="1" value={addingQty} onChange={e => setAddingQty(e.target.value)} /></FG>
                <Btn type="teal" onClick={addItem} style={{ width: "100%", marginBottom: 16 }}>+ Add to box</Btn>

                <div style={{ ...g.divider }} />
                <div style={{ padding: "10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                    <span>Items in box</span><span>{activeBox.items.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 4 }}>
                    <span>Monthly price</span><span style={{ color: C.gold, fontWeight: 600 }}>{fmt$(activeBox.price)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted }}>
                    <span>Monthly revenue</span><span style={{ color: C.purple2, fontWeight: 600 }}>{fmt$(activeBox.price * activeBox.subscribers)}</span>
                  </div>
                </div>
              </>
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
const VIEWS = ["dashboard", "live", "content", "products", "vendors", "giveaways", "boxes"];
const VIEW_LABELS = { dashboard: "Dashboard", live: "Live Studio", content: "Content", products: "Products", vendors: "Vendors", giveaways: "Giveaways", boxes: "Gift Boxes" };
const VIEW_ICONS = { dashboard: "✦", live: "🎥", content: "📱", products: "👜", vendors: "💰", giveaways: "🎁", boxes: "📦" };

export default function App() {
  const [view, setView] = useState("dashboard");
  const [products, setProducts] = useState(() => load("gh_products", INIT_PRODUCTS));
  const [vendors, setVendors] = useState(() => load("gh_vendors", INIT_VENDORS));
  const [content, setContent] = useState(() => load("gh_content", INIT_CONTENT));
  const [giveaways, setGiveaways] = useState(() => load("gh_giveaways", INIT_GIVEAWAYS));
  const [boxes, setBoxes] = useState(() => load("gh_boxes", INIT_BOXES));
  const [sales, setSales] = useState(() => load("gh_sales", INIT_SALES));

  useEffect(() => { save("gh_products", products); }, [products]);
  useEffect(() => { save("gh_vendors", vendors); }, [vendors]);
  useEffect(() => { save("gh_content", content); }, [content]);
  useEffect(() => { save("gh_giveaways", giveaways); }, [giveaways]);
  useEffect(() => { save("gh_boxes", boxes); }, [boxes]);
  useEffect(() => { save("gh_sales", sales); }, [sales]);

  return (
    <div style={g.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={g.header}>
        <div style={g.logo}>GLAMHUB</div>
        <div style={{ fontSize: 11, color: C.muted }}>Beauty business command center</div>
      </div>
      <div style={g.nav}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => setView(v)} style={g.tab(view === v)}>
            {VIEW_ICONS[v]} {VIEW_LABELS[v]}
          </button>
        ))}
      </div>
      <div style={g.body}>
        {view === "dashboard"  && <Dashboard products={products} giveaways={giveaways} sales={sales} boxes={boxes} setView={setView} />}
        {view === "live"       && <LiveStudio products={products} giveaways={giveaways} setGiveaways={setGiveaways} />}
        {view === "content"    && <Content content={content} setContent={setContent} />}
        {view === "products"   && <Products products={products} setProducts={setProducts} sales={sales} setSales={setSales} />}
        {view === "vendors"    && <Vendors vendors={vendors} setVendors={setVendors} />}
        {view === "giveaways"  && <Giveaways giveaways={giveaways} setGiveaways={setGiveaways} />}
        {view === "boxes"      && <GiftBoxes boxes={boxes} setBoxes={setBoxes} products={products} />}
      </div>
    </div>
  );
}
