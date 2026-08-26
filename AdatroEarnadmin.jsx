import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Megaphone, DollarSign, Landmark, Users, ScrollText,
  Search, ChevronDown, Play, Pause, MoreHorizontal, Check, X,
  ShieldAlert, TrendingUp, TrendingDown, ArrowUpRight, Menu
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

/* ---------------------------------------------------------
  ADATRO EARN — Admin Dashboard prototype
  Mock data only. Illustrates layout, flows, and permission
  gating described in the backend spec — not wired to a real API.
--------------------------------------------------------- */

const INK = "#0B0F17";
const PANEL = "#111725";
const PANEL_2 = "#161D2E";
const BORDER = "#1F2A3D";
const TEXT_DIM = "#7C89A3";
const TEXT = "#E7ECF5";
const ACCENT = "#2DD8A7";
const ACCENT_DIM = "#1B8F6C";
const AMBER = "#F5B84E";
const RED = "#FF6B6B";
const BLUE = "#7AA7FF";

const currency = (cents) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const CURRENT_ADMIN = { name: "Ada Okoye", role: "finance" };

const PERMISSIONS = {
  super_admin: ["campaigns", "reward_settings", "withdrawals", "ledger", "admins"],
  finance: ["reward_settings", "withdrawals", "ledger"],
  campaign_manager: ["campaigns"],
  support: ["users"],
  read_only: [],
};

function can(action) {
  return PERMISSIONS[CURRENT_ADMIN.role]?.includes(action);
}

/* ---------------------------- Mock data ---------------------------- */

const REVENUE_SERIES = [
  { day: "Aug 18", advertiser: 412, userReward: 247, platform: 124 },
  { day: "Aug 19", advertiser: 388, userReward: 233, platform: 116 },
  { day: "Aug 20", advertiser: 501, userReward: 301, platform: 150 },
  { day: "Aug 21", advertiser: 476, userReward: 286, platform: 143 },
  { day: "Aug 22", advertiser: 559, userReward: 335, platform: 168 },
  { day: "Aug 23", advertiser: 602, userReward: 361, platform: 181 },
  { day: "Aug 24", advertiser: 583, userReward: 350, platform: 175 },
];

const LEDGER_SPLIT = [
  { name: "User rewards", value: 60, color: ACCENT },
  { name: "Platform revenue", value: 30, color: BLUE },
  { name: "Reserve", value: 10, color: AMBER },
];

const CAMPAIGNS = [
  { id: "c1", title: "Brand Presentation — FinTrust App", sponsor: "FinTrust", provider: "VidRewards", country: "NG, GH, KE", budget: 500000, remaining: 218000, reward: 18, completions: 1211, status: "active" },
  { id: "c2", title: "New Product Launch Teaser", sponsor: "Novaline", provider: "AdVantage", country: "NG, GH, KE, ZA", budget: 800000, remaining: 502000, reward: 42, completions: 709, status: "active" },
  { id: "c3", title: "Try Horizon Budgeting App", sponsor: "Horizon", provider: "Direct", country: "NG, GH", budget: 300000, remaining: 12000, reward: 95, completions: 303, status: "active" },
  { id: "c4", title: "Streamly Weekend Promo", sponsor: "Streamly", provider: "VAST Exchange", country: "NG", budget: 150000, remaining: 0, reward: 25, completions: 600, status: "completed" },
  { id: "c5", title: "Q3 Awareness — MicroLoan", sponsor: "QuickCredit", provider: "VidRewards", country: "GH, KE", budget: 400000, remaining: 400000, reward: 30, completions: 0, status: "paused" },
];

const WITHDRAWALS = [
  { id: "w1", user: "Amara O.", amount: 5000, method: "Bank Transfer — GTBank", country: "NG", requested: "2h ago", flagged: false },
  { id: "w2", user: "Kwame A.", amount: 12000, method: "Mobile Money — MTN", country: "GH", requested: "4h ago", flagged: true, reason: "Payment profile shared with 2 other accounts" },
  { id: "w3", user: "Fatima N.", amount: 5000, method: "Bank Transfer — Equity", country: "KE", requested: "6h ago", flagged: false },
  { id: "w4", user: "Chidi E.", amount: 8200, method: "Bank Transfer — Access", country: "NG", requested: "1d ago", flagged: false },
];

const AUDIT_LOG = [
  { id: "a1", admin: "Ada Okoye", action: "withdrawal.approve", target: "w0912 — $50.00", time: "10:41 AM" },
  { id: "a2", admin: "Tunde B.", action: "campaign.pause", target: "Q3 Awareness — MicroLoan", time: "09:58 AM" },
  { id: "a3", admin: "Ada Okoye", action: "reward_settings.update", target: "user_reward_percentage 55 → 60", time: "Yesterday" },
  { id: "a4", admin: "Grace M.", action: "user.suspend", target: "user_id 88f2…", time: "Yesterday" },
  { id: "a5", admin: "Tunde B.", action: "campaign.create", target: "Streamly Weekend Promo", time: "2 days ago" },
];

