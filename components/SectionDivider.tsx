"use client";

import { useId } from "react";

/**
 * Decorative curve that marks the seam between a black section and a
 * #101010 section. Must be a child of a `relative` section with visible
 * overflow. `edge="top"` sits flush against the section's top border with
 * the bump poking up into the section above; `edge="bottom"` sits flush
 * against the bottom border, flipped, with the bump poking down into the
 * section below.
 *
 * Two shapes, taken from the reference site:
 * - "symmetric": a bump on each side with a plateau in the middle.
 * - "asymmetric": a single bump on one side, straight diagonal on the other.
 */
const SHAPES = {
  symmetric: {
    fill: "M533.5 0C574.5 0 564 53 634 53H1156C1226 53 1215.5 0 1256.5 0H1299.61C1523.16 17.2547 1714.89 43.8584 1809 60.1309V84.25H0V60.1309C94.1139 43.8584 285.836 17.2547 509.393 0H533.5Z",
    edge: "M0 60.1309C94.1139 43.8584 285.836 17.2547 509.393 0H533.5C574.5 0 564 53 634 53H1156C1226 53 1215.5 0 1256.5 0H1299.61C1523.16 17.2547 1714.89 43.8584 1809 60.1309",
  },
  asymmetric: {
    fill: "M634 53C564 53 574.5 0 533.5 0H509.393C285.836 17.2547 94.1139 43.8584 0 60.1309V84.25H1809V60.1309L1156 53H634Z",
    edge: "M0 60.1309C94.1139 43.8584 285.836 17.2547 509.393 0H533.5C574.5 0 564 53 634 53H1156L1809 60.1309",
  },
} as const;

export default function SectionDivider({
  edge,
  shape = "symmetric",
  mirror = false,
}: {
  edge: "top" | "bottom";
  shape?: keyof typeof SHAPES;
  /** Flips the curve horizontally on top of the edge flip, so consecutive dividers don't repeat the same shape. */
  mirror?: boolean;
}) {
  const strokeId = useId();
  const paths = SHAPES[shape];

  const flipX = edge === "bottom" ? !mirror : mirror;
  const flipY = edge === "bottom";

  return (
    <div
      className={`absolute inset-x-0 z-10 pointer-events-none ${
        edge === "top" ? "bottom-[calc(100%-8px)]" : "top-[calc(100%-8px)]"
      }`}
    >
      <svg
        viewBox="0 0 1809 87"
        preserveAspectRatio="none"
        className={`w-full h-10 sm:h-12 md:h-16 block overflow-visible ${flipX ? "-scale-x-100" : ""} ${flipY ? "-scale-y-100" : ""}`}
        aria-hidden="true"
      >
        <path d={paths.fill} fill="#101010" />
        {/* Gold border, tracing only the edge that faces the adjacent black section */}
        <path
          d={paths.edge}
          fill="none"
          stroke={`url(#${strokeId})`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1809" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef48a" />
            <stop offset="20%" stopColor="#cfa534" />
            <stop offset="49%" stopColor="#ba810c" />
            <stop offset="66%" stopColor="#ddba4c" />
            <stop offset="76%" stopColor="#fef48a" />
            <stop offset="86%" stopColor="#ca9b28" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
