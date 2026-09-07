"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiStar, HiOutlineXMark } from "react-icons/hi2";
import SectionDivider from "./SectionDivider";

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

interface Review {
  name: string;
  device: string;
  rating: number;
  comment?: string;
  date: string;
}

const reviews: Review[] = [
  // Ventas reales — ordenadas por fecha más reciente
  { name: "More Maddoni", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Todo tal cual las fotos. Garantía y batería al 100%.", date: "Abr 2026" },
  { name: "Malena Quevedo", device: "iPhone 14 Pro 128GB", rating: 5, date: "Mar 2026" },
  { name: "Facundo Gambetta", device: "iPhone 14 Pro 128GB", rating: 5, date: "Mar 2026" },
  { name: "Joaquín Carbajal", device: "iPhone 15 Pro Max 1TB", rating: 5, comment: "Increíble equipo, todo verificado. Garantía incluida, una tranquilidad.", date: "Mar 2026" },
  { name: "Selene Maffre", device: "3x Redmi 15C 256GB", rating: 5, comment: "Compré 3 para la familia, todos sellados y funcionando perfecto.", date: "Mar 2026" },
  { name: "Bruno Díaz", device: "iPhone 14 Pro 128GB", rating: 5, date: "Mar 2026" },
  { name: "Lucas Quevedo", device: "iPhone 14 128GB", rating: 5, comment: "Muy buen equipo por ese precio. Funciona perfecto.", date: "Mar 2026" },
  { name: "Damián Molina", device: "iPhone 15 128GB", rating: 5, comment: "Buen precio y llegó rápido. Todo como lo describieron.", date: "Mar 2026" },
  { name: "Gustavo Alvarado", device: "Redmi 15C 256GB", rating: 5, comment: "Buena opción económica, el teléfono rinde muy bien.", date: "Mar 2026" },
  { name: "Tomás Cereceda", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Equipo impecable, batería nueva y todo verificado.", date: "Feb 2026" },
  { name: "Mateo Rosello", device: "iPhone 14 Pro 128GB", rating: 5, date: "Feb 2026" },
  { name: "Lucas Silva", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Soy cliente frecuente, siempre cumplen con todo.", date: "Feb 2026" },
  { name: "Leo Torres", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Excelente relación precio-calidad. Lo recomiendo.", date: "Feb 2026" },
  { name: "Mía Thomes", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Me encantó la atención, super rápidos y atentos.", date: "Feb 2026" },
  { name: "Lucas Papaianni", device: "iPhone 14 Pro 128GB", rating: 5, comment: "Segundo equipo que compro acá, siempre todo perfecto.", date: "Ene 2026" },
  { name: "Fran Chevrolet", device: "iPhone 14 Pro 128GB", rating: 5, date: "Ene 2026" },
  { name: "Nahi Maidana", device: "iPhone 17 Pro 256GB", rating: 5, comment: "Llegó sellado, impecable. La mejor atención que tuve comprando un celular.", date: "Dic 2025" },
  { name: "Thiago Knopp", device: "iPhone 17 Pro 256GB", rating: 5, date: "Dic 2025" },
  { name: "Mar Corvalán", device: "iPhone 16 Pro 128GB", rating: 5, comment: "Excelente atención por WhatsApp, respondieron al toque.", date: "Dic 2025" },
  { name: "Tamara Liat", device: "iPhone 16 Pro Max 1TB", rating: 5, comment: "Me asesoraron perfecto, el equipo es una bestia. Super recomendable.", date: "Dic 2025" },
  { name: "Uriel Tomás", device: "iPhone 14 Pro Max 128GB", rating: 5, date: "Dic 2025" },
  { name: "Agustín Coscia", device: "iPhone 16 Pro 256GB", rating: 5, comment: "Entrega rapidísima y el equipo en perfecto estado. Volvería a comprar.", date: "Nov 2025" },
  { name: "Leonel Ruiz", device: "iPhone 14 Pro Max 128GB", rating: 5, comment: "Mi primer Pro Max, cámara espectacular. Muy contento.", date: "Nov 2025" },
  { name: "Candela Agustina", device: "iPhone 13 Pro 128GB", rating: 5, comment: "Lo uso todos los días, anda como nuevo. Gracias!", date: "Nov 2025" },
  { name: "Laura Giselle", device: "iPhone 14 Pro Max 128GB", rating: 5, comment: "Excelente equipo, todo verificado. Muy conforme.", date: "Nov 2025" },
  { name: "Santino López", device: "iPhone 14 128GB", rating: 5, date: "Nov 2025" },
  { name: "Tobi Rosello", device: "iPhone 14 128GB", rating: 4, comment: "Llegó bien y funcionando todo. Buena experiencia.", date: "Nov 2025" },
  { name: "Lautaro Martínez", device: "iPhone 14 128GB", rating: 5, date: "Nov 2025" },
  { name: "Nico Pedrozo", device: "iPhone 16 128GB", rating: 5, comment: "Batería al 100% como prometieron. Muy conforme.", date: "Ago 2025" },
  { name: "Yanina Silva", device: "iPhone 16e 256GB", rating: 5, date: "Ago 2025" },
  { name: "Melina Antonella", device: "iPhone 13 Pro 128GB", rating: 5, comment: "Increíble cámara para el precio. Muy satisfecha.", date: "Ago 2025" },
  { name: "Leo Medina", device: "iPhone 13 128GB", rating: 5, comment: "Compramos con mi hermano, los dos equipos impecables.", date: "Ago 2025" },
  { name: "Maca Álvarez", device: "iPhone 13 128GB", rating: 5, comment: "Super contenta con mi iPhone, todo en orden.", date: "Jul 2025" },
  { name: "Agustín Medina", device: "iPhone 13 128GB", rating: 5, date: "Jul 2025" },
  { name: "Jana Miyen", device: "iPhone 16e 128GB", rating: 5, date: "May 2025" },
  { name: "Ivonne Alvarado", device: "Redmi 14C 128GB", rating: 5, date: "Dic 2024" },
  { name: "Ezequiel Díaz", device: "iPhone X 64GB", rating: 4, comment: "Equipo más viejo pero funciona bien para lo que necesitaba.", date: "Dic 2024" },
  { name: "Stella Díaz", device: "Redmi 14C 128GB", rating: 5, comment: "Para uso diario va perfecto. Buen precio.", date: "Nov 2024" },
];

const INITIAL = 6;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <HiStar
          key={i}
          className={`size-3.5 ${i < count ? "text-yellow-400" : "text-white/10"}`}
        />
      ))}
    </div>
  );
}

function ReviewFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: Review) => void }) {
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const canSubmit = name.trim() && device.trim() && rating > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const now = new Date();
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    onSubmit({
      name: name.trim(),
      device: device.trim(),
      rating,
      comment: comment.trim() || undefined,
      date: `${months[now.getMonth()]} ${now.getFullYear()}`,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 sm:p-8 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-slate-500 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <HiOutlineXMark className="size-6" />
        </button>

        <div>
          <h3 className="text-xl font-medium text-white">Dejá tu reseña</h3>
          <p className="text-sm text-slate-500 mt-1">Contanos tu experiencia con IPHONES LUXURY.</p>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Puntuación</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="cursor-pointer p-0.5"
              >
                <HiStar className={`size-7 transition-colors ${star <= rating ? "text-yellow-400" : "text-white/10 hover:text-white/30"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
        />

        {/* Device */}
        <input
          type="text"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          placeholder="Equipo comprado (ej: iPhone 14 Pro 128GB)"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
        />

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentario (opcional)"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`cursor-pointer w-full py-3.5 rounded-full text-sm font-semibold transition-all ${
            canSubmit
              ? "btn-gold active:scale-95"
              : "bg-white/5 text-slate-600 cursor-not-allowed"
          }`}
        >
          Enviar reseña
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function Reviews() {
  const [visible, setVisible] = useState(INITIAL);
  const [allReviews, setAllReviews] = useState<Review[]>(reviews);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load reviews from API on mount
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: Review[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllReviews(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-open modal if URL has #dejar-resena
  useEffect(() => {
    if (window.location.hash === "#dejar-resena") {
      setVisible(allReviews.length);
      setShowForm(true);
    }
  }, [allReviews.length]);

  const avg = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : "5.0";
  const handleSubmit = async (review: Review) => {
    // Save to API
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
    } catch {}
    // Add to local state immediately
    setAllReviews((prev) => [review, ...prev]);
  };

  return (
    <section id="resenas" className="relative py-20 px-6 scroll-mt-24 bg-[#101010]">
      <SectionDivider edge="top" shape="asymmetric" />
      <SectionDivider edge="bottom" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="section-badge mb-4">
            <HiStar aria-hidden="true" className="size-3.5" />
            Reseñas
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 text-balance">
            Más de 500 equipos vendidos
          </h2>
          <p className="text-slate-500 text-pretty">
            Lo que cuentan los clientes que ya compraron.
          </p>
        </div>

        {/* Google-style rating card */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 max-w-lg mx-auto mb-12 flex items-center gap-4 sm:gap-5">
          <GoogleGIcon className="size-9 sm:size-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate">IPHONES LUXURY</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-white tabular-nums">{avg}</span>
              <Stars count={Math.round(Number(avg))} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{allReviews.length} reseñas de clientes reales</p>
          </div>
          <button
            onClick={() => {
              window.history.replaceState(null, "", "#dejar-resena");
              setShowForm(true);
            }}
            className="btn-gold cursor-pointer shrink-0 px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full text-xs sm:text-sm font-semibold"
          >
            Escribir reseña
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allReviews.slice(0, visible).map((review, i) => (
            <div
              key={i}
              className="glass-panel rounded-xl p-5 space-y-3 hover:border-white/15 transition-[border-color]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.date}</p>
                  </div>
                </div>
                <Stars count={review.rating} />
              </div>
              <p className="text-xs text-amber-400/80 font-medium">
                Compró: {review.device}
              </p>
              {review.comment && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>

        {visible < allReviews.length ? (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible(allReviews.length)}
              className="btn-outline-gold cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
            >
              Ver todas las reseñas
            </button>
          </div>
        ) : allReviews.length > INITIAL && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible(INITIAL)}
              className="btn-outline-gold cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full text-sm font-semibold uppercase active:scale-95"
            >
              Ver menos
            </button>
          </div>
        )}

        {showForm && (
          <ReviewFormModal
            onClose={() => {
              setShowForm(false);
              window.history.replaceState(null, "", window.location.pathname);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </section>
  );
}
