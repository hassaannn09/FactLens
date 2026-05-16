import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Copy,
  Trash2,
  Clock,
  FileText,
  AlignLeft,
  Zap,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Newspaper,
  AlertTriangle,
  ClipboardPaste,
  Activity,
  ShieldCheck,
  TrendingUp,
  WifiOff,
  Database,
  Radio,
  Sun,
  Moon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────── */
const API = "http://localhost:8000";

const SAMPLES = [
  {
    label: "Real sample",
    icon: <Newspaper size={12} />,
    text: `Scientists at NASA confirmed Thursday that the Hubble Space Telescope has captured new images revealing a galaxy cluster 10 billion light-years away. The findings, published in The Astrophysical Journal, help researchers better understand dark matter distribution across the universe. The study involved 47 researchers from 12 countries over a four-year observational period.`,
  },
  {
    label: "Fake sample",
    icon: <AlertTriangle size={12} />,
    text: `BREAKING: Government secretly adding mind-control chemicals to tap water supply across all major US cities! Anonymous insider reveals globalist plot to suppress free thought. Share before this gets DELETED! Big Pharma doesn't want you to know the truth. The mainstream media won't cover this bombshell story rocking the establishment to its core.`,
  },
];

const V = {
  Real: { color: "#00d4aa", bg: "rgba(0,212,170,0.10)", icon: CheckCircle2 },
  Fake: { color: "#ff4d6d", bg: "rgba(255,77,109,0.10)", icon: XCircle },
  Unknown: { color: "#6b7fa3", bg: "rgba(107,127,163,0.10)", icon: HelpCircle },
};

/* ─── THEMES ─────────────────────────────────────────────── */
const THEMES = {
  dark: {
    bg: "#0d1117",
    surface: "#141c28",
    surface2: "#1a2335",
    surface3: "#1f293d",
    border: "#1e2d42",
    border2: "#253650",
    text: "#e2eaf5",
    textDim: "#ffffff",
    muted: "#f0f0f0",
    accent: "#00d4aa",
    accentGlow: "rgba(0,212,170,0.15)",
    accentFg: "#0d1117",
    realColor: "#00d4aa",
    fakeColor: "#ff4d6d",
    cardShadow: "0 4px 32px rgba(0,0,0,0.45)",
  },
  light: {
    bg: "#f4f6f9",
    surface: "#ffffff",
    surface2: "#f8f9fb",
    surface3: "#eef1f5",
    border: "#e2e8f0",
    border2: "#cbd5e0",
    text: "#0f172a",
    textDim: "#000000",
    muted: "#000000",
    accent: "#00d4aa",
    accentGlow: "rgba(0,212,170,0.12)",
    accentFg: "#ffffff",
    realColor: "#00d4aa",
    fakeColor: "#ff4d6d",
    cardShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
};

let T = THEMES.light;

/* ─── HOOKS ──────────────────────────────────────────────── */
function useLS(key, init) {
  const [v, setV] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? init;
    } catch {
      return init;
    }
  });
  const set = useCallback(
    (val) => {
      setV(val);
      localStorage.setItem(key, JSON.stringify(val));
    },
    [key],
  );
  return [v, set];
}

function getMeta(t) {
  const w = t.trim() ? t.trim().split(/\s+/).length : 0;
  return { words: w, chars: t.length };
}

/* ─── LIVE CLOCK ─────────────────────────────────────────── */
function LiveClock({ t }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const h = pad(time.getHours()),
    m = pad(time.getMinutes()),
    s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontFamily: "'Poppins', serif",
          fontSize: "1.55rem",
          fontWeight: 700,
          color: t.text,
          letterSpacing: "0.06em",
          lineHeight: 1,
        }}
      >
        {h}
        <span style={{ color: t.accent, animation: "colonBlink 1s infinite" }}>
          :
        </span>
        {m}
        <span style={{ color: t.accent, animation: "colonBlink 1s infinite" }}>
          :
        </span>
        <span style={{ color: t.textDim }}>{s}</span>
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.63rem",
          color: t.muted,
          marginTop: 3,
          letterSpacing: "0.04em",
        }}
      >
        {dateStr} · PKT
      </div>
    </div>
  );
}

/* ─── STAT CARD ──────────────────────────────────────────── */
function StatCard({
  t,
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
  delta,
  barColor,
}) {
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "1.15rem 1.25rem 0",
        flex: 1,
        minWidth: 0,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: t.cardShadow,
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.border2;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.85rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color={iconColor} />
        </div>
        {delta != null && (
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.63rem",
              fontWeight: 600,
              color: "#f97316",
              background: "rgba(249,115,22,0.12)",
              padding: "0.13rem 0.42rem",
              borderRadius: 4,
            }}
          >
            +{delta} ↗
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: t.text,
          lineHeight: 1,
          marginBottom: "0.3rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.7rem",
          color: t.textDim,
          marginBottom: "1rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 3,
          background: barColor,
          marginLeft: "-1.25rem",
          marginRight: "-1.25rem",
        }}
      />
    </div>
  );
}

/* ─── CONFIDENCE GAUGE ───────────────────────────────────── */
function ConfidenceGauge({ value, label, t }) {
  const [pct, setPct] = useState(0);
  const target = Math.round(value * 100);
  const cfg = V[label] ?? V.Unknown;
  useEffect(() => {
    const id = setTimeout(() => setPct(target), 80);
    return () => clearTimeout(id);
  }, [target]);
  return (
    <div
      style={{
        padding: "1.05rem 1.4rem",
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.55rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "0.73rem",
            color: t.textDim,
          }}
        >
          <Activity size={11} color={t.muted} /> Confidence Score
        </span>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: t.text,
            lineHeight: 1,
          }}
        >
          {pct}
          <span
            style={{ fontSize: "0.76rem", fontWeight: 400, color: t.muted }}
          >
            %
          </span>
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: t.surface3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${cfg.color}77, ${cfg.color})`,
            borderRadius: 3,
            transition: "width 1s cubic-bezier(.4,0,.2,1)",
            boxShadow: `0 0 10px ${cfg.color}55`,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {[0, 25, 50, 75, 100].map((n) => (
          <span
            key={n}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.56rem",
              color: t.muted,
            }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── HISTORY ITEM ───────────────────────────────────────── */
function HistoryItem({ item, onClick }) {
  const cfg = V[item.label] ?? V.Unknown;
  const Icon = cfg.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.65rem",
        padding: "0.72rem 1rem",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.border2;
        e.currentTarget.style.background = T.surface2;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.background = T.surface;
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "0.17rem 0.48rem",
          borderRadius: 4,
          background: cfg.bg,
          color: cfg.color,
          fontSize: "0.59rem",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          flexShrink: 0,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <Icon size={9} />
        {item.label}
      </span>
      <span
        style={{
          fontSize: "0.74rem",
          fontFamily: "'Poppins', sans-serif",
          color: T.textDim,
          lineHeight: 1.5,
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {item.text}
      </span>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.64rem",
          fontWeight: 700,
          color: cfg.color,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {Math.round((item.conf ?? 0) * 100)}%
      </span>
    </button>
  );
}

/* ─── INLINE STAT ────────────────────────────────────────── */
function InlineStat({ icon: Icon, value, label, last }) {
  return (
    <div
      style={{
        padding: "0.82rem 1.2rem",
        borderRight: last ? "none" : `1px solid ${T.border}`,
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 3,
        }}
      >
        <Icon size={11} color={T.muted} />
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "0.65rem",
            color: T.textDim,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: T.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────── */
export default function App() {
  const [history, setHistory] = useLS("verifai-history", []);
  const [counts, setCounts] = useLS("verifai-counts", {
    real: 0,
    fake: 0,
    unknown: 0,
  });
  const [showDbBanner, setShowDbBanner] = useLS("verifai-db-hint", true);
  const [themeName, setThemeName] = useLS("verifai-theme", "dark");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [apiOk, setApiOk] = useState(null);
  const [chipHover, setChipHover] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);

  // Keep global T in sync so sub-components that read it directly stay current
  T = THEMES[themeName] ?? THEMES.dark;

  const resultRef = useRef(null);
  const toastTimer = useRef(null);
  const meta = getMeta(text);
  const total = counts.real + counts.fake + counts.unknown;
  const isLight = themeName === "light";

  /* Google Fonts */
  useEffect(() => {
    if (document.getElementById("vf-fonts")) return;
    const l = document.createElement("link");
    l.id = "vf-fonts";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap";
    document.head.appendChild(l);
  }, []);

  /* API health */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/`, { signal: AbortSignal.timeout(3000) });
        setApiOk(r.ok);
      } catch {
        setApiOk(false);
      }
    })();
  }, []);

  /* Ctrl+Enter */
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey && e.key === "Enter") analyze();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  function showToast(msg, type = "error") {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  async function analyze() {
    if (!text.trim()) {
      showToast("Paste some text first");
      return;
    }
    setLoading(true);
    const t0 = performance.now();
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const ms = Math.round(performance.now() - t0);
      setResult({ ...data, words: meta.words, chars: meta.chars, ms, text });
      setApiOk(true);
      setSessionCount((c) => c + 1);
      const k =
        data.label === "Real"
          ? "real"
          : data.label === "Fake"
            ? "fake"
            : "unknown";
      setCounts((prev) => ({ ...prev, [k]: prev[k] + 1 }));
      setHistory(
        [{ label: data.label, conf: data.confidence, text }, ...history].slice(
          0,
          10,
        ),
      );
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        100,
      );
    } catch (err) {
      showToast(`${err.message} — is the API running on :8000?`);
      setApiOk(false);
    } finally {
      setLoading(false);
    }
  }

  async function pasteClipboard() {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      showToast("Clipboard access denied");
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard
      .writeText(
        `VerifAI — ${result.label} (${Math.round((result.confidence ?? 0) * 100)}% confidence)\n\n"${result.text.slice(0, 200)}${result.text.length > 200 ? "…" : ""}"`,
      )
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  const vcfg = result ? (V[result.label] ?? V.Unknown) : null;
  const VerdictIco = vcfg?.icon;

  const card = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: T.cardShadow,
  };

  const subhead = {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontWeight: 600,
    fontSize: "0.83rem",
    color: T.textDim,
    marginBottom: "0.5rem",
    display: "block",
  };

  const chip = (i) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.67rem",
    padding: "0.24rem 0.62rem",
    borderRadius: 5,
    border: `1px solid ${chipHover === i ? T.accent : T.border2}`,
    background: chipHover === i ? T.accentGlow : T.surface3,
    color: chipHover === i ? T.accent : T.textDim,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes colonBlink{ 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
        textarea:focus { border-color:${T.accent}!important; box-shadow:0 0 0 2px ${T.accentGlow}!important; outline:none; }
        textarea::placeholder { color:${T.muted}; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${T.border2};border-radius:2px}
        button { cursor:pointer; }
      `}</style>

      {/* subtle grid overlay — dark mode only */}
      {!isLight && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.022,
            backgroundImage:
              "linear-gradient(rgba(0,212,170,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,1) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}
      {/* top glow line */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: 1,
          background: `linear-gradient(90deg,transparent,${T.accent}44,transparent)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 870,
          margin: "0 auto",
          padding: "1.8rem 1.5rem 6rem",
        }}
      >
        {/* ─── HEADER ─── */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            paddingBottom: "1.25rem",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: T.text,
                lineHeight: 1,
              }}
            >
              Fact<span style={{ color: T.accent }}>Lens</span>
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.73rem",
                color: T.muted,
                marginTop: "0.28rem",
                letterSpacing: "0.01em",
              }}
            >
              Real-time authenticity analysis · AI-powered verdict engine
            </div>
          </div>

          {/* right: clock + theme toggle + status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LiveClock t={T} />
              {/* Theme toggle */}
              <button
                onClick={() => setThemeName(isLight ? "dark" : "light")}
                title={isLight ? "Switch to dark mode" : "Switch to light mode"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${T.border2}`,
                  background: T.surface,
                  color: T.textDim,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accent;
                  e.currentTarget.style.color = T.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border2;
                  e.currentTarget.style.color = T.textDim;
                }}
              >
                {isLight ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 2,
              }}
            >
              {sessionCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "0.19rem 0.52rem",
                    borderRadius: 4,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    color: T.textDim,
                  }}
                >
                  <TrendingUp size={10} color={T.accent} />
                  {sessionCount} this session
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "0.19rem 0.55rem",
                  borderRadius: 4,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  color:
                    apiOk === null ? T.muted : apiOk ? T.accent : T.fakeColor,
                }}
              >
                {apiOk === null ? (
                  <>
                    <Activity
                      size={10}
                      style={{ animation: "colonBlink 1.5s infinite" }}
                    />
                    Checking
                  </>
                ) : apiOk ? (
                  <>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: T.accent,
                        display: "inline-block",
                        animation: "pulseDot 1.5s infinite",
                      }}
                    />
                    API Online
                  </>
                ) : (
                  <>
                    <WifiOff size={10} />
                    Offline
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ─── DB BANNER ─── */}
        {showDbBanner && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              padding: "0.72rem 1rem",
              marginBottom: "1.15rem",
              background: "rgba(0,212,170,0.05)",
              border: `1px solid rgba(0,212,170,0.16)`,
              borderRadius: 8,
            }}
          >
            <Database
              size={13}
              color={T.accent}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div
              style={{
                flex: 1,
                fontSize: "0.73rem",
                color: T.textDim,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: T.text, fontWeight: 600 }}>
                No database connected.
              </span>{" "}
              Stats reset on browser clear. Add{" "}
              <span style={{ fontWeight: 600, color: T.accent }}>SQLite</span>{" "}
              to FastAPI to persist analyses across sessions.
            </div>
            <button
              onClick={() => setShowDbBanner(false)}
              style={{
                background: "none",
                border: "none",
                color: T.muted,
                padding: 0,
                display: "flex",
                marginTop: 1,
              }}
            >
              <XCircle size={13} />
            </button>
          </div>
        )}

        {/* ─── STAT CARDS ─── */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.3rem" }}>
          <StatCard
            t={T}
            icon={ShieldCheck}
            iconColor="#00d4aa"
            iconBg="rgba(0,212,170,0.12)"
            value={total}
            label="Total Analysed"
            delta={sessionCount > 0 ? sessionCount : null}
            barColor="linear-gradient(90deg,#00d4aa,#3b82f6)"
          />
          <StatCard
            t={T}
            icon={CheckCircle2}
            iconColor="#00d4aa"
            iconBg="rgba(0,212,170,0.10)"
            value={counts.real}
            label="Real Articles"
            delta={null}
            barColor="#00d4aa"
          />
          <StatCard
            t={T}
            icon={XCircle}
            iconColor="#ff4d6d"
            iconBg="rgba(255,77,109,0.10)"
            value={counts.fake}
            label="Fake Detected"
            delta={null}
            barColor="#ff4d6d"
          />
          <StatCard
            t={T}
            icon={HelpCircle}
            iconColor="#6b7fa3"
            iconBg="rgba(107,127,163,0.10)"
            value={counts.unknown}
            label="Unknown"
            delta={null}
            barColor="#6b7fa3"
          />
        </div>

        {/* ─── INPUT CARD ─── */}
        <span style={subhead}>Input Article or Headline</span>
        <div style={card}>
          <div style={{ padding: "1.25rem 1.25rem 0" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a news article, headline, or paragraph to analyze its authenticity…"
              style={{
                width: "100%",
                minHeight: 172,
                background: T.surface2,
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "0.88rem 0.98rem",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.88rem",
                color: T.text,
                resize: "vertical",
                lineHeight: 1.7,
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.42rem 0.05rem 0.82rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.82rem",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  color: T.muted,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <AlignLeft size={10} />
                  {meta.words} {meta.words === 1 ? "word" : "words"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <FileText size={10} />
                  {meta.chars} chars
                </span>
              </div>
              {text && (
                <button
                  onClick={() => setText("")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    color: T.muted,
                    fontSize: "0.66rem",
                    fontWeight: 500,
                    padding: "0.1rem 0.28rem",
                    borderRadius: 4,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = T.fakeColor)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
                >
                  <Trash2 size={11} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* chips */}
          <div
            style={{
              padding: "0 1.25rem 0.95rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.32rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "0.66rem",
                color: T.muted,
                marginRight: 2,
              }}
            >
              Try:
            </span>
            {SAMPLES.map((s, i) => (
              <button
                key={i}
                style={chip(i)}
                onClick={() => setText(s.text)}
                onMouseEnter={() => setChipHover(i)}
                onMouseLeave={() => setChipHover(null)}
              >
                {s.icon} {s.label}
              </button>
            ))}
            <button
              style={chip(99)}
              onClick={pasteClipboard}
              onMouseEnter={() => setChipHover(99)}
              onMouseLeave={() => setChipHover(null)}
            >
              <ClipboardPaste size={12} />
              Paste clipboard
            </button>
          </div>

          {/* Analyze button */}
          <div style={{ padding: "0 1.25rem 1.25rem" }}>
            <button
              disabled={loading || !text.trim()}
              onClick={analyze}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0.78rem 1.5rem",
                background:
                  loading || !text.trim()
                    ? `rgba(0,212,170,0.12)`
                    : `linear-gradient(135deg, ${T.accent}, #0ea5e9)`,
                color: loading || !text.trim() ? `${T.accent}66` : "#0d1117",
                border: `1px solid ${loading || !text.trim() ? T.border : T.accent}`,
                borderRadius: 7,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.87rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                transition: "all 0.2s",
                cursor: loading || !text.trim() ? "not-allowed" : "pointer",
                boxShadow:
                  loading || !text.trim() ? "none" : `0 0 20px ${T.accentGlow}`,
              }}
              onMouseEnter={(e) => {
                if (!loading && text.trim()) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 6px 28px rgba(0,212,170,0.25)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  loading || !text.trim() ? "none" : `0 0 20px ${T.accentGlow}`;
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid transparent",
                      borderTopColor: T.accent,
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Analyzing…
                </>
              ) : (
                <>
                  <Search size={14} />
                  Analyze Article
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── RESULT ─── */}
        {result && (
          <div
            ref={resultRef}
            style={{
              marginTop: "1.05rem",
              animation: "fadeUp 0.35s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <div style={{ ...card, borderColor: vcfg.color + "44" }}>
              {/* Verdict header */}
              <div
                style={{
                  padding: "1.05rem 1.4rem 0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${T.border}`,
                  background: `linear-gradient(135deg, ${vcfg.bg}, transparent 60%)`,
                }}
              >
                <div>
                  <span style={subhead}>Verdict</span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "0.35rem 0.9rem",
                      borderRadius: 6,
                      background: vcfg.bg,
                      color: vcfg.color,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: `1px solid ${vcfg.color}33`,
                    }}
                  >
                    <span
                      style={{
                        animation: "pulseDot 2s infinite",
                        display: "flex",
                      }}
                    >
                      <VerdictIco size={13} />
                    </span>
                    {result.label}
                  </div>
                </div>
                <button
                  onClick={copyResult}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0.26rem 0.62rem",
                    borderRadius: 5,
                    border: `1px solid ${T.border2}`,
                    background: T.surface3,
                    color: T.textDim,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.67rem",
                    fontWeight: 500,
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = T.text;
                    e.currentTarget.style.borderColor = T.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.textDim;
                    e.currentTarget.style.borderColor = T.border2;
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={12} color={T.accent} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy Result
                    </>
                  )}
                </button>
              </div>

              <ConfidenceGauge
                value={result.confidence ?? 0}
                label={result.label}
                t={T}
              />

              <div
                style={{
                  display: "flex",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <InlineStat
                  icon={AlignLeft}
                  value={result.words.toLocaleString()}
                  label="Words"
                />
                <InlineStat
                  icon={FileText}
                  value={result.chars.toLocaleString()}
                  label="Chars"
                />
                <InlineStat
                  icon={Clock}
                  value={`${result.ms}ms`}
                  label="Response"
                  last
                />
              </div>

              <div
                style={{
                  padding: "0.78rem 1.4rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  fontSize: "0.73rem",
                  color: T.textDim,
                  lineHeight: 1.6,
                }}
              >
                <Info
                  size={13}
                  color={T.muted}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>
                  {result.label === "Real" &&
                    "Classified as real. Cross-verify with trusted primary sources before sharing."}
                  {result.label === "Fake" &&
                    "Flagged as potentially misleading. Verify with multiple trusted primary sources before sharing."}
                  {result.label === "Unknown" &&
                    (result.note ??
                      "No recognizable vocabulary. Try pasting a longer, more complete article.")}
                </span>
              </div>

              {/* bottom color bar */}
              <div
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${vcfg.color}66, ${vcfg.color}, ${vcfg.color}44)`,
                }}
              />
            </div>
          </div>
        )}

        {/* ─── HISTORY ─── */}
        {history.length > 0 && (
          <div style={{ marginTop: "1.35rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.52rem",
              }}
            >
              <span
                style={{
                  ...subhead,
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Radio
                  size={12}
                  color={T.accent}
                  style={{ display: "inline" }}
                />
                Recent Analyses
              </span>
              <button
                onClick={() => setHistory([])}
                style={{
                  background: "none",
                  border: "none",
                  color: T.muted,
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = T.fakeColor)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
              >
                <RotateCcw size={10} />
                Clear all
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.32rem",
              }}
            >
              {history.map((item, i) => (
                <HistoryItem
                  key={i}
                  item={item}
                  onClick={() => {
                    setText(item.text);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── FOOTER ─── */}
        <div style={{ fontSize: "1rem", fontWeight: "bold", marginTop: "2.5rem", paddingTop: "1rem", borderTop: `1px solid ${T.border}`, textAlign: "center", color: T.muted }}>
          IDS Project · Made by Erra, Hassaan and Ayesha · Students at BUKC · BSCS 6A 
        </div>

   </div> {}
        {/* ─── TOAST ─── */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              zIndex: 999,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                transform: "translateX(-50%)",
                padding: "0.52rem 1.05rem",
                borderRadius: 7,
                background:
                  toast.type === "error"
                    ? "rgba(255,77,109,0.10)"
                    : "rgba(0,212,170,0.10)",
                border: `1px solid ${toast.type === "error" ? T.fakeColor : T.accent}`,
                color: toast.type === "error" ? T.fakeColor : T.accent,
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                animation: "toastIn 0.3s cubic-bezier(.4,0,.2,1)",
                whiteSpace: "nowrap",
              }}
            >
              {toast.type === "error" ? (
                <AlertTriangle size={13} />
              ) : (
                <CheckCircle2 size={13} />
              )}
              {toast.msg}
            </div>
          </div>
        )}
      </div>
    );
  }
