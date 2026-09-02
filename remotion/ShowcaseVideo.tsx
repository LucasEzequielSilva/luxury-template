import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Img,
  interpolate,
  spring,
  staticFile,
} from "remotion";

// ─── Phone data for the showcase ─────────────────────────────
const phones = [
  {
    name: "iPhone 17 Pro Max",
    image: staticFile("iphones/17-pro-max/ultramar.jpg"),
    color: "#1a3a5c",
    spec: "A19 Pro · 48MP Triple · 4K 120fps",
    price: "Desde USD 1.399",
  },
  {
    name: "iPhone 17 Pro",
    image: staticFile("iphones/17-pro/naranja.jpg"),
    color: "#8B4513",
    spec: "A19 Pro · 48MP · ProMotion 120Hz",
    price: "Desde USD 1.199",
  },
  {
    name: "iPhone 16 Pro Max",
    image: staticFile("iphones/16-pro-max/negro.jpg"),
    color: "#1c1c1e",
    spec: "A18 Pro · 48MP · Titanio",
    price: "Desde USD 999",
  },
  {
    name: "iPhone 15 Pro Max",
    image: staticFile("iphones/15-pro-max/titanio2.jpg"),
    color: "#78716c",
    spec: "A17 Pro · 48MP · USB-C",
    price: "Desde USD 849",
  },
  {
    name: "iPhone 16",
    image: staticFile("iphones/16/iphone16-azulultramar.jpg"),
    color: "#1e3a5f",
    spec: "A18 · 48MP · Dynamic Island",
    price: "Desde USD 699",
  },
];

// ─── Intro scene ─────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [30, 55], [0, 400], {
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          transform: `scale(${logoScale})`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transform: `scale(${logoScale})`,
        }}
      >
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 90,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -2,
            opacity: textOpacity,
            margin: 0,
          }}
        >
          TRENDSPOT
        </h1>

        <div
          style={{
            height: 3,
            width: lineWidth,
            background:
              "linear-gradient(90deg, transparent, #3b82f6, transparent)",
            borderRadius: 2,
          }}
        />

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            opacity: subtitleOpacity,
            margin: 0,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Premium Collection
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Phone card scene ────────────────────────────────────────
const PhoneScene: React.FC<{
  phone: (typeof phones)[0];
  index: number;
}> = ({ phone, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image entrance
  const imageY = interpolate(frame, [0, 25], [200, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const imageScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Text entrance
  const textX = interpolate(frame, [15, 35], [-80, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Spec line
  const specOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Price badge
  const priceScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [55, 65], [1, 0], {
    extrapolateRight: "clamp",
  });

  const isEven = index % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: exitOpacity,
      }}
    >
      {/* Accent gradient blob */}
      <div
        style={{
          position: "absolute",
          top: isEven ? "15%" : "55%",
          left: isEven ? "-10%" : "50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${phone.color}44, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Phone image */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: `translateX(-50%) translateY(${imageY}px) scale(${Math.max(imageScale, 0)})`,
          opacity: imageOpacity,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Img
          src={phone.image}
          style={{
            width: 700,
            height: "auto",
            maxHeight: 1000,
            objectFit: "contain",
            borderRadius: 40,
          }}
        />
      </div>

      {/* Text overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 60,
          right: 60,
          transform: `translateX(${textX}px)`,
          opacity: textOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {phone.name}
        </h2>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            color: "rgba(255,255,255,0.5)",
            margin: "16px 0 0",
            opacity: specOpacity,
            letterSpacing: 1,
          }}
        >
          {phone.spec}
        </p>

        {/* Price badge */}
        <div
          style={{
            marginTop: 24,
            display: "inline-flex",
            padding: "14px 32px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            transform: `scale(${Math.max(priceScale, 0)})`,
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {phone.price}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── CTA / Outro scene ──────────────────────────────────────
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const textOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, mass: 0.6 },
  });
  const pulseOpacity = interpolate(
    frame % 30,
    [0, 15, 30],
    [0.4, 0.8, 0.4]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Pulsing ring */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "2px solid rgba(59,130,246,0.3)",
          opacity: pulseOpacity,
          transform: `scale(${scale * 1.2})`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: "#fff",
            opacity: textOpacity,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Tu próximo
          <br />
          iPhone te espera
        </h1>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            color: "rgba(255,255,255,0.5)",
            opacity: textOpacity,
            margin: 0,
            textAlign: "center",
          }}
        >
          Garantía · Envío gratis · Financiación
        </p>

        {/* CTA button */}
        <div
          style={{
            marginTop: 20,
            padding: "20px 50px",
            borderRadius: 50,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            transform: `scale(${Math.max(ctaScale, 0)})`,
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 2,
            }}
          >
            TRENDSPOT.COM
          </span>
        </div>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            color: "rgba(255,255,255,0.35)",
            opacity: textOpacity,
            margin: "10px 0 0",
          }}
        >
          @trendspot.ok
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ────────────────────────────────────────
export const ShowcaseVideo: React.FC = () => {
  const INTRO_DURATION = 80;
  const PHONE_DURATION = 65;
  const OUTRO_DURATION = 80;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroScene />
      </Sequence>

      {/* Phone showcases */}
      {phones.map((phone, i) => (
        <Sequence
          key={phone.name}
          from={INTRO_DURATION + i * PHONE_DURATION}
          durationInFrames={PHONE_DURATION}
        >
          <PhoneScene phone={phone} index={i} />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence
        from={INTRO_DURATION + phones.length * PHONE_DURATION}
        durationInFrames={OUTRO_DURATION}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
