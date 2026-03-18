import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── Confetti ────────────────────────────────────────────────
const COLORS = ["#FF6EB4", "#B57BFF", "#7EC8FF", "#FFB347", "#7FFFB5", "#FFD700", "#FF7F7F"];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: "circle" | "square" | "triangle";
}

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const items: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 10,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as Particle["shape"],
    }));
    setParticles(items);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.shape === "triangle" ? 0 : p.size,
            height: p.shape === "triangle" ? 0 : p.size,
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            backgroundColor: p.shape !== "triangle" ? p.color : undefined,
            borderRadius: p.shape === "circle" ? "50%" : undefined,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating Hearts ─────────────────────────────────────────
function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: i * 0.4,
      size: 16 + Math.random() * 24,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-pink-400"
          style={{
            left: `${h.x}%`,
            bottom: "10%",
            fontSize: h.size,
            animation: `heartFloat 3s ${h.delay}s ease-out infinite`,
          }}
        >
          💗
        </div>
      ))}
    </div>
  );
}

// ─── Balloon Field ────────────────────────────────────────────
const BALLOON_DATA = [
  { x: 5, duration: 8, delay: 0, emoji: "🎈" },
  { x: 15, duration: 10, delay: 1, emoji: "🎀" },
  { x: 25, duration: 7, delay: 2, emoji: "🎈" },
  { x: 40, duration: 9, delay: 0.5, emoji: "🎊" },
  { x: 55, duration: 11, delay: 1.5, emoji: "🎈" },
  { x: 68, duration: 8, delay: 3, emoji: "⭐" },
  { x: 80, duration: 10, delay: 0.8, emoji: "🎈" },
  { x: 90, duration: 7, delay: 2.2, emoji: "💜" },
];

