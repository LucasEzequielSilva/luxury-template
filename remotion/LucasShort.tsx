import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  OffthreadVideo,
} from "remotion";

// ─── Intro: branding "LUCAS UI" estilo trendspot ─────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const titleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [20, 40], [0, 500], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [40, 50], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", opacity: exitOpacity }}>
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          transform: `scale(${logoScale})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, transform: `scale(${logoScale})` }}>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 110,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -3,
            opacity: titleOpacity,
            margin: 0,
            lineHeight: 1,
          }}
        >
          LUCAS UI
        </h1>
        <div
          style={{
            height: 4,
            width: lineWidth,
            background: "linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)",
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 30,
            color: "rgba(255,255,255,0.65)",
            opacity: subOpacity,
            margin: 0,
            letterSpacing: 8,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          IA & Vibe Coding
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Video escena: clip de Lucas con un sutil overlay info ──
const VideoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const badgeOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const badgeY = interpolate(frame, [15, 35], [-30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn }}>
      <OffthreadVideo src={staticFile("lucas-clip3.mp4")} muted={false} />

      {/* Badge top-left: branding sutil mientras corre el video */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
          padding: "12px 22px",
          borderRadius: 50,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: 1 }}>
          @lucasui_ia
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Outro CTA: "BUILDERS CLUB" estilo trendspot ───────────
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const titleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 20, fps, config: { damping: 10, mass: 0.6 } });
  const pulseOpacity = interpolate(frame % 30, [0, 15, 30], [0.3, 0.8, 0.3]);
  const pulseScale = interpolate(frame % 30, [0, 30], [1, 1.4]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "2px solid rgba(99,102,241,0.4)",
          opacity: pulseOpacity,
          transform: `scale(${enter * pulseScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          transform: `scale(${enter})`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, transform: `scale(${enter})` }}>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            color: "rgba(255,255,255,0.55)",
            opacity: titleOpacity,
            margin: 0,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Sumate a la comunidad
        </p>
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: 96,
            fontWeight: 800,
            color: "#fff",
            opacity: titleOpacity,
            margin: 0,
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          BUILDERS
          <br />
          CLUB
        </h1>

        <div
          style={{
            marginTop: 16,
            padding: "22px 60px",
            borderRadius: 60,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            transform: `scale(${Math.max(ctaScale, 0)})`,
            boxShadow: "0 20px 60px rgba(99,102,241,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 2,
            }}
          >
            LINK EN BIO
          </span>
        </div>

        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            color: "rgba(255,255,255,0.4)",
            opacity: titleOpacity,
            margin: "8px 0 0",
            letterSpacing: 1,
          }}
        >
          @lucasui_ia
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition principal ──────────────────────────────────
// Frames: intro 45f (1.5s) + video 1440f (48s) + outro 90f (3s) = 1575f total
export const LucasShort: React.FC = () => {
  const INTRO = 45;
  const VIDEO = 1440;
  const OUTRO = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <IntroScene />
      </Sequence>
      <Sequence from={INTRO} durationInFrames={VIDEO}>
        <VideoScene />
      </Sequence>
      <Sequence from={INTRO + VIDEO} durationInFrames={OUTRO}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
