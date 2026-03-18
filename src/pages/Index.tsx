import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

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

const PHOTO_LABELS = [
  "Наше лучшее лето",
  "Помнишь этот день?",
  "Мы и приключения",
  "На скутерах 🛵",
  "Просто мы",
  "Незабываемый момент",
];

const BOOK_BOYS = [
  {
    name: "[Парень 1]",
    role: "Герой первой главы",
    color: { bg: "#FFF0F7", border: "#FF6EB4", accent: "#FF6EB4", text: "#C0226B" },
    avatar: "🧑‍🎤",
    message: `С днём рождения! Когда я думаю о тебе, я думаю о том, как ты умеешь видеть мир иначе — ярче, теплее, живее. В свои 18 ты уже прошла путь, который многие не пройдут никогда. Будь собой. Это твой главный талант.`,
  },
  {
    name: "[Парень 2]",
    role: "Герой второй главы",
    color: { bg: "#F3EEFF", border: "#B57BFF", accent: "#B57BFF", text: "#6B21A8" },
    avatar: "🧑‍💼",
    message: `Знаешь, что я заметил? Ты из тех, кто делает жизнь вокруг лучше — просто своим присутствием. 18 лет — это не просто число. Это начало твоей настоящей истории. Пусть она будет достойна тебя.`,
  },
  {
    name: "[Парень 3]",
    role: "Герой третьей главы",
    color: { bg: "#EEF7FF", border: "#7EC8FF", accent: "#2563EB", text: "#1E40AF" },
    avatar: "🧑‍🎨",
    message: `Ты читаешь книги о нас — но сама ты интереснее любого персонажа. В тебе есть что-то настоящее: сила, нежность и та редкая честность, которая сегодня на вес золота. С днём рождения, живи громко.`,
  },
];

const MAP_PLACES = [
  { id: 1, emoji: "💝", label: "Остров Нашей Дружбы", x: 14, y: 28, color: "#FF6EB4", desc: "Место, где началась наша история. Самый ценный остров в мире — здесь нет ничего лишнего, только мы." },
  { id: 2, emoji: "🏔️", label: 'Горы "18 лет"', x: 66, y: 18, color: "#B57BFF", desc: "Ты покорила эту вершину. Сюда доходят только сильные — и ты доказала, что ты именно такая." },
  { id: 3, emoji: "🚙", label: "Бухта Роскошных Джипов", x: 76, y: 64, color: "#2563EB", desc: "Сюда мы едем за свободой. Открытая дорога, ветер и лучшая компания — всё, что нужно для счастья." },
  { id: 4, emoji: "🛵", label: "Пляж Скутеров и Цветов", x: 18, y: 68, color: "#059669", desc: "Наш пляж. Скутеры, солёный воздух, закат и смех. Сюда я хочу вернуться снова и снова." },
];

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
function PhotoSlot({ label, size = "normal" }: { label: string; index: number; size?: "normal" | "large" }) {
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
            <p className="font-caveat text-white text-lg font-semibold">{label}</p>
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
            <p className="font-nunito font-semibold text-sm" style={{ color: "#9B59B6" }}>{label}</p>
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
  const [showConfetti, setShowConfetti] = useState(true);

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
          С Днём Рождения
        </p>
        <h1 className="font-pacifico mb-4" style={{ fontSize: "clamp(2.2rem,8vw,4.5rem)", color: "#FF6EB4", lineHeight: 1.15 }}>
          [Имя подруги]
        </h1>
        <div
          className="rounded-2xl px-6 py-4"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,110,180,0.2)" }}
        >
          <p className="font-nunito text-lg text-gray-600 leading-relaxed">
            Восемнадцать лет — это не просто дата. Это момент, когда ты становишься собой.
            Всё лучшее только начинается. 🌟
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
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#FAF0FF 0%,#FFF0F8 50%,#F0F8FF 100%)" }}
    >
      {/* Animated road */}
      <div className="absolute left-0 right-0 overflow-hidden pointer-events-none select-none" style={{ bottom: 60, height: 40 }}>
        <div style={{ width: "100%", height: 2, background: "repeating-linear-gradient(90deg,#D4B0FF 0px,#D4B0FF 20px,transparent 20px,transparent 40px)", position: "absolute", top: "50%" }} />
        <div className="absolute text-2xl" style={{ animation: "carDrive 14s linear infinite", bottom: 0 }}>🛵</div>
        <div className="absolute text-2xl" style={{ animation: "carDrive 22s 4s linear infinite", bottom: 0 }}>🚗</div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#B57BFF" }}>
            Наша история
          </p>
          <h2 className="font-pacifico text-4xl md:text-5xl mb-4" style={{ color: "#7C3AED" }}>
            Как я была рядом с тобой
          </h2>
          <p className="font-nunito text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
            Каждый момент нашей дружбы — это отдельная глава.
            Нажми на любую рамку и загрузи наше совместное фото.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 md:col-span-5">
            <PhotoSlot label={PHOTO_LABELS[0]} index={0} size="large" />
          </div>
          <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <PhotoSlot label={PHOTO_LABELS[1]} index={1} />
              <PhotoSlot label={PHOTO_LABELS[2]} index={2} />
            </div>
            <PhotoSlot label={PHOTO_LABELS[3]} index={3} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PhotoSlot label={PHOTO_LABELS[4]} index={4} />
          <PhotoSlot label={PHOTO_LABELS[5]} index={5} />
        </div>

        <p className="font-caveat text-center text-xl mt-8" style={{ color: "#C084FC" }}>
          💜 Нажми на любую рамку — загрузи фото с телефона или компьютера
        </p>
      </div>
    </section>
  );
}