function BalloonField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BALLOON_DATA.map((b, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${b.x}%`,
            bottom: "-60px",
            fontSize: "3rem",
            animation: `balloonFloat ${b.duration}s ${b.delay}s linear infinite`,
          }}
        >
          {b.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── Music Control ───────────────────────────────────────────
function MusicControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
      style={{ background: "linear-gradient(135deg, #FF6EB4, #B57BFF)" }}
      title={playing ? "Выключить музыку" : "Включить музыку"}
    >
      <span className="text-white text-xl">{playing ? "🎵" : "🔇"}</span>
    </button>
  );
}

// ─── Section 1: Hero ─────────────────────────────────────────
function HeroSection() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(t);
  }, []);

  const sparkles = ["✨", "⭐", "💫", "🌟", "✨", "⭐"];

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #FFE5F5 0%, #F0E5FF 30%, #E5F5FF 60%, #FFFDE5 100%)",
      }}
    >
      <Confetti active={showConfetti} />
      <FloatingHearts />

      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none text-2xl"
          style={{
            left: `${10 + i * 15}%`,
            top: `${10 + (i % 3) * 20}%`,
            animation: `sparkle ${2 + i * 0.3}s ${i * 0.5}s ease-in-out infinite`,
          }}
        >
          {s}
        </div>
      ))}

      {/* Big 18 */}
      <div className="relative mb-6 animate-pulse18 select-none">
        <div
          className="font-pacifico leading-none"
          style={{
            fontSize: "clamp(8rem, 25vw, 18rem)",
            background: "linear-gradient(135deg, #FF6EB4 0%, #B57BFF 30%, #FFD700 60%, #FF6EB4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 8px 30px rgba(255,110,180,0.4))",
          }}
        >
          18
        </div>
        <div className="absolute -top-8 -left-8 text-4xl animate-bounce">🎈</div>
        <div className="absolute -top-8 -right-8 text-4xl animate-bounce" style={{ animationDelay: "0.3s" }}>🎈</div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-3xl animate-bounce" style={{ animationDelay: "0.6s" }}>🎊</div>
      </div>

      {/* Photo circle */}
      <div
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full mb-8 overflow-hidden shadow-2xl"
        style={{
          animation: "float 4s ease-in-out infinite",
          border: "4px solid transparent",
          background: "linear-gradient(white,white) padding-box, linear-gradient(45deg,#FF6EB4,#B57BFF,#7EC8FF,#7FFFB5,#FFB347) border-box",
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center text-7xl"
          style={{ background: "linear-gradient(135deg, #FFE5F5, #F0E5FF)" }}
        >
          👸
        </div>
        <div className="absolute -top-2 -right-2 text-3xl">💎</div>
        <div className="absolute -bottom-2 -left-2 text-3xl">🌸</div>
      </div>

      {/* Title */}
      <div className="text-center px-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <h1 className="font-pacifico text-4xl md:text-6xl mb-3" style={{ color: "#FF6EB4" }}>
          С Днём Рождения,
        </h1>
        <h2 className="font-pacifico text-5xl md:text-7xl shimmer-text mb-6">
          [Имя подруги]!
        </h2>
        <p className="font-nunito text-xl md:text-2xl font-semibold text-purple-500 max-w-lg mx-auto">
          Тебе исполняется 18 — и весь мир у твоих ног! 🌍✨
        </p>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce-soft text-pink-400">
        <span className="font-caveat text-lg">Листай вниз</span>
        <Icon name="ChevronDown" size={24} />
      </div>
    </section>
  );
}

// ─── Section 2: Photo Slider ──────────────────────────────────
const PHOTO_SLOTS = [
  { emoji: "🏖️", label: "На море", color: "#E5F5FF" },
  { emoji: "🎭", label: "Наши приключения", color: "#FFE5F5" },
  { emoji: "🎂", label: "День рождения", color: "#FFFDE5" },
  { emoji: "🛵", label: "На скутерах", color: "#E5FFE5" },
  { emoji: "🌸", label: "Прогулки", color: "#F5E5FF" },
  { emoji: "🎪", label: "Веселье", color: "#FFE5E5" },
];

const ROTATIONS = [-3, 2, -1, 3, -2, 1];

function PhotoSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + PHOTO_SLOTS.length) % PHOTO_SLOTS.length);
  const next = () => setCurrent((c) => (c + 1) % PHOTO_SLOTS.length);

  const visible = [
    PHOTO_SLOTS[(current - 1 + PHOTO_SLOTS.length) % PHOTO_SLOTS.length],
    PHOTO_SLOTS[current],
    PHOTO_SLOTS[(current + 1) % PHOTO_SLOTS.length],
  ];

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FFF0FA 0%, #F5EEFF 50%, #EEF5FF 100%)" }}
    >
      <div
        className="absolute top-1/2 text-4xl pointer-events-none select-none"
        style={{ animation: "carDrive 12s linear infinite" }}
      >
        🛵
      </div>
      <div
        className="absolute top-1/3 text-3xl pointer-events-none select-none"
        style={{ animation: "carDrive 18s 3s linear infinite" }}
      >
        🚗
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="font-pacifico text-4xl md:text-5xl text-center mb-4" style={{ color: "#B57BFF" }}>
          Как мы были вместе…
        </h2>
        <p className="font-caveat text-2xl text-center text-pink-400 mb-12">
          🌸 Лучшие моменты нашей дружбы 🌸
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            style={{ background: "linear-gradient(135deg, #FF6EB4, #B57BFF)" }}
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          <div className="flex gap-4 items-center">
            {visible.map((photo, i) => (
              <div
                key={`${current}-${i}`}
                className="polaroid transition-all duration-500 cursor-pointer hover:scale-105"
                style={{
                  transform: `rotate(${i === 1 ? 0 : ROTATIONS[(current + i) % ROTATIONS.length]}deg) scale(${i === 1 ? 1.1 : 0.85})`,
                  zIndex: i === 1 ? 10 : 5,
                  opacity: i === 1 ? 1 : 0.7,
                  width: i === 1 ? "200px" : "160px",
                }}
                onClick={i === 0 ? prev : i === 2 ? next : undefined}
              >
                <div
                  className="w-full aspect-square flex items-center justify-center rounded"
                  style={{ background: photo.color, fontSize: "4rem" }}
                >
                  {photo.emoji}
                </div>
                <p className="font-caveat text-center mt-2 text-gray-600 text-sm">{photo.label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            style={{ background: "linear-gradient(135deg, #FF6EB4, #B57BFF)" }}
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          {PHOTO_SLOTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "#FF6EB4" : "#E8C8FF",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <p className="font-caveat text-center text-lg text-purple-400 mt-6">
          💝 Скажи мне — загрузим твои настоящие фото!
        </p>
      </div>
    </section>
  );
}

// ─── Section 3: Book Boys ─────────────────────────────────────
const BOOK_BOYS = [
  {
    name: "[Парень 1]",
    emoji: "🧑‍🎤",
    color: "linear-gradient(135deg, #FFE5F5, #FFB8E0)",
    accent: "#FF6EB4",
    message:
      "С днём рождения! Ты — самый яркий персонаж в любой истории. В твои 18 пусть каждая страница жизни будет захватывающей. Ты заслуживаешь всего лучшего! 💗",
    icon: "🌹",
  },
  {
    name: "[Парень 2]",
    emoji: "🧑‍💼",
    color: "linear-gradient(135deg, #EDE5FF, #C8A8FF)",
    accent: "#B57BFF",
    message:
      "18 лет — это только начало твоей великой истории. Ты умеешь видеть красоту там, где другие проходят мимо. Пусть этот год принесёт тебе море, приключения и всё то, о чём ты мечтаешь! ✨",
    icon: "💜",
  },
  {
    name: "[Парень 3]",
    emoji: "🧑‍🎨",
    color: "linear-gradient(135deg, #E5F0FF, #A8C8FF)",
    accent: "#7EC8FF",
    message:
      "Дорогая именинница! Ты как любимая книга — к тебе хочется возвращаться снова и снова. Пусть мечты сбываются быстрее, чем ты успеваешь их загадать! 🌟",
    icon: "⭐",
  },
];

function BookBoysSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #EEF5FF 0%, #F5EEFF 50%, #FFF0FA 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["💗", "💜", "💙", "💛", "💗", "💜"].map((h, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${10 + i * 16}%`,
              top: `${20 + (i % 2) * 40}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="font-pacifico text-4xl md:text-5xl mb-4 animate-neon" style={{ color: "#FF6EB4" }}>
            Я тебя очень люблю! 💖
          </h2>
          <p className="font-caveat text-2xl text-purple-500">
            ...и не только я — тебя поздравляют герои твоей книги ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BOOK_BOYS.map((boy, i) => (
            <div key={i} className="relative">
              <button
                className="w-full rounded-3xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
                style={{
                  background: boy.color,
                  border: `2px solid ${boy.accent}40`,
                  boxShadow: activeCard === i ? `0 20px 60px ${boy.accent}40` : "0 8px 30px rgba(0,0,0,0.08)",
                }}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
              >
                <div className="text-6xl mb-3">{boy.emoji}</div>
                <h3 className="font-pacifico text-xl mb-1" style={{ color: boy.accent }}>
                  {boy.name}
                </h3>
                <p className="font-nunito text-sm text-gray-500 mb-2">Нажми, чтобы прочитать 💌</p>
                <div className="text-2xl">{boy.icon}</div>
              </button>

              {activeCard === i && (
                <div
                  className="absolute top-full mt-3 left-0 right-0 rounded-2xl p-5 z-20 animate-fade-in-up shadow-2xl"
                  style={{
                    background: "white",
                    border: `2px solid ${boy.accent}60`,
                  }}
                >
                  <div className="text-2xl mb-2">{boy.icon}</div>
                  <p className="font-nunito text-sm text-gray-700 leading-relaxed">{boy.message}</p>
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                    style={{
                      background: "white",
                      border: `2px solid ${boy.accent}60`,
                      borderBottom: "none",
                      borderRight: "none",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Sea ───────────────────────────────────────────
function SeaSection() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setScrollOffset(-rect.top * 0.3);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #E0F4FF 0%, #BAE6FF 40%, #7EC8FF 80%, #3B9EDD 100%)" }}
    >
      <div
        className="absolute top-8 left-0 right-0 pointer-events-none"
        style={{ transform: `translateY(${scrollOffset * 0.5}px)` }}
      >
        {["☁️", "⛅", "☁️", "☁️"].map((c, i) => (
          <span
            key={i}
            className="absolute text-5xl opacity-70"
            style={{
              left: `${10 + i * 25}%`,
              top: `${i % 2 === 0 ? 0 : 30}px`,
              animation: `float ${4 + i}s ease-in-out infinite`,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div
        className="absolute bottom-32 pointer-events-none select-none"
        style={{ animation: "carDrive 20s linear infinite", fontSize: "3.5rem" }}
      >
        🚙🌺🎁🌸🎊
      </div>

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <div className="text-8xl mb-6 select-none" style={{ animation: "float 3s ease-in-out infinite" }}>
          🌊
        </div>
        <h2 className="font-pacifico text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
          Море зовёт тебя!
        </h2>
        <p className="font-nunito text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-semibold leading-relaxed">
          Роскошный джип уже везёт все подарки, цветы и мечты прямо к твоему берегу.
          В 18 лет горизонт — только начало! 🌅
        </p>
        <div className="flex justify-center gap-4 mt-8 text-4xl select-none">
          {["🐚", "🦀", "🌺", "🐬", "⭐"].map((e, i) => (
            <span
              key={i}
              style={{ animation: `float ${2.5 + i * 0.3}s ${i * 0.2}s ease-in-out infinite` }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 80" className="w-full" style={{ fill: "#F0E5FF" }}>
          <path d="M0,40 Q150,10 300,40 Q450,70 600,40 Q750,10 900,40 Q1050,70 1200,40 L1200,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}

// ─── Section 5: Treasure Map ──────────────────────────────────
const MAP_PLACES = [
  {
    id: 1,
    emoji: "💝",
    label: "Остров дружбы",
    x: 15,
    y: 30,
    color: "#FF6EB4",
    desc: "Здесь живёт наша дружба — самый ценный остров в мире!",
  },
  {
    id: 2,
    emoji: "⛰️",
    label: 'Горы "18 лет"',
    x: 65,
    y: 20,
    color: "#B57BFF",
    desc: "Ты покорила эту вершину! 18 лет — твой лучший подвиг!",
  },
  {
    id: 3,
    emoji: "🚗",
    label: "Бухта джипов",
    x: 75,
    y: 65,
    color: "#7EC8FF",
    desc: "Место, где все мечты о свободе и приключениях сбываются!",
  },
  {
    id: 4,
    emoji: "🛵",
    label: "Пляж скутеров",
    x: 20,
    y: 70,
    color: "#7FFFB5",
    desc: "Наш любимый пляж — скутеры, цветы и бесконечное лето!",
  },
];

function TreasureMapSection() {
  const [activePlace, setActivePlace] = useState<number | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const handleChest = () => {
    if (chestOpen) return;
    setChestOpen(true);
    setTimeout(() => setShowFinal(true), 400);
  };

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F0E5FF 0%, #FFE5F5 50%, #FFFDE5 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-pacifico text-4xl md:text-5xl mb-4" style={{ color: "#B57BFF" }}>
            🗺️ Карта наших сокровищ
          </h2>
          <p className="font-caveat text-2xl text-pink-500">
            Исследуй места наших приключений!
          </p>
        </div>

        {/* Map container */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl animate-map-reveal"
          style={{
            background: "linear-gradient(135deg, #FFF9E6 0%, #FFEFD0 30%, #FFE5C8 60%, #FFD9B0 100%)",
            border: "4px solid #C8A040",
            minHeight: "400px",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, #8B6914 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <span
              className="font-caveat text-xl font-bold px-4 py-1 rounded-full"
              style={{ background: "rgba(200,160,64,0.3)", color: "#6B4A10" }}
            >
              ✦ Карта приключений ✦
            </span>
          </div>

          {/* SVG Routes */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <path d="M 15% 30% Q 35% 10% 65% 20%" stroke="#C8A040" strokeWidth="2" strokeDasharray="8,6" fill="none" opacity="0.6" />
            <path d="M 65% 20% Q 80% 40% 75% 65%" stroke="#C8A040" strokeWidth="2" strokeDasharray="8,6" fill="none" opacity="0.6" />
            <path d="M 75% 65% Q 50% 80% 20% 70%" stroke="#C8A040" strokeWidth="2" strokeDasharray="8,6" fill="none" opacity="0.6" />
            <path d="M 20% 70% Q 10% 50% 15% 30%" stroke="#C8A040" strokeWidth="2" strokeDasharray="8,6" fill="none" opacity="0.6" />
          </svg>

          {/* Map Places */}
          {MAP_PLACES.map((place) => (
            <button
              key={place.id}
              onClick={() => setActivePlace(activePlace === place.id ? null : place.id)}
              className="absolute z-10 flex flex-col items-center transition-all duration-200 hover:scale-125"
              style={{ left: `${place.x}%`, top: `${place.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white"
                style={{ background: place.color + "30", borderColor: place.color }}
              >
                {place.emoji}
              </div>
              <span
                className="font-caveat font-bold mt-1 px-2 py-0.5 rounded-full text-white text-center leading-tight"
                style={{ background: place.color, fontSize: "10px", maxWidth: "80px" }}
              >
                {place.label}
              </span>

              {activePlace === place.id && (
                <div
                  className="absolute bottom-full mb-2 w-44 p-3 rounded-2xl shadow-xl animate-fade-in-up text-left z-20"
                  style={{ background: "white", border: `2px solid ${place.color}` }}
                >
                  <p className="font-nunito text-xs text-gray-700">{place.desc}</p>
                </div>
              )}
            </button>
          ))}

          {/* Treasure Chest */}
          <button
            onClick={handleChest}
            className="absolute z-10 flex flex-col items-center"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div
              className={`text-6xl select-none transition-all duration-300 ${chestOpen ? "scale-125" : "animate-treasure hover:scale-110"}`}
            >
              {chestOpen ? "📦✨" : "🎁"}
            </div>
            <span className="font-caveat text-sm font-bold text-amber-700 mt-1">
              {chestOpen ? "Открыто! 🎉" : "Нажми на сундук!"}
            </span>
          </button>

          <div
            className="absolute bottom-0 left-0 right-0 h-12 opacity-30"
            style={{ background: "linear-gradient(0deg, #7EC8FF, transparent)" }}
          />
        </div>

        {/* Final message */}
        {showFinal && (
          <div
            className="mt-8 rounded-3xl p-8 text-center animate-fade-in-up shadow-2xl"
            style={{ background: "linear-gradient(135deg, #FF6EB4, #B57BFF, #7EC8FF)" }}
          >
            <div className="text-5xl mb-4">💝</div>
            <h3 className="font-pacifico text-3xl md:text-4xl text-white mb-4">
              Ты нашла главное сокровище!
            </h3>
            <p className="font-nunito text-lg text-white/95 max-w-xl mx-auto leading-relaxed">
              Ты — самый яркий человек в моей жизни. Твоя улыбка, твой смех, твоя душа — вот настоящие сокровища.
              С днём рождения, моя любимая подруга! Пусть твои 18 лет будут самыми волшебными! 🌟
            </p>
            <div className="flex justify-center gap-3 mt-6 text-3xl">
              {["💗", "🌸", "⭐", "🎊", "💜", "🌟", "💝"].map((e, i) => (
                <span key={i} style={{ animation: `float ${2 + i * 0.2}s ${i * 0.1}s ease-in-out infinite` }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section 6: Final ─────────────────────────────────────────
function FinalSection() {
  const [launched, setLaunched] = useState(false);

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #F0E5FF 0%, #FFE5F5 30%, #FFFDE5 60%, #E5F5FF 100%)",
        minHeight: "80vh",
      }}
    >
      {launched && <BalloonField />}

      <div className="relative max-w-3xl mx-auto text-center px-4 z-10">
        <div className="text-7xl mb-8 select-none" style={{ animation: "float 3s ease-in-out infinite" }}>
          🎉
        </div>

        <h2 className="font-pacifico text-4xl md:text-6xl mb-6" style={{ color: "#FF6EB4" }}>
          С Днём Рождения!
        </h2>

        <div
          className="rounded-3xl p-8 mb-10 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            border: "3px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "0 20px 60px rgba(255,110,180,0.15), inset 0 0 0 3px rgba(255,110,180,0.2)",
          }}
        >
          <p className="font-nunito text-xl md:text-2xl text-gray-700 leading-relaxed mb-4">
            Дорогая{" "}
            <span className="font-bold shimmer-text" style={{ fontSize: "1.3em" }}>
              [Имя подруги]
            </span>
            ,
          </p>
          <p className="font-caveat text-2xl text-purple-600 leading-relaxed mb-4">
            Ты — особенная. Каждый день рядом с тобой — это подарок судьбы.
            Ты умеешь превращать обычные моменты в незабываемые воспоминания.
          </p>
          <p className="font-nunito text-lg text-pink-500 font-semibold">
            В твои 18 пусть мечты сбываются, море зовёт, а джип уже на старте! 🚗💨
          </p>
        </div>

        <button
          onClick={() => setLaunched(true)}
          className="font-pacifico text-xl text-white px-10 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 mb-6"
          style={{
            background: "linear-gradient(135deg, #FF6EB4 0%, #B57BFF 50%, #7EC8FF 100%)",
            boxShadow: "0 10px 40px rgba(255,110,180,0.4)",
          }}
        >
          🎈 Запустить шары в небо!
        </button>

        {launched && (
          <p className="font-caveat text-2xl text-pink-400 animate-fade-in-up">
            Лети высоко, моя дорогая подруга! ✨
          </p>
        )}
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function Index() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const toggleMusic = useCallback(() => setMusicPlaying((p) => !p), []);

  return (
    <div className="relative">
      <MusicControl playing={musicPlaying} onToggle={toggleMusic} />

      {musicPlaying && (
        <div
          className="fixed top-4 right-20 z-50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex gap-0.5 items-end h-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${6 + i * 4}px`,
                  background: "#FF6EB4",
                  animation: `bounce-soft ${0.4 + i * 0.1}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
          <span className="font-caveat text-sm text-pink-500">Музыка играет 🎵</span>
        </div>
      )}

      <HeroSection />
      <PhotoSlider />
      <BookBoysSection />
      <SeaSection />
      <TreasureMapSection />
      <FinalSection />

      <footer className="py-8 text-center" style={{ background: "#F5E5FF" }}>
        <p className="font-caveat text-2xl text-purple-400">Сделано с 💗 специально для тебя</p>
        <p className="font-nunito text-sm text-purple-300 mt-1">18 лет — только начало! 🌟</p>
      </footer>
    </div>
  );
}
