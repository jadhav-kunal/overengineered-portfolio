'use client'

export default function AuroraBg() {
  return (
    <>
      <style>{`
        @keyframes aurora-1 {
          0%   { transform: translate(0%, 0%) scale(1); }
          25%  { transform: translate(12%, -16%) scale(1.1); }
          50%  { transform: translate(6%, 12%) scale(0.92); }
          75%  { transform: translate(-10%, -6%) scale(1.06); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora-2 {
          0%   { transform: translate(0%, 0%) scale(1); }
          25%  { transform: translate(-14%, 10%) scale(1.08); }
          50%  { transform: translate(10%, -14%) scale(1.12); }
          75%  { transform: translate(6%, 8%) scale(0.94); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora-3 {
          0%   { transform: translate(0%, 0%) scale(1); }
          25%  { transform: translate(-16%, -12%) scale(1.1); }
          50%  { transform: translate(-6%, 14%) scale(0.9); }
          75%  { transform: translate(14%, 6%) scale(1.07); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora-4 {
          0%   { transform: translate(0%, 0%) scale(1); }
          25%  { transform: translate(10%, -10%) scale(1.05); }
          50%  { transform: translate(-12%, -14%) scale(1.1); }
          75%  { transform: translate(6%, 10%) scale(0.92); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#F0F4EE',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {/* light sage — top left */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '70%',
          height: '80%',
          borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
          background: 'radial-gradient(ellipse at 45% 50%, #7BBD78 0%, #A8D4A5 50%, transparent 72%)',
          filter: 'blur(32px)',
          opacity: 0.7,
          mixBlendMode: 'multiply',
          animation: 'aurora-1 22s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* mid sage-green — centre */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '18%',
          width: '65%',
          height: '72%',
          borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
          background: 'radial-gradient(ellipse at 55% 45%, #52986A 0%, #78B890 50%, transparent 72%)',
          filter: 'blur(36px)',
          opacity: 0.6,
          mixBlendMode: 'multiply',
          animation: 'aurora-2 28s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* deep forest — bottom right */}
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '-12%',
          width: '58%',
          height: '68%',
          borderRadius: '50% 50% 40% 60% / 40% 55% 45% 55%',
          background: 'radial-gradient(ellipse at 40% 55%, #3D8055 0%, #5EA870 50%, transparent 72%)',
          filter: 'blur(30px)',
          opacity: 0.55,
          mixBlendMode: 'multiply',
          animation: 'aurora-3 24s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* blue-sage accent — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '45%',
          height: '50%',
          borderRadius: '55% 45% 50% 50% / 45% 50% 50% 55%',
          background: 'radial-gradient(ellipse at 50% 40%, #5A9E8A 0%, #7ABCAA 50%, transparent 72%)',
          filter: 'blur(38px)',
          opacity: 0.5,
          mixBlendMode: 'multiply',
          animation: 'aurora-4 18s ease-in-out infinite',
          willChange: 'transform',
        }} />
      </div>
    </>
  )
}