// ─── SECTION 3: LOVE + BOYS ──────────────────────────────────
function BoyCard({ boy }: { boy: typeof BOOK_BOYS[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: open ? boy.color.bg : "rgba(255,255,255,0.07)",
          border: `1.5px solid ${open ? boy.color.border : "rgba(255,255,255,0.15)"}`,
          boxShadow: open ? `0 12px 40px ${boy.color.accent}30` : "none",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{boy.avatar}</span>
          <div className="flex-1">
            <p className="font-pacifico text-base" style={{ color: open ? boy.color.accent : "white" }}>{boy.name}</p>
            <p className="font-nunito text-xs" style={{ color: open ? boy.color.text + "80" : "rgba(255,255,255,0.4)" }}>{boy.role}</p>
          </div>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: open ? boy.color.accent : "rgba(255,255,255,0.3)" }} />
        </div>
        {!open && <p className="font-nunito text-xs text-white/30 mt-1">Нажми, чтобы прочитать</p>}
      </button>

      {open && (
        <div className="mt-2 rounded-2xl p-5 animate-fade-in-up"
          style={{ background: boy.color.bg, border: `1.5px solid ${boy.color.border}40` }}>
          <p className="font-nunito text-sm leading-relaxed" style={{ color: boy.color.text }}>{boy.message}</p>
        </div>
      )}
    </div>
  );
}

