"use client";

export default function FloatingBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <div className="absolute inset-0 bg-[#F9FCFF]" />

      <div
        className="absolute inset-0"
        style={{
          background: `
          radial-gradient(circle at 18% 42%, rgba(210,233,255,.9) 0%, transparent 38%),
          radial-gradient(circle at 82% 25%, rgba(221,239,255,.75) 0%, transparent 35%),
          linear-gradient(90deg,#F3F9FF 0%,#FFFFFF 52%,#F3F9FF 100%)
          `,
        }}
      />

    </div>
  );
}