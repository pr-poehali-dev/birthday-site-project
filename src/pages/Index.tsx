import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import Icon from "@/components/ui/icon";

// ─── CONTENT — все тексты и имена здесь ──────────────────────
const CONTENT = {
  friendName: "Илона",
  heroTitle: "С Днём Рождения",
  heroSubtitle: "Восемнадцать лет — это не просто дата. Это момент, когда ты становишься собой. Всё лучшее только начинается. 🌟",

  photosTitle: "Как я была рядом с тобой",
  photosSubtitle: "Каждый момент нашей дружбы — это отдельная глава. Нажми на любую рамку и загрузи наше совместное фото.",
  photoLabels: [
    "Наше лучшее лето",
    "Помнишь этот день?",
    "Мы и приключения",
    "На скутерах 🛵",
    "Просто мы",
    "Незабываемый момент",
  ],

  loveHeading: "Я тебя очень люблю ❤️",
  lovePara1: "Когда я думаю о тебе, я думаю о человеке, который умеет дружить по-настоящему. Не когда удобно — а всегда. Ты из тех редких людей, рядом с которыми хочется быть лучше.",
  lovePara2: "Твои 18 — это не конец юности. Это первый день твоей взрослой жизни, которую ты будешь строить сама, по своим правилам. И я знаю — у тебя получится именно так, как ты мечтаешь.",
  loveSign: "С любовью, твоя подруга 🌸",
  boysLabel: "А ещё тебя поздравляют герои твоей книги",

  seaTitle: "Море зовёт тебя!",
  seaSubtitle: "В 18 горизонт — не конец пути, а его начало. Всё лучшее ждёт впереди.",

  mapTitle: "🗺️ Карта наших сокровищ",
  mapSubtitle: "Нажми на каждую метку — и узнай, что она значит. А потом найди сундук.",
  chestMessage: "Это — наша дружба. Она настоящая, она выдержала всё и она будет рядом, сколько бы лет ни прошло. Ты самый ценный человек в моей жизни. С днём рождения, моя дорогая. Я горжусь тем, какой ты стала. 🌟",

  finaleTitle: "С Днём Рождения!",
  finalePara1: "Ты из тех людей, которые появляются в жизни раз — и остаются навсегда. Рядом с тобой хочется смеяться, мечтать и делать всё по-настоящему.",
  finalePara2: "Сегодня тебе 18. Это значит — ты стоишь на пороге жизни, которая уже ждёт тебя с распростёртыми объятиями. Пусть каждый день приносит что-то новое: море, скутеры, джипы, цветы и людей, которые умеют ценить тебя так же, как ценю я.",

  boys: [
    {
      name: "Вова",
      role: "Герой первой главы",
      message: "С днём рождения! Когда я думаю о тебе, я думаю о том, как ты умеешь видеть мир иначе — ярче, теплее, живее. В свои 18 ты уже прошла путь, который многие не пройдут никогда. Будь собой. Это твой главный талант.",
    },
    {
      name: "Ярик",
      role: "Герой второй главы",
      message: "Знаешь, что я заметил? Ты из тех, кто делает жизнь вокруг лучше — просто своим присутствием. 18 лет — это не просто число. Это начало твоей настоящей истории. Пусть она будет достойна тебя.",
    },
    {
      name: "Тэ-му",
      role: "Герой третьей главы",
      message: "Ты читаешь книги о нас — но сама ты интереснее любого персонажа. В тебе есть что-то настоящее: сила, нежность и та редкая честность, которая сегодня на вес золота. С днём рождения, живи громко.",
    },
  ],

  mapPlaces: [
    { id: 1, emoji: "💝", label: "Остров Нашей Дружбы", x: 14, y: 28, color: "#FF6EB4", desc: "Место, где началась наша история. Самый ценный остров в мире — здесь нет ничего лишнего, только мы." },
    { id: 2, emoji: "🏔️", label: 'Горы "18 лет"', x: 66, y: 18, color: "#B57BFF", desc: "Ты покорила эту вершину. Сюда доходят только сильные — и ты доказала, что ты именно такая." },
    { id: 3, emoji: "🚙", label: "Бухта Роскошных Джипов", x: 76, y: 64, color: "#2563EB", desc: "Сюда мы едем за свободой. Открытая дорога, ветер и лучшая компания — всё, что нужно для счастья." },
    { id: 4, emoji: "🛵", label: "Пляж Скутеров и Цветов", x: 18, y: 68, color: "#059669", desc: "Наш пляж. Скутеры, солёный воздух, закат и смех. Сюда я хочу вернуться снова и снова." },
  ],
};