function LoveSection() {
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
        <div className="font-pacifico mb-8 select-none animate-neon"
          style={{ fontSize: "clamp(3rem,10vw,6rem)", color: "#FF6EB4" }}>
          Я тебя очень люблю ❤️
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
            Когда я думаю о тебе, я думаю о человеке, который умеет дружить по-настоящему.
            Не когда удобно — а всегда. Ты из тех редких людей, рядом с которыми хочется
            быть лучше.
          </p>
          <p className="font-nunito text-white/75 text-lg leading-relaxed mb-6">
            Твои 18 — это не конец юности. Это первый день твоей взрослой жизни, которую
            ты будешь строить сама, по своим правилам. И я знаю — у тебя получится именно
            так, как ты мечтаешь.
          </p>
          <p className="font-caveat text-2xl" style={{ color: "#FF9EE0" }}>
            С любовью, твоя подруга 🌸
          </p>
        </div>

        <p className="font-nunito text-sm font-bold tracking-widest uppercase mb-6" style={{ color: "#C084FC" }}>
          А ещё тебя поздравляют герои твоей книги
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BOOK_BOYS.map((boy, i) => <BoyCard key={i} boy={boy} />)}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: SEA ───────────────────────────────────────────
function SeaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

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
      style={{ background: "linear-gradient(180deg,#0A4A7A 0%,#0B6FAD 35%,#1A9EDD 65%,#4EC8FF 100%)", minHeight: "70vh" }}>

      {/* Parallax clouds */}
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

      {/* Sun */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 80, height: 80, background: "radial-gradient(circle,#FFE566,#FFB347)", top: "8%", right: "12%",
          boxShadow: "0 0 40px #FFD700,0 0 80px rgba(255,183,71,0.4)", animation: "float 6s ease-in-out infinite" }} />

      {/* Jeep */}
      <div className="absolute pointer-events-none select-none"
        style={{ bottom: "28%", fontSize: "clamp(1.8rem,4vw,3rem)", animation: "carDrive 18s linear infinite", whiteSpace: "nowrap" }}>
        🚙💨&nbsp;🌺🎁🌸🎊
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="text-6xl mb-6" style={{ animation: "float 3s ease-in-out infinite" }}>🌊</div>
        <h2 className="font-pacifico text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">Море зовёт тебя!</h2>
        <p className="font-nunito text-lg md:text-xl text-white/85 max-w-xl leading-relaxed font-semibold mb-8">
          Роскошный джип уже везёт подарки, цветы и все твои мечты прямо к берегу.
          В 18 горизонт — не конец пути, а его начало.
        </p>
        <div className="flex gap-6 text-4xl select-none">
          {["🐚", "🦀", "🌺", "🐬", "⭐", "🌊"].map((e, i) => (
            <span key={i} style={{ animation: `float ${2.5 + i * 0.25}s ${i * 0.15}s ease-in-out infinite` }}>{e}</span>
          ))}
        </div>
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
  const [activePlace, setActivePlace] = useState<number | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

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
            🗺️ Карта наших сокровищ
          </h2>
          <p className="font-nunito text-gray-500 max-w-lg mx-auto">
            Нажми на каждую метку — и узнай, что она значит. А потом найди сундук.
          </p>
        </div>

        {/* Map */}
        <div className="relative rounded-3xl overflow-hidden mb-8"
          style={{
            background: "linear-gradient(140deg,#FFF6E0 0%,#FFECB3 40%,#FFE082 70%,#FFD54F 100%)",
            border: "4px solid #C8960C",
            minHeight: 420,
            boxShadow: "0 20px 60px rgba(200,150,12,0.2),inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#8B6914 1px,transparent 0)", backgroundSize: "25px 25px" }} />

          <div className="absolute top-3 left-3 text-2xl opacity-40 rotate-[-15deg]">🌿</div>
          <div className="absolute top-3 right-3 text-2xl opacity-40 rotate-[15deg]">🌿</div>
          <div className="absolute bottom-3 left-3 text-xl opacity-30 rotate-[10deg]">🌿</div>
          <div className="absolute bottom-3 right-3 text-xl opacity-30 rotate-[-10deg]">🌿</div>

          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-center">
            <span className="font-caveat text-xl font-bold px-5 py-1.5 rounded-full"
              style={{ background: "rgba(139,105,20,0.2)", color: "#5D3A00", border: "1px solid rgba(139,105,20,0.3)" }}>
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
              <path key={i} d={d} stroke="#8B6914" strokeWidth="1.5" strokeDasharray="10,7" fill="none" opacity="0.5" />
            ))}
          </svg>

          {MAP_PLACES.map((place) => (
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
                    <span className="font-nunito font-bold text-xs" style={{ color: place.color }}>{place.label}</span>
                  </div>
                  <p className="font-nunito text-xs text-gray-600 leading-relaxed">{place.desc}</p>
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

          <div className="absolute bottom-0 left-0 right-0 h-14 opacity-40"
            style={{ background: "linear-gradient(0deg,#3B9EDD,transparent)" }} />
        </div>

        {showFinal && (
          <div className="rounded-3xl p-8 md:p-12 text-center animate-fade-in-up shadow-2xl"
            style={{ background: "linear-gradient(135deg,#FF6EB4 0%,#B57BFF 50%,#7EC8FF 100%)", boxShadow: "0 20px 60px rgba(181,123,255,0.4)" }}>
            <div className="text-5xl mb-5">💝</div>
            <h3 className="font-pacifico text-3xl md:text-4xl text-white mb-5">Ты нашла главное сокровище!</h3>
            <p className="font-nunito text-lg text-white/95 max-w-xl mx-auto leading-relaxed mb-6">
              Это — наша дружба. Она настоящая, она выдержала всё и она будет рядом, сколько бы лет
              ни прошло. Ты самый ценный человек в моей жизни. С днём рождения, моя дорогая.
              Я горжусь тем, какой ты стала. 🌟
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
          С Днём Рождения!
        </h2>

        <div className="rounded-3xl p-8 md:p-12 mb-10 text-left shadow-xl"
          style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(255,110,180,0.25)" }}>
          <p className="font-nunito text-gray-700 text-lg leading-relaxed mb-5">
            Дорогая <span className="font-bold shimmer-text" style={{ fontSize: "1.1em" }}>[Имя подруги]</span>,
          </p>
          <p className="font-caveat text-2xl leading-relaxed text-purple-700 mb-4">
            Ты из тех людей, которые появляются в жизни раз — и остаются навсегда. Рядом с тобой
            хочется смеяться, мечтать и делать всё по-настоящему.
          </p>
          <p className="font-nunito text-gray-600 text-base leading-relaxed">
            Сегодня тебе 18. Это значит — ты стоишь на пороге жизни, которая уже ждёт тебя
            с распростёртыми объятиями. Пусть каждый день приносит что-то новое: море,
            скутеры, джипы, цветы и людей, которые умеют ценить тебя так же, как ценю я.
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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const toggleMusic = useCallback(() => setMusicPlaying((p) => !p), []);

  return (
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
    </div>
  );
}
