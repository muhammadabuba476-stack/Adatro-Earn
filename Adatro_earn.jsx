import React, { useState, useEffect, useMemo } from "react";
import {
  Home, PlayCircle, Users, Wallet, User, ChevronRight, Gift,
  CheckCircle2, Clock, ArrowUpRight, ArrowDownLeft, Copy, X,
  MessageCircle, Send, Instagram, ShieldCheck, TrendingUp
} from "lucide-react";

/* ---------------------------------------------------------
  ADATRO EARN — V1 front-end prototype
  Mock data only. No real campaigns, no real money.
  Every number below is illustrative and must be replaced by
  live values from the reward engine / ledger in production.
--------------------------------------------------------- */

const ACCENT = "#2DD8A7";      // verified / earnings
const ACCENT_DIM = "#1B8F6C";
const AMBER = "#F5B84E";       // bonus / streak
const INK = "#0B1220";         // base background
const INK_2 = "#111C2E";       // card surface
const INK_3 = "#182437";       // raised surface

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MOCK_USER = {
  firstName: "Amara",
  referralCode: "ADATRO-X7K92",
  country: "Nigeria",
};

const MOCK_CAMPAIGNS = [
  {
    id: "c1",
    category: "Videos",
    title: "Brand Presentation — FinTrust App",
    sponsor: "FinTrust",
    duration: 92,
    reward: 0.18,
    countries: ["NG", "GH", "KE"],
    requirement: "Watch full video without skipping",
  },
  {
    id: "c2",
    category: "Videos",
    title: "New Product Launch Teaser",
    sponsor: "Novaline",
    duration: 225,
    reward: 0.42,
    countries: ["NG", "GH", "KE", "ZA"],
    requirement: "Watch full video, verified by provider",
  },
  {
    id: "c3",
    category: "Apps",
    title: "Try Horizon Budgeting App",
    sponsor: "Horizon",
    duration: 500,
    reward: 0.95,
    countries: ["NG", "GH"],
    requirement: "Install and reach level 2",
  },
];

const MOCK_TRANSACTIONS = [
  { id: "t1", amount: 0.18, type: "Sponsored Video", date: "2026-08-24", status: "AVAILABLE" },
  { id: "t2", amount: 0.42, type: "Sponsored Video", date: "2026-08-23", status: "AVAILABLE" },
  { id: "t3", amount: 0.5, type: "Referral Reward", date: "2026-08-22", status: "AVAILABLE" },
  { id: "t4", amount: 0.1, type: "Daily Bonus", date: "2026-08-22", status: "AVAILABLE" },
  { id: "t5", amount: 0.32, type: "Sponsored Video", date: "2026-08-21", status: "PENDING" },
];

function fmtDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function StatusPill({ status }) {
  const map = {
    AVAILABLE: { bg: "rgba(45,216,167,0.15)", fg: ACCENT, label: "Available" },
    PENDING: { bg: "rgba(245,184,78,0.15)", fg: AMBER, label: "Pending" },
    VERIFIED: { bg: "rgba(122,167,255,0.15)", fg: "#7AA7FF", label: "Verified" },
    REVERSED: { bg: "rgba(255,107,107,0.15)", fg: "#FF6B6B", label: "Reversed" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

function ProgressBar({ pct, color = ACCENT, track = "#1E2A3E" }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: track }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, pct)}%`, background: color }}
      />
    </div>
  );
}

/* ---------------------------- Screens ---------------------------- */

function HomeScreen({ wallet, referrals, referralGoal, onNav }) {
  const withdrawGoal = 50;
  const pct = Math.min(100, (wallet.available / withdrawGoal) * 100);

  return (
    <div className="px-5 pt-6 pb-4 space-y-6">
      <div>
        <p className="text-[13px] tracking-wide" style={{ color: "#7C8AA3" }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-semibold text-white">{MOCK_USER.firstName} 👋</h1>
      </div>

      <div
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${INK_3}, ${INK_2})`, border: "1px solid #1E2A3E" }}
      >
        <div className="flex items-center gap-1.5 mb-4">
          <ShieldCheck size={14} color={ACCENT} />
          <span className="text-[11px] font-medium" style={{ color: "#7C8AA3" }}>
            Verified balance
          </span>
        </div>
        <p className="text-[13px]" style={{ color: "#7C8AA3" }}>Available Balance</p>
        <p className="text-4xl font-semibold text-white tabular-nums mt-1">
          {currency(wallet.available)}
        </p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-[12px]" style={{ color: "#7C8AA3" }}>Pending</p>
            <p className="text-[15px] font-medium text-white tabular-nums">{currency(wallet.pending)}</p>
          </div>
          <div>
            <p className="text-[12px]" style={{ color: "#7C8AA3" }}>Total Earned</p>
            <p className="text-[15px] font-medium text-white tabular-nums">{currency(wallet.totalEarned)}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-[12px] mb-1.5">
            <span style={{ color: "#7C8AA3" }}>Withdrawal progress</span>
            <span style={{ color: ACCENT }}>{pct.toFixed(0)}%</span>
          </div>
          <ProgressBar pct={pct} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction icon={<PlayCircle size={20} />} label="Watch & Earn" onClick={() => onNav("earn")} />
        <QuickAction icon={<Gift size={20} />} label="Daily Bonus" onClick={() => onNav("bonus")} accent={AMBER} />
        <QuickAction icon={<Users size={20} />} label="Refer Friends" onClick={() => onNav("refer")} />
        <QuickAction icon={<Wallet size={20} />} label="Withdraw" onClick={() => onNav("withdraw")} />
      </div>

      <div
        className="rounded-2xl p-4 text-[12.5px] leading-relaxed"
        style={{ background: INK_2, color: "#8B98B0", border: "1px solid #1E2A3E" }}
      >
        Rewards come from real, funded campaigns only. Amounts vary by campaign, country and advertiser demand — nothing here is guaranteed income.
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, accent = ACCENT }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl p-4 flex flex-col items-start gap-3 active:scale-[0.98] transition-transform text-left"
      style={{ background: INK_2, border: "1px solid #1E2A3E" }}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </span>
      <span className="text-[13.5px] font-medium text-white">{label}</span>
    </button>
  );
}

