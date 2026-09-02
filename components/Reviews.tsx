"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiStar, HiOutlineXMark, HiOutlinePencilSquare } from "react-icons/hi2";

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
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 space-y-5 shadow-2xl"
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
          <p className="text-sm text-slate-500 mt-1">Contanos tu experiencia con iPhone Luxury.</p>
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
              ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
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
  const expanded = visible >= allReviews.length;

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
    <section id="resenas" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-3 text-balance">
              +500 equipos vendidos
            </h2>
            <p className="text-slate-500 text-pretty">
              Lo que dicen nuestros clientes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-3xl font-bold text-white">{avg}</span>
            <div>
              <Stars count={Math.round(Number(avg))} />
              <p className="text-xs text-slate-500 mt-0.5">{allReviews.length} reseñas</p>
            </div>
          </div>
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
              className="cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/5 active:scale-95 transition-[transform,background-color] duration-150"
            >
              Ver todas las reseñas
            </button>
          </div>
        ) : allReviews.length > INITIAL && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible(INITIAL)}
              className="cursor-pointer px-8 py-3.5 min-h-[44px] rounded-full border border-white/15 text-slate-400 text-sm font-medium hover:bg-white/5 active:scale-95 transition-[transform,background-color] duration-150"
            >
              Ver menos
            </button>
          </div>
        )}

        {expanded && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                window.history.replaceState(null, "", "#dejar-resena");
                setShowForm(true);
              }}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.03] text-sm transition-[border-color,background-color,color]"
            >
              <HiOutlinePencilSquare className="size-4" />
              Dejar una reseña
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