// ─── EditableText — клик для редактирования ──────────────────
function EditableText({
  value,
  onChange,
  className,
  style,
  multiline = false,
  tag: Tag = "span",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  const start = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(value);
    setEditing(true);
    setTimeout(() => ref.current?.focus(), 30);
  };

  const commit = () => { onChange(draft.trim() || value); setEditing(false); };

  const onKey = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setDraft(value); setEditing(false); }
  };

  if (editing) {
    const shared = {
      ref,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: onKey,
      style: {
        ...style,
        background: "rgba(255,255,255,0.95)",
        color: "#1a1a1a",
        border: "2px solid #FF6EB4",
        borderRadius: 10,
        padding: "4px 10px",
        outline: "none",
        width: "100%",
        boxShadow: "0 0 0 3px rgba(255,110,180,0.25)",
        fontFamily: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        lineHeight: "inherit",
        resize: "none" as const,
      },
    };
    return multiline
      ? <textarea {...shared} rows={Math.max(3, draft.split("\n").length)} className={className} />
      : <input {...shared} className={className} />;
  }

  return (
    <Tag
      className={className}
      style={{ ...style, cursor: "text", position: "relative" }}
      onClick={start}
      title="Нажми, чтобы изменить текст"
    >
      {value}
      <span style={{
        position: "absolute",
        top: -6,
        right: -6,
        background: "#FF6EB4",
        color: "white",
        borderRadius: "50%",
        width: 16,
        height: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 700,
        opacity: 0.85,
        pointerEvents: "none",
        lineHeight: 1,
      }}>✎</span>
    </Tag>
  );
}

// ─── Content Context ──────────────────────────────────────────
type ContentType = typeof CONTENT;
type SetContent = (updater: (prev: ContentType) => ContentType) => void;
const ContentCtx = createContext<{ content: ContentType; setContent: SetContent }>({
  content: CONTENT,
  setContent: () => {},
});
const useContent = () => useContext(ContentCtx);

// ─── Types ────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "square" | "rect";
}

// ─── Constants ────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#FF6EB4", "#B57BFF", "#7EC8FF", "#FFB347", "#7FFFB5",
  "#FFD700", "#FF7F7F", "#FF9EE0", "#C8A0FF", "#80D8FF",
];

const BOY_COLORS = [
  { bg: "#FFF0F7", border: "#FF6EB4", accent: "#FF6EB4", text: "#C0226B" },
  { bg: "#F3EEFF", border: "#B57BFF", accent: "#B57BFF", text: "#6B21A8" },
  { bg: "#EEF7FF", border: "#7EC8FF", accent: "#2563EB", text: "#1E40AF" },
];
const BOY_AVATARS = ["🧑‍🎤", "🧑‍💼", "🧑‍🎨"];

// ─── Confetti ────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 5 + Math.random() * 12,
        duration: 3.5 + Math.random() * 4,
        delay: Math.random() * 4,
        shape: ["circle", "square", "rect"][Math.floor(Math.random() * 3)] as Particle["shape"],
      }))
    );
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-30px",
            width: p.shape === "rect" ? p.size * 0.5 : p.size,
            height: p.shape === "rect" ? p.size * 2 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ${p.delay}s cubic-bezier(0.23,1,0.32,1) forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Photo Upload Slot ────────────────────────────────────────