function EarnScreen({ campaigns, onOpenCampaign, completedIds }) {
  const categories = ["All", "Videos", "Games", "Apps", "Surveys", "Sponsored Tasks"];
  const [active, setActive] = useState("All");
  const filtered = campaigns.filter((c) => active === "All" || c.category === active);

  return (
    <div className="pt-6 pb-4">
      <div className="px-5">
        <h1 className="text-xl font-semibold text-white mb-1">Available Campaigns</h1>
        <p className="text-[13px] mb-4" style={{ color: "#7C8AA3" }}>
          Verified campaigns available in {MOCK_USER.country}
        </p>
      </div>

      <div className="flex gap-2 px-5 overflow-x-auto pb-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors"
            style={{
              background: active === cat ? ACCENT : INK_2,
              color: active === cat ? INK : "#B7C1D6",
              border: `1px solid ${active === cat ? ACCENT : "#1E2A3E"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-3 mt-2">
        {filtered.length === 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ background: INK_2, border: "1px solid #1E2A3E" }}>
            <p className="text-white font-medium mb-1">No Campaigns Available</p>
            <p className="text-[12.5px]" style={{ color: "#7C8AA3" }}>
              New campaigns will appear when suitable opportunities become available in your country.
            </p>
          </div>
        )}
        {filtered.map((c) => {
          const done = completedIds.includes(c.id);
          return (
            <div
              key={c.id}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: INK_2, border: "1px solid #1E2A3E" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: INK_3 }}
              >
                <PlayCircle size={22} color={ACCENT} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-white truncate">{c.title}</p>
                <p className="text-[12px] truncate" style={{ color: "#7C8AA3" }}>
                  {c.sponsor} · {fmtDuration(c.duration)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-semibold tabular-nums" style={{ color: ACCENT }}>
                  {currency(c.reward)}
                </p>
                <button
                  disabled={done}
                  onClick={() => onOpenCampaign(c)}
                  className="mt-1 text-[11.5px] font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: done ? "transparent" : ACCENT,
                    color: done ? "#7C8AA3" : INK,
                    border: done ? "1px solid #1E2A3E" : "none",
                  }}
                >
                  {done ? "Done" : "Watch"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CampaignModal({ campaign, onClose, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("watching"); // watching -> verifying -> pending

  useEffect(() => {
    if (stage !== "watching") return;
    const step = 100 / (campaign.duration / 0.5 > 40 ? 40 : campaign.duration);
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(t);
          setStage("verifying");
          setTimeout(() => setStage("pending"), 1200);
          return 100;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(t);
  }, [stage, campaign.duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md rounded-t-3xl p-5 pb-8" style={{ background: INK_2 }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[12px]" style={{ color: "#7C8AA3" }}>{campaign.sponsor}</p>
            <h2 className="text-white font-semibold text-[16px] leading-tight mt-0.5 pr-6">{campaign.title}</h2>
          </div>
          <button onClick={onClose} style={{ color: "#7C8AA3" }}><X size={20} /></button>
        </div>

        <div
          className="rounded-2xl aspect-video flex items-center justify-center mb-4"
          style={{ background: INK_3 }}
        >
          {stage === "watching" && <PlayCircle size={40} color={ACCENT} />}
          {stage === "verifying" && <Clock size={32} color={AMBER} className="animate-pulse" />}
          {stage === "pending" && <CheckCircle2 size={40} color={ACCENT} />}
        </div>

        {stage === "watching" && (
          <>
            <ProgressBar pct={progress} />
            <p className="text-[12px] mt-2" style={{ color: "#7C8AA3" }}>
              {campaign.requirement}
            </p>
          </>
        )}
        {stage === "verifying" && (
          <p className="text-[13px] text-center" style={{ color: AMBER }}>Sending completion to provider for verification…</p>
        )}
        {stage === "pending" && (
          <div className="text-center space-y-3">
            <p className="text-[13px]" style={{ color: "#B7C1D6" }}>
              Verified. <span className="tabular-nums font-semibold" style={{ color: ACCENT }}>{currency(campaign.reward)}</span> added as pending reward.
            </p>
            <button
              onClick={() => onComplete(campaign)}
              className="w-full py-3 rounded-xl font-semibold text-[14px]"
              style={{ background: ACCENT, color: INK }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BonusScreen({ streak, claimedToday, onClaim, bonusAmount }) {
  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-white mb-1">Daily Bonus 🎁</h1>
      <p className="text-[13px] mb-6" style={{ color: "#7C8AA3" }}>One claim per day. Resets at midnight.</p>

      <div
        className="rounded-3xl p-6 text-center"
        style={{ background: `linear-gradient(160deg, ${INK_3}, ${INK_2})`, border: "1px solid #1E2A3E" }}
      >
        <p className="text-[12.5px]" style={{ color: "#7C8AA3" }}>{streak} Day Streak</p>
        <p className="text-3xl font-semibold text-white mt-2 tabular-nums">{currency(bonusAmount)}</p>
        <p className="text-[12px] mt-1" style={{ color: "#7C8AA3" }}>Today's bonus</p>

        <button
          onClick={onClaim}
          disabled={claimedToday}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-[14px] transition-opacity"
          style={{
            background: claimedToday ? "transparent" : AMBER,
            color: claimedToday ? "#7C8AA3" : INK,
            border: claimedToday ? "1px solid #1E2A3E" : "none",
          }}
        >
          {claimedToday ? "Claimed for today" : "Claim Bonus"}
        </button>
      </div>

      <div className="flex gap-2 mt-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{ background: i < streak ? AMBER : "#1E2A3E" }}
          />
        ))}
      </div>
    </div>
  );
}

function ReferScreen({ referrals, referralGoal }) {
  const [copied, setCopied] = useState(false);
  const pct = (referrals / referralGoal) * 100;

  return (
    <div className="px-5 pt-6 pb-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Refer Friends</h1>
        <p className="text-[13px]" style={{ color: "#7C8AA3" }}>
          Invite friends to unlock withdrawals and earn referral rewards.
        </p>
      </div>

      <div className="rounded-2xl p-4" style={{ background: INK_2, border: "1px solid #1E2A3E" }}>
        <div className="flex justify-between text-[12.5px] mb-2">
          <span style={{ color: "#7C8AA3" }}>Referral Progress</span>
          <span className="text-white font-medium">{referrals} / {referralGoal}</span>
        </div>
        <ProgressBar pct={pct} />
        <p className="text-[12px] mt-2" style={{ color: "#7C8AA3" }}>
          {referrals >= referralGoal
            ? "Referral requirement unlocked."
            : `Invite ${referralGoal - referrals} more eligible friends to unlock withdrawals.`}
        </p>
      </div>

      <div className="rounded-2xl p-4" style={{ background: INK_2, border: "1px solid #1E2A3E" }}>
        <p className="text-[12px] mb-2" style={{ color: "#7C8AA3" }}>Your referral code</p>
        <div className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: INK_3 }}>
          <span className="text-white font-mono text-[14px]">{MOCK_USER.referralCode}</span>
          <button
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="flex items-center gap-1 text-[12px] font-medium"
            style={{ color: ACCENT }}
          >
            <Copy size={14} /> {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WalletScreen({ wallet, transactions, onNav }) {
  return (
    <div className="px-5 pt-6 pb-4 space-y-6">
      <h1 className="text-xl font-semibold text-white">My Wallet</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Available" value={wallet.available} highlight />
        <StatCard label="Pending" value={wallet.pending} />
        <StatCard label="Total Earned" value={wallet.totalEarned} />
        <StatCard label="Referral Earnings" value={wallet.referralEarnings} />
      </div>

      <button
        onClick={() => onNav("withdraw")}
        className="w-full py-3.5 rounded-xl font-semibold text-[14px]"
        style={{ background: ACCENT, color: INK }}
      >
        Withdraw
      </button>

      <div>
        <p className="text-[13px] font-medium text-white mb-3">Recent Transactions</p>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="rounded-xl p-3.5 flex items-center gap-3"
              style={{ background: INK_2, border: "1px solid #1E2A3E" }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: t.amount >= 0 ? "rgba(45,216,167,0.15)" : "rgba(255,107,107,0.15)",
                  color: t.amount >= 0 ? ACCENT : "#FF6B6B",
                }}
              >
                {t.amount >= 0 ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white truncate">{t.type}</p>
                <p className="text-[11.5px]" style={{ color: "#7C8AA3" }}>{t.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className="text-[13.5px] font-semibold tabular-nums"
                  style={{ color: t.amount >= 0 ? ACCENT : "#FF6B6B" }}
                >
                  {t.amount >= 0 ? "+" : "-"}{currency(Math.abs(t.amount))}
                </p>
                <StatusPill status={t.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: highlight ? `${ACCENT}15` : INK_2,
        border: `1px solid ${highlight ? ACCENT_DIM : "#1E2A3E"}`,
      }}
    >
      <p className="text-[12px]" style={{ color: "#7C8AA3" }}>{label}</p>
      <p className="text-[18px] font-semibold text-white tabular-nums mt-1">{currency(value)}</p>
    </div>
  );
}

function WithdrawScreen({ wallet, referrals, referralGoal }) {
  const minWithdraw = 50;
  const balanceOk = wallet.available >= minWithdraw;
  const referralOk = referrals >= referralGoal;
  const eligible = balanceOk && referralOk;
  const pct = Math.min(100, (wallet.available / minWithdraw) * 100);

  return (
    <div className="px-5 pt-6 pb-4 space-y-5">
      <h1 className="text-xl font-semibold text-white">Withdraw</h1>

      <div className="rounded-2xl p-5" style={{ background: INK_2, border: "1px solid #1E2A3E" }}>
        <p className="text-[12px]" style={{ color: "#7C8AA3" }}>Minimum Withdrawal</p>
        <p className="text-2xl font-semibold text-white tabular-nums mt-1">{currency(minWithdraw)}</p>
        <div className="mt-4">
          <ProgressBar pct={pct} />
          <p className="text-[12px