const REFERRAL_STATS = { totalReferrals: 4820, eligible: 3110, flagged: 214, avgPerUser: 3.4 };

/* ---------------------------- Shared bits ---------------------------- */

function KpiCard({ label, value, delta, deltaPositive = true, icon: Icon }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px]" style={{ color: TEXT_DIM }}>{label}</span>
        {Icon && <Icon size={15} color={TEXT_DIM} />}
      </div>
      <p className="text-[22px] font-semibold tabular-nums" style={{ color: TEXT }}>{value}</p>
      {delta && (
        <div className="flex items-center gap-1 mt-1">
          {deltaPositive ? <TrendingUp size={12} color={ACCENT} /> : <TrendingDown size={12} color={RED} />}
          <span className="text-[11.5px]" style={{ color: deltaPositive ? ACCENT : RED }}>{delta}</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { bg: "rgba(45,216,167,0.15)", fg: ACCENT },
    paused: { bg: "rgba(245,184,78,0.15)", fg: AMBER },
    completed: { bg: "rgba(122,167,255,0.15)", fg: BLUE },
    flagged: { bg: "rgba(255,107,107,0.15)", fg: RED },
  };
  const s = map[status] || map.active;
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

function LockedPanel({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: PANEL_2 }}>
        <ShieldAlert size={18} color={TEXT_DIM} />
      </div>
      <p className="text-[14px] font-medium" style={{ color: TEXT }}>Restricted</p>
      <p className="text-[12.5px] mt-1" style={{ color: TEXT_DIM }}>
        Your role ({CURRENT_ADMIN.role}) doesn't have access to {label}.
      </p>
    </div>
  );
}

/* ---------------------------- Sections ---------------------------- */

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Advertiser Revenue (7d)" value="$3,521" delta="+8.2% vs prior week" icon={DollarSign} />
        <KpiCard label="User Rewards Paid" value="$2,113" delta="+7.6%" icon={ArrowUpRight} />
        <KpiCard label="Active Users (24h)" value="18,204" delta="+3.1%" icon={Users} />
        <KpiCard label="Pending Withdrawals" value="$282,400" delta="12 flagged" deltaPositive={false} icon={Landmark} />
      </div>

      <div className="rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13.5px] font-medium" style={{ color: TEXT }}>Revenue vs. reward payout</p>
          <span className="text-[11.5px]" style={{ color: TEXT_DIM }}>Last 7 days · USD</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={REVENUE_SERIES}>
            <defs>
              <linearGradient id="adv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity={0.35} />
                <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={BORDER} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: TEXT_DIM, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
            <YAxis tick={{ fill: TEXT_DIM, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: PANEL_2, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              formatter={(v) => `$${v}`}
            />
            <Area type="monotone" dataKey="advertiser" stroke={BLUE} fill="url(#adv)" strokeWidth={2} name="Advertiser revenue" />
            <Area type="monotone" dataKey="userReward" stroke={ACCENT} fill="url(#rew)" strokeWidth={2} name="User rewards" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 lg:col-span-2" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
          <p className="text-[13.5px] font-medium mb-4" style={{ color: TEXT }}>Recent admin activity</p>
          <div className="space-y-3">
            {AUDIT_LOG.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-[12.5px]">
                <div>
                  <span style={{ color: TEXT }}>{a.admin}</span>
                  <span style={{ color: TEXT_DIM }}> · {a.action}</span>
                </div>
                <span style={{ color: TEXT_DIM }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
          <p className="text-[13.5px] font-medium mb-4" style={{ color: TEXT }}>Reward allocation split</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={LEDGER_SPLIT} dataKey="value" innerRadius={40} outerRadius={60} paddingAngle={3}>
                {LEDGER_SPLIT.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {LEDGER_SPLIT.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-[11.5px]">
                <span className="flex items-center gap-1.5" style={{ color: TEXT_DIM }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: e.color }} />
                  {e.name}
                </span>
                <span style={{ color: TEXT }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsSection() {
  const [query, setQuery] = useState("");
  const filtered = CAMPAIGNS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  if (!can("campaigns")) return <LockedPanel label="Campaign Manager" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} color={TEXT_DIM} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full pl-9 pr-3 py-2 rounded-xl text-[13px] outline-none"
            style={{ background: PANEL_2, border: `1px solid ${BORDER}`, color: TEXT }}
          />
        </div>
        <button
          className="px-4 py-2 rounded-xl text-[13px] font-medium"
          style={{ background: ACCENT, color: INK }}
        >
          + New Campaign
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["Campaign", "Provider", "Countries", "Budget remaining", "Reward", "Completions", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: TEXT_DIM }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const pct = (c.remaining / c.budget) * 100;
              return (
                <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td className="px-4 py-3">
                    <p style={{ color: TEXT }} className="font-medium">{c.title}</p>
                    <p style={{ color: TEXT_DIM }} className="text-[11.5px]">{c.sponsor}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: TEXT_DIM }}>{c.provider}</td>
                  <td className="px-4 py-3" style={{ color: TEXT_DIM }}>{c.country}</td>
                  <td className="px-4 py-3" style={{ color: TEXT }}>
                    <div className="w-24 h-1.5 rounded-full mb-1" style={{ background: "#1E2A3E" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct < 15 ? RED : ACCENT }} />
                    </div>
                    {currency(c.remaining)} / {currency(c.budget)}
                  </td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: ACCENT }}>{currency(c.reward)}</td>
                  <td className="px-4 py-3 tabular-nums" style={{ color: TEXT }}>{c.completions.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <button style={{ color: TEXT_DIM }}>
                      {c.status === "active" ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WithdrawalsSection() {
  const [items, setItems] = useState(WITHDRAWALS);

  if (!can("withdrawals")) return <LockedPanel label="Withdrawal approvals" />;

  const resolve = (id, action) => setItems((prev) => prev.filter((w) => w.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] font-medium" style={{ color: TEXT }}>Pending withdrawals</p>
        <span className="text-[12px]" style={{ color: TEXT_DIM }}>{items.length} awaiting review</span>
      </div>
      {items.length === 0 && (
        <div className="rounded-2xl p-8 text-center" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
          <p className="text-[13px]" style={{ color: TEXT_DIM }}>Queue is clear.</p>
        </div>
      )}
      {items.map((w) => (
        <div key={w.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: PANEL, border: `1px solid ${w.flagged ? "rgba(255,107,107,0.4)" : BORDER}` }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13.5px] font-medium" style={{ color: TEXT }}>{w.user}</p>
              {w.flagged && <StatusBadge status="flagged" />}
            </div>
            <p className="text-[12px] mt-0.5" style={{ color: TEXT_DIM }}>{w.method} · {w.country} · {w.requested}</p>
            {w.flagged && (
              <p className="text-[11.5px] mt-1 flex items-center gap-1" style={{ color: RED }}>
                <ShieldAlert size={12} /> {w.reason}
              </p>
            )}
          </div>
          <p className="text-[15px] font-semibold tabular-nums" style={{ color: TEXT }}>{currency(w.amount)}</p>
          <div className="flex gap-2">
            <button onClick={() => resolve(w.id, "reject")} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,107,107,0.12)", color: RED }}>
              <X size={15} />
            </button>
            <button onClick={() => resolve(w.id, "approve")} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(45,216,167,0.12)", color: ACCENT }}>
              <Check size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueSection() {
  if (!can("ledger")) return <LockedPanel label="Revenue ledger" />;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total funded (all-time)" value="$142,880" icon={DollarSign} />
        <KpiCard label="Total liability (pending+available)" value="$38,204" icon={Landmark} />
        <KpiCard label="Platform revenue (30d)" value="$5,112" delta="+4.4%" icon={TrendingUp} />
        <KpiCard label="Reversals (30d)" value="$612" delta="-1.1%" deltaPositive={false} icon={TrendingDown} />
      </div>
      <div className="rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        <p className="text-[13.5px] font-medium mb-4" style={{ color: TEXT }}>Platform revenue by day</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_SERIES}>
            <CartesianGrid stroke={BORDER} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: TEXT_DIM, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
            <YAxis tick={{ fill: TEXT_DIM, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={{ background: PANEL_2, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12 }} formatter={(v) => `$${v}`} />
            <Bar dataKey="platform" fill={BLUE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: TEXT_DIM }}>
        Liability must never exceed funded reserves — the release-to-available check in the reward engine
        enforces this automatically; this view is for monitoring, not the enforcement point itself.
      </p>
    </div>
  );
}

function ReferralsSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total referrals" value={REFERRAL_STATS.totalReferrals.toLocaleString()} icon={Users} />
        <KpiCard label="Eligible referrals" value={REFERRAL_STATS.eligible.toLocaleString()} icon={Check} />
        <KpiCard label="Flagged (dedup/fraud)" value={REFERRAL_STATS.flagged} deltaPositive={false} icon={ShieldAlert} />
        <KpiCard label="Avg. referrals / user" value={REFERRAL_STATS.avgPerUser} icon={TrendingUp} />
      </div>
      <div className="rounded-2xl p-5" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        <p className="text-[13.5px] font-medium mb-2" style={{ color: TEXT }}>Eligibility funnel</p>
        <div className="space-y-2.5 mt-3">
          {[
            { label: "Referred account created", pct: 100 },
            { label: "Account age ≥ 48h", pct: 81 },
            { label: "≥1 verified completion", pct: 68 },
            { label: "Passed dedup checks", pct: 64.5 },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-[12px] mb-1">
                <span style={{ color: TEXT_DIM }}>{row.label}</span>
                <span style={{ color: TEXT }}>{row.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: "#1E2A3E" }}>
         