function PhotoSlot({ label, onLabelChange, size = "normal" }: { label: string; onLabelChange?: (v: string) => void; index: number; size?: "normal" | "large" }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const height = size === "large" ? "320px" : "200px";

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300"
      style={{
        height,
        border: dragging ? "2px dashed #FF6EB4" : imgSrc ? "2px solid rgba(255,110,180,0.2)" : "2px dashed #D4B0FF",
        background: imgSrc ? "transparent" : dragging ? "#FFF0F7" : "#FAF5FF",
        boxShadow: imgSrc ? "0 12px 40px rgba(0,0,0,0.16)" : "none",
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {imgSrc ? (
        <>
          <img src={imgSrc} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {onLabelChange
              ? <EditableText value={label} onChange={onLabelChange} className="font-caveat text-white text-lg font-semibold" style={{ color: "white", background: "transparent", border: "none" }} />
              : <p className="font-caveat text-white text-lg font-semibold">{label}</p>
            }
          </div>
          <button
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
            onClick={(e) => { e.stopPropagation(); setImgSrc(null); }}
          >
            <Icon name="X" size={14} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            style={{ background: "linear-gradient(135deg,#FF6EB4,#B57BFF)" }}
          >
            <Icon name="ImagePlus" size={20} className="text-white" />
          </div>
          <div className="text-center px-4">
            {onLabelChange
              ? <EditableText value={label} onChange={onLabelChange} className="font-nunito font-semibold text-sm" style={{ color: "#9B59B6" }} />
              : <p className="font-nunito font-semibold text-sm" style={{ color: "#9B59B6" }}>{label}</p>
            }
            <p className="font-nunito text-xs text-gray-400 mt-0.5">Нажми или перетащи фото</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Photo Upload ────────────────────────────────────────
function MainPhotoSlot() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="relative cursor-pointer group"
      onClick={() => inputRef.current?.click()}
      style={{ width: 220, height: 220 }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      <div
        className="w-full h-full rounded-full overflow-hidden transition-all duration-300"
        style={{
          background: imgSrc ? `url(${imgSrc}) center/cover no-repeat` : "linear-gradient(135deg,#FFE5F5,#F0E5FF)",
          boxShadow: "0 0 0 5px white, 0 0 0 8px #FF6EB4, 0 20px 60px rgba(255,110,180,0.35)",
        }}
      >
        {!imgSrc && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="text-5xl">👸</div>
            <div
              className="rounded-full px-3 py-1 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(255,110,180,0.15)" }}
            >
              <Icon name="Camera" size={12} className="text-pink-500" />
              <span className="font-nunito text-xs text-pink-500 font-semibold">Добавить фото</span>
            </div>
          </div>
        )}
        {imgSrc && (
          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="flex flex-col items-center gap-1">
              <Icon name="Camera" size={20} className="text-white" />
              <span className="font-nunito text-xs text-white font-semibold">Сменить</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Music Control ────────────────────────────────────────────
function MusicControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      {playing && (
        <div
          className="rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3, 4, 3].map((h, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height: `${h * 3}px`,
                  background: "#FF6EB4",
                  animation: `bounce-soft ${0.35 + i * 0.08}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
          <span className="font-nunito text-xs font-semibold" style={{ color: "#9B59B6" }}>Музыка</span>
        </div>
      )}
      <button
        onClick={onToggle}
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: playing ? "linear-gradient(135deg,#FF6EB4,#B57BFF)" : "white",
          border: "2px solid #FF6EB4",
        }}
      >
        {playing
          ? <Icon name="Volume2" size={18} className="text-white" />
          : <Icon name="VolumeX" size={18} className="text-pink-500" />
        }
      </button>
    </div>
  );
}

// ─── Floating Hearts ─────────────────────────────────────────
const HEART_DATA = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 3 + (i * 8.5) % 90,
  delay: i * 0.5,
  size: 14 + (i % 4) * 6,
  emoji: ["💗", "💖", "🌸", "💕", "✨"][i % 5],
}));

function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {HEART_DATA.map((h) => (
        <div
          key={h.id}
          className="absolute select-none"
          style={{
            left: `${h.x}%`,
            bottom: "5%",
            fontSize: h.size,
            animation: `heartFloat 4s ${h.delay}s ease-out infinite`,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── SECTION 1: HERO ─────────────────────────────────────────
function HeroSection() {
  const { content, setContent } = useContent();
  const [showConfetti, setShowConfetti] = useState(true);
  const upd = <K extends keyof ContentType>(key: K, val: ContentType[K]) =>
    setContent((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(150deg,#FFF0F8 0%,#F5EEFF 40%,#EBF5FF 75%,#FFF8E5 100%)" }}
    >
      <Confetti active={showConfetti} />
      <FloatingHearts />

      {/* Blobs */}
      <div className="absolute pointer-events-none rounded-full opacity-30 blur-3xl"
        style={{ width: 400, height: 400, background: "#FFB3D9", top: -100, left: -100, animation: "float 8s ease-in-out infinite" }} />
      <div className="absolute pointer-events-none rounded-full opacity-25 blur-3xl"
        style={{ width: 350, height: 350, background: "#C8A0FF", bottom: -80, right: -80, animation: "float 10s 2s ease-in-out infinite" }} />
      <div className="absolute pointer-events-none rounded-full opacity-20 blur-3xl"
        style={{ width: 280, height: 280, background: "#80D8FF", top: "30%", right: "5%", animation: "float 7s 1s ease-in-out infinite" }} />

      {/* 18 */}
      <div className="relative mb-8 select-none animate-pulse18">
        <div
          className="font-pacifico"
          style={{
            fontSize: "clamp(7rem,22vw,17rem)",
            lineHeight: 1,
            background: "linear-gradient(140deg,#FF6EB4 0%,#C84BCC 25%,#8B5CF6 55%,#3B9EDD 80%,#FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 6px 24px rgba(180,90,255,0.35))",
          }}
        >
          18
        </div>
        <div className="absolute -top-10 left-4 flex flex-col items-center" style={{ animation: "float 3s ease-in-out infinite" }}>
          <span className="text-3xl">🎈</span>
          <div style={{ width: 1, height: 24, background: "rgba(255,110,180,0.4)" }} />
        </div>
        <div className="absolute -top-10 right-4 flex flex-col items-center" style={{ animation: "float 3.5s 0.5s ease-in-out infinite" }}>
          <span className="text-3xl">🎈</span>
          <div style={{ width: 1, height: 24, background: "rgba(181,123,255,0.4)" }} />
        </div>
      </div>

      {/* Main photo */}
      <div className="mb-8 relative">
        <MainPhotoSlot />
        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-xl" style={{ animation: "float 4s ease-in-out infinite" }}>💎</div>
        <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-xl" style={{ animation: "float 5s 1s ease-in-out infinite" }}>🌸</div>
      </div>

      {/* Text */}
      <div className="text-center px-6 max-w-xl animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
        <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-2" style={{ color: "#C084FC" }}>
          <EditableText value={content.heroTitle} onChange={(v) => upd("heroTitle", v)} />
        </p>
        <h1 className="font-pacifico mb-4" style={{ fontSize: "clamp(2.2rem,8vw,4.5rem)", color: "#FF6EB4", lineHeight: 1.15 }}>
          <EditableText value={content.friendName} onChange={(v) => upd("friendName", v)} />
        </h1>
        <div
          className="rounded-2xl px-6 py-4"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,110,180,0.2)" }}
        >
          <p className="font-nunito text-lg text-gray-600 leading-relaxed">
            <EditableText value={content.heroSubtitle} onChange={(v) => upd("heroSubtitle", v)} multiline />
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1 text-pink-300" style={{ animation: "bounce-soft 2s ease-in-out infinite" }}>
        <span className="font-caveat text-base">листай вниз</span>
        <Icon name="ChevronDown" size={20} />
      </div>
    </section>
  );
}

// ─── SECTION 2: PHOTOS ───────────────────────────────────────
function PhotoSection() {
  const { content, setContent } = useContent();
  const updLabel = (i: number, v: string) =>
    setContent((p) => {
      const labels = [...p.photoLabels];
      labels[i] = v;
      return { ...p, photoLabels: labels };
    });

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#FAF0FF 0%,#FFF0F8 50%,#F0F8FF 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#B57BFF" }}>
            Наша история
          </p>
          <h2 className="font-pacifico text-4xl md:text-5xl mb-4" style={{ color: "#7C3AED" }}>
            <EditableText value={content.photosTitle} onChange={(v) => setContent((p) => ({ ...p, photosTitle: v }))} />
          </h2>
          <p className="font-nunito text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            <EditableText value={content.photosSubtitle} onChange={(v) => setContent((p) => ({ ...p, photosSubtitle: v }))} multiline />
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 md:col-span-5">
            <PhotoSlot label={content.photoLabels[0]} onLabelChange={(v) => updLabel(0, v)} index={0} size="large" />
          </div>
          <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <PhotoSlot label={content.photoLabels[1]} onLabelChange={(v) => updLabel(1, v)} index={1} />
              <PhotoSlot label={content.photoLabels[2]} onLabelChange={(v) => updLabel(2, v)} index={2} />
            </div>
            <PhotoSlot label={content.photoLabels[3]} onLabelChange={(v) => updLabel(3, v)} index={3} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PhotoSlot label={content.photoLabels[4]} onLabelChange={(v) => updLabel(4, v)} index={4} />
          <PhotoSlot label={content.photoLabels[5]} onLabelChange={(v) => updLabel(5, v)} index={5} />
        </div>

        <p className="font-caveat text-center text-xl mt-8" style={{ color: "#C084FC" }}>
          💜 Нажми на любую рамку — загрузи фото с телефона или компьютера
        </p>
      </div>
    </section>
  );
}

// ─── Boy Avatar Upload ────────────────────────────────────────
function BoyAvatar({ avatar, accentColor }: { avatar: string; accentColor: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="relative cursor-pointer group flex-shrink-0"
      style={{ width: 56, height: 56 }}
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-200"
        style={{
          background: imgSrc ? "transparent" : "rgba(255,255,255,0.12)",
          border: `2px solid ${accentColor}60`,
          boxShadow: `0 0 0 2px rgba(255,255,255,0.15)`,
        }}
      >
        {imgSrc
          ? <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          : <span className="text-2xl select-none">{avatar}</span>
        }
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Icon name="Camera" size={14} className="text-white" />
        </div>
      </div>
      {!imgSrc && (
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
          style={{ background: accentColor }}
        >
          <Icon name="Plus" size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}

// ─── SECTION 3: LOVE + BOYS ──────────────────────────────────
function BoyCard({ idx }: { idx: number }) {
  const { content, setContent } = useContent();
  const [open, setOpen] = useState(false);
  const boy = content.boys[idx];
  const color = BOY_COLORS[idx];
  const avatar = BOY_AVATARS[idx];

  const updBoy = (field: "name" | "role" | "message", val: string) =>
    setContent((p) => {
      const boys = p.boys.map((b, i) => i === idx ? { ...b, [field]: val } : b);
      return { ...p, boys };
    });

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: open ? color.bg : "rgba(255,255,255,0.07)",
          border: `1.5px solid ${open ? color.border : "rgba(255,255,255,0.15)"}`,
          boxShadow: open ? `0 12px 40px ${color.accent}30` : "none",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <BoyAvatar avatar={avatar} accentColor={color.accent} />
          <div className="flex-1">
            <p className="font-pacifico text-base" style={{ color: open ? color.accent : "white" }}>
              <EditableText value={boy.name} onChange={(v) => updBoy("name", v)} style={{ color: open ? color.accent : "white" }} />
            </p>
            <p className="font-nunito text-xs" style={{ color: open ? color.text + "80" : "rgba(255,255,255,0.4)" }}>
              <EditableText value={boy.role} onChange={(v) => updBoy("role", v)} style={{ color: open ? color.text + "80" : "rgba(255,255,255,0.4)" }} />
            </p>
          </div>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: open ? color.accent : "rgba(255,255,255,0.3)" }} />
        </div>
        {!open && <p className="font-nunito text-xs text-white/30 mt-1">Нажми, чтобы прочитать</p>}
      </button>

      {open && (
        <div className="mt-2 rounded-2xl p-5 animate-fade-in-up"
          style={{ background: color.bg, border: `1.5px solid ${color.border}40` }}>
          <p className="font-nunito text-sm leading-relaxed" style={{ color: color.text }}>
            <EditableText value={boy.message} onChange={(v) => updBoy("message", v)} multiline style={{ color: color.text }} />
          </p>
        </div>
      )}
    </div>
  );
}

function LoveSection() {
  const { content, setContent } = useContent();
  const upd = <K extends keyof ContentType>(key: K, val: ContentType[K]) =>
    setContent((p) => ({ ...p, [key]: val }));

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#1A0530 0%,#2D0A4E 40%,#1A1050 80%,#0A1A30 100%)" }}
    >
      {/* Stars */}
      {Array.from({ length: 35 }, (_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{
          width: 1.5 + (i % 3),
          height: 1.5 + (i % 3),
          background: "white",
          left: `${(i * 2.9) % 100}%`,
          top: `${(i * 3.1) % 100}%`,
          opacity: 0.2 + (i % 5) * 0.12,
          animation: `sparkle ${2 + (i % 3)}s ${(i % 4) * 0.5}s ease-in-out infinite`,
        }} />
      ))}

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="font-pacifico mb-8 animate-neon"
          style={{ fontSize: "clamp(3rem,10vw,6rem)", color: "#FF6EB4" }}>
          <EditableText value={content.loveHeading} onChange={(v) => upd("loveHeading", v)} style={{ color: "#FF6EB4" }} />
        </div>

        <div className="rounded-3xl p-8 md:p-12 mb-12 text-left"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,110,180,0.3)",
            boxShadow: "0 0 60px rgba(255,110,180,0.1),inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <p className="font-nunito text-white/90 text-xl leading-relaxed mb-6">
            <EditableText value={content.lovePara1} onChange={(v) => upd("lovePara1", v)} multiline style={{ color: "rgba(255,255,255,0.9)" }} />
          </p>
          <p className="font-nunito text-white/75 text-lg leading-relaxed mb-6">
            <EditableText value={content.lovePara2} onChange={(v) => upd("lovePara2", v)} multiline style={{ color: "rgba(255,255,255,0.75)" }} />
          </p>
          <p className="font-caveat text-2xl" style={{ color: "#FF9EE0" }}>
            <EditableText value={content.loveSign} onChange={(v) => upd("loveSign", v)} style={{ color: "#FF9EE0" }} />
          </p>
        </div>

        <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-6" style={{ color: "#C084FC" }}>
          <EditableText value={content.boysLabel} onChange={(v) => upd("boysLabel", v)} style={{ color: "#C084FC" }} />
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.boys.map((_, i) => <BoyCard key={i} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Background Photo Upload ──────────────────────────────────
function BgPhotoUpload({
  onImage,
  imgSrc,
  hint,
}: {
  onImage: (src: string) => void;
  imgSrc: string | null;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className="absolute z-20 flex items-center gap-2 rounded-full px-4 py-2 shadow-xl transition-all hover:scale-105 active:scale-95"
      style={{
        top: 16,
        left: 16,
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(255,255,255,0.45)",
        color: "white",
      }}
      title={hint}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <Icon name={imgSrc ? "ImagePlus" : "Camera"} size={15} className="text-white" />
      <span className="font-nunito text-xs font-semibold">{imgSrc ? "Сменить фото" : hint}</span>
    </button>
  );
}

// ─── SECTION 4: SEA ───────────────────────────────────────────
function SeaSection() {
  const { content, setContent } = useContent();
  const upd = <K extends keyof ContentType>(key: K, val: ContentType[K]) =>
    setContent((p) => ({ ...p, [key]: val }));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [bgImg, setBgImg] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setOffset(-rect.top * 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden"
      style={{ minHeight: "70vh" }}>

      {/* Background layer */}
      <div
        className="absolute inset-0"
        style={{
          background: bgImg
            ? `url(${bgImg}) center/cover no-repeat`
            : "linear-gradient(180deg,#0A4A7A 0%,#0B6FAD 35%,#1A9EDD 65%,#4EC8FF 100%)",
        }}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0" style={{ background: "rgba(10,30,60,0.45)" }} />

      {/* Upload button */}
      <BgPhotoUpload onImage={setBgImg} imgSrc={bgImg} hint="Добавить фото на фон" />

      {/* Parallax clouds — only when no custom photo */}
      {!bgImg && (
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(${offset}px)` }}>
          {[{ x: 5, y: 8, w: 60 }, { x: 22, y: 15, w: 90 }, { x: 45, y: 5, w: 110 }, { x: 65, y: 12, w: 75 }, { x: 82, y: 8, w: 95 }].map((c, i) => (
            <div key={i} className="absolute rounded-full opacity-90" style={{
              left: `${c.x}%`, top: `${c.y}%`,
              width: c.w, height: c.w * 0.55,
              background: "white", filter: "blur(2px)",
              animation: `float ${5 + i}s ${i * 0.5}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32">
        <h2 className="font-pacifico text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
          <EditableText value={content.seaTitle} onChange={(v) => upd("seaTitle", v)} style={{ color: "white" }} />
        </h2>
        <p className="font-nunito text-lg md:text-xl text-white/90 max-w-xl leading-relaxed font-semibold">
          <EditableText value={content.seaSubtitle} onChange={(v) => upd("seaSubtitle", v)} multiline style={{ color: "rgba(255,255,255,0.9)" }} />
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,40 C180,70 360,10 540,40 C720,70 900,10 1080,40 C1260,70 1380,30 1440,40 L1440,80 L0,80 Z" fill="#F0E5FF" />
        </svg>
      </div>
    </section>
  );
}

// ─── SECTION 5: TREASURE MAP ──────────────────────────────────
function TreasureMapSection() {
  const { content, setContent } = useContent();
  const upd = <K extends keyof ContentType>(key: K, val: ContentType[K]) =>
    setContent((p) => ({ ...p, [key]: val }));
  const updPlace = (i: number, field: "label" | "desc", val: string) =>
    setContent((p) => {
      const mapPlaces = p.mapPlaces.map((pl, idx) => idx === i ? { ...pl, [field]: val } : pl);
      return { ...p, mapPlaces };
    });

  const [activePlace, setActivePlace] = useState<number | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [mapBgImg, setMapBgImg] = useState<string | null>(null);

  const openChest = () => {
    if (chestOpen) return;
    setChestOpen(true);
    setTimeout(() => setShowFinal(true), 600);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#F0E5FF 0%,#FFE8F5 50%,#FFF8E5 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#B57BFF" }}>
            Интерактивная карта
          </p>
          <h2 className="font-pacifico text-4xl md:text-5xl mb-4" style={{ color: "#7C3AED" }}>
            <EditableText value={content.mapTitle} onChange={(v) => upd("mapTitle", v)} style={{ color: "#7C3AED" }} />
          </h2>
          <p className="font-nunito text-gray-500 max-w-lg mx-auto">
            <EditableText value={content.mapSubtitle} onChange={(v) => upd("mapSubtitle", v)} style={{ color: "#6b7280" }} />
          </p>
        </div>

        {/* Map */}
        <div className="relative rounded-3xl overflow-hidden mb-8"
          style={{
            border: "4px solid #C8960C",
            minHeight: 420,
            boxShadow: "0 20px 60px rgba(200,150,12,0.2),inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* Background — custom photo or parchment gradient */}
          <div className="absolute inset-0"
            style={{
              background: mapBgImg
                ? `url(${mapBgImg}) center/cover no-repeat`
                : "linear-gradient(140deg,#FFF6E0 0%,#FFECB3 40%,#FFE082 70%,#FFD54F 100%)",
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0"
            style={{ background: mapBgImg ? "rgba(255,240,180,0.55)" : "transparent" }} />

          {/* Parchment texture dots — only without photo */}
          {!mapBgImg && (
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#8B6914 1px,transparent 0)", backgroundSize: "25px 25px" }} />
          )}

          {/* Upload button for map background */}
          <BgPhotoUpload onImage={setMapBgImg} imgSrc={mapBgImg} hint="Добавить фото на карту" />

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-center">
            <span className="font-caveat text-xl font-bold px-5 py-1.5 rounded-full"
              style={{ background: "rgba(139,105,20,0.25)", color: "#5D3A00", border: "1px solid rgba(139,105,20,0.35)" }}>
              ✦ Карта Приключений ✦
            </span>
          </div>

          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {[
              "M 14% 28% Q 35% 8% 66% 18%",
              "M 66% 18% Q 82% 38% 76% 64%",
              "M 76% 64% Q 52% 82% 18% 68%",
              "M 18% 68% Q 8% 48% 14% 28%",
            ].map((d, i) => (
              <path key={i} d={d} stroke="#8B6914" strokeWidth="1.5" strokeDasharray="10,7" fill="none" opacity="0.6" />
            ))}
          </svg>

          {content.mapPlaces.map((place, pi) => (
            <button
              key={place.id}
              onClick={() => setActivePlace(activePlace === place.id ? null : place.id)}
              className="absolute z-10 flex flex-col items-center transition-all duration-200 hover:scale-110"
              style={{ left: `${place.x}%`, top: `${place.y}%`, transform: "translate(-50%,-50%)" }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-lg"
                style={{ background: "white", border: `3px solid ${place.color}`, boxShadow: activePlace === place.id ? `0 0 0 4px ${place.color}40` : `0 4px 12px ${place.color}40` }}>
                {place.emoji}
              </div>
              <span className="font-caveat font-bold mt-1 px-2 py-0.5 rounded-full text-white text-center"
                style={{ background: place.color, fontSize: 9, maxWidth: 72, lineHeight: 1.3 }}>
                {place.label}
              </span>

              {activePlace === place.id && (
                <div className="absolute z-20 w-52 p-4 rounded-2xl shadow-2xl animate-fade-in-up text-left"
                  style={{ bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "white", border: `2px solid ${place.color}60` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{place.emoji}</span>
                    <span className="font-nunito font-bold text-xs" style={{ color: place.color }}>
                      <EditableText value={place.label} onChange={(v) => updPlace(pi, "label", v)} style={{ color: place.color }} />
                    </span>
                  </div>
                  <p className="font-nunito text-xs text-gray-600 leading-relaxed">
                    <EditableText value={place.desc} onChange={(v) => updPlace(pi, "desc", v)} multiline style={{ color: "#4b5563" }} />
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                    style={{ background: "white", border: `2px solid ${place.color}60`, borderTop: "none", borderLeft: "none" }} />
                </div>
              )}
            </button>
          ))}

          {/* Chest */}
          <button onClick={openChest} className="absolute z-10 flex flex-col items-center transition-all duration-300"
            style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
            <div className={`select-none transition-all duration-500 ${chestOpen ? "scale-150" : "animate-treasure hover:scale-110"}`}
              style={{ fontSize: "3rem", filter: chestOpen ? "drop-shadow(0 0 16px #FFD700)" : "none" }}>
              {chestOpen ? "💰" : "🎁"}
            </div>
            {!chestOpen && (
              <span className="font-caveat text-xs font-bold mt-1" style={{ color: "#5D3A00" }}>Нажми!</span>
            )}
          </button>
        </div>

        {showFinal && (
          <div className="rounded-3xl p-8 md:p-12 text-center animate-fade-in-up shadow-2xl"
            style={{ background: "linear-gradient(135deg,#FF6EB4 0%,#B57BFF 50%,#7EC8FF 100%)", boxShadow: "0 20px 60px rgba(181,123,255,0.4)" }}>
            <div className="text-5xl mb-5">💝</div>
            <h3 className="font-pacifico text-3xl md:text-4xl text-white mb-5">Ты нашла главное сокровище!</h3>
            <p className="font-nunito text-lg text-white/95 max-w-xl mx-auto leading-relaxed mb-6">
              <EditableText value={content.chestMessage} onChange={(v) => upd("chestMessage", v)} multiline style={{ color: "rgba(255,255,255,0.95)" }} />
            </p>
            <div className="flex justify-center gap-3 text-3xl select-none">
              {["💗", "🌸", "⭐", "🎊", "💜", "🌟", "💝"].map((e, i) => (
                <span key={i} style={{ animation: `float ${2 + i * 0.2}s ${i * 0.1}s ease-in-out infinite` }}>{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── SECTION 6: FINALE ───────────────────────────────────────
const BALLOON_DATA = [
  { x: 3, dur: 7, delay: 0, e: "🎈" }, { x: 12, dur: 9, delay: 0.6, e: "🎀" },
  { x: 23, dur: 8, delay: 1.2, e: "🎈" }, { x: 35, dur: 10, delay: 0.3, e: "💜" },
  { x: 48, dur: 6, delay: 1.8, e: "🎈" }, { x: 60, dur: 9, delay: 0.9, e: "🌟" },
  { x: 72, dur: 7, delay: 0.4, e: "🎈" }, { x: 83, dur: 11, delay: 1.4, e: "🎊" },
  { x: 93, dur: 8, delay: 2, e: "🎈" },
];

function FinalSection() {
  const { content, setContent } = useContent();
  const upd = <K extends keyof ContentType>(key: K, val: ContentType[K]) =>
    setContent((p) => ({ ...p, [key]: val }));
  const [launched, setLaunched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const launch = () => {
    setLaunched(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
  };

  return (
    <section className="relative py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F0E5FF 0%,#FFE5F5 40%,#FFF8E5 70%,#E5F8FF 100%)", minHeight: "85vh" }}>
      <Confetti active={showConfetti} />

      {launched && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {BALLOON_DATA.map((b, i) => (
            <div key={i} className="absolute select-none"
              style={{ left: `${b.x}%`, bottom: "-80px", fontSize: "3.5rem", animation: `balloonFloat ${b.dur}s ${b.delay}s linear infinite` }}>
              {b.e}
            </div>
          ))}
        </div>
      )}

      <div className="relative max-w-2xl mx-auto text-center px-4 z-10">
        <div className="text-7xl mb-8" style={{ animation: "float 3.5s ease-in-out infinite" }}>🎉</div>

        <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-4" style={{ color: "#B57BFF" }}>Финальные слова</p>
        <h2 className="font-pacifico mb-10" style={{ fontSize: "clamp(2.2rem,8vw,4.5rem)", color: "#FF6EB4", lineHeight: 1.15 }}>
          <EditableText value={content.finaleTitle} onChange={(v) => upd("finaleTitle", v)} style={{ color: "#FF6EB4" }} />
        </h2>

        <div className="rounded-3xl p-8 md:p-12 mb-10 text-left shadow-xl"
          style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,110,180,0.25)" }}>
          <p className="font-nunito text-gray-700 text-lg leading-relaxed mb-5">
            Дорогая <span className="font-bold shimmer-text" style={{ fontSize: "1.1em" }}>{content.friendName}</span>,
          </p>
          <p className="font-caveat text-2xl leading-relaxed text-purple-700 mb-4">
            <EditableText value={content.finalePara1} onChange={(v) => upd("finalePara1", v)} multiline style={{ color: "#6d28d9" }} />
          </p>
          <p className="font-nunito text-gray-600 text-base leading-relaxed">
            <EditableText value={content.finalePara2} onChange={(v) => upd("finalePara2", v)} multiline style={{ color: "#4b5563" }} />
          </p>
        </div>

        {!launched ? (
          <button onClick={launch} className="font-pacifico text-xl text-white px-10 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#FF6EB4 0%,#B57BFF 50%,#7EC8FF 100%)", boxShadow: "0 12px 40px rgba(255,110,180,0.4)" }}>
            🎈 Запустить шары в небо!
          </button>
        ) : (
          <div className="animate-fade-in-up">
            <div className="text-4xl mb-4 select-none" style={{ animation: "float 2s ease-in-out infinite" }}>🎈🎈🎈</div>
            <p className="font-pacifico text-2xl" style={{ color: "#FF6EB4" }}>Лети высоко! ✨</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function Index() {
  const [content, setContent] = useState<ContentType>(CONTENT);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const toggleMusic = useCallback(() => setMusicPlaying((p) => !p), []);

  return (
    <ContentCtx.Provider value={{ content, setContent }}>
      <div className="relative min-h-screen font-nunito">
        <MusicControl playing={musicPlaying} onToggle={toggleMusic} />
        <HeroSection />
        <PhotoSection />
        <LoveSection />
        <SeaSection />
        <TreasureMapSection />
        <FinalSection />
        <footer className="py-10 text-center" style={{ background: "#F0E5FF" }}>
          <p className="font-pacifico text-xl mb-1" style={{ color: "#B57BFF" }}>Сделано с любовью 💗</p>
          <p className="font-nunito text-sm text-purple-300">18 лет — только начало твоей истории 🌟</p>
        </footer>
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-xl pointer-events-none select-none"
          style={{ background: "rgba(255,110,180,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,110,180,0.3)" }}>
          <span style={{ fontSize: 13, color: "#FF6EB4", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>✎ Нажми на любой текст, чтобы изменить</span>
        </div>
      </div>
    </ContentCtx.Provider>
  );
}