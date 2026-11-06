import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_META: Record<Mode, { label: string; color: string; ring: string; bg: string; icon: typeof Brain }> = {
  focus: {
    label: "专注",
    color: "text-rose-600",
    ring: "stroke-rose-500",
    bg: "from-rose-500/10 to-orange-500/5",
    icon: Brain,
  },
  short: {
    label: "短休息",
    color: "text-emerald-600",
    ring: "stroke-emerald-500",
    bg: "from-emerald-500/10 to-teal-500/5",
    icon: Coffee,
  },
  long: {
    label: "长休息",
    color: "text-sky-600",
    ring: "stroke-sky-500",
    bg: "from-sky-500/10 to-indigo-500/5",
    icon: Coffee,
  },
};

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function playChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    const notes = [880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const start = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.start(start);
      osc.stop(start + 0.6);
    });
  } catch {
    // Audio not available — silent fallback
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setSecondsLeft(DURATIONS[next]);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  }, [mode]);

  // Tick loop
  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          playChime();
          if (mode === "focus") setCompletedFocus((c) => c + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  // Update document title with remaining time
  useEffect(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    document.title = `${m}:${s.toString().padStart(2, "0")} · 番茄钟`;
  }, [secondsLeft]);

  const meta = MODE_META[mode];
  const total = DURATIONS[mode];
  const progress = 1 - secondsLeft / total;
  const dashOffset = CIRCUMFERENCE * progress;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const ModeIcon = meta.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex flex-col items-center justify-center p-6 transition-colors duration-700">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-white shadow-lg shadow-sky-200/60 mb-3">
            <span className="text-2xl">🍅</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">番茄钟</h1>
          <p className="text-slate-400 text-sm mt-1">保持专注，高效工作</p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 bg-white/70 backdrop-blur rounded-3xl shadow-sm mb-8">
          {(Object.keys(DURATIONS) as Mode[]).map((m) => {
            const mMeta = MODE_META[m];
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <mMeta.icon className={`w-4 h-4 ${active ? mMeta.color : ""}`} />
                {mMeta.label}
              </button>
            );
          })}
        </div>

        {/* Timer card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-200/50 p-8 flex flex-col items-center">
          <div className="relative w-[320px] h-[320px] flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 320 320">
              <circle
                cx="160"
                cy="160"
                r={RADIUS}
                fill="none"
                className="stroke-slate-100"
                strokeWidth="14"
              />
              <circle
                cx="160"
                cy="160"
                r={RADIUS}
                fill="none"
                className={`${meta.ring} transition-all duration-1000 ease-linear`}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>

            <div className="flex flex-col items-center z-10">
              <div className={`flex items-center gap-1.5 mb-2 ${meta.color}`}>
                <ModeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{meta.label}</span>
              </div>
              <div className="text-6xl font-bold text-slate-800 tabular-nums tracking-tight">
                {timeStr}
              </div>
              <div className="text-slate-400 text-xs mt-2">
                {running ? "计时中…" : secondsLeft === 0 ? "时间到！" : "已暂停"}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={reset}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="重置"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (secondsLeft === 0) {
                  setSecondsLeft(DURATIONS[mode]);
                }
                setRunning((r) => !r);
              }}
              className={`flex items-center justify-center gap-2 h-14 px-8 rounded-full text-white font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                running
                  ? "bg-slate-600 shadow-slate-300"
                  : `bg-gradient-to-r ${
                      mode === "focus"
                        ? "from-rose-500 to-orange-500 shadow-rose-200/80"
                        : mode === "short"
                          ? "from-emerald-500 to-teal-500 shadow-emerald-200/80"
                          : "from-sky-500 to-blue-500 shadow-sky-200/80"
                    }`
              }`}
            >
              {running ? (
                <>
                  <Pause className="w-5 h-5" /> 暂停
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> {secondsLeft === 0 ? "重新开始" : "开始"}
                </>
              )}
            </button>

            <button
              onClick={() => switchMode(mode === "focus" ? "short" : "focus")}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="切换模式"
            >
              <ModeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-lg">🍅</span>
            <span>
              今日完成 <span className="font-semibold text-slate-700">{completedFocus}</span> 个番茄
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
