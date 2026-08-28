import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { anatomyConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Anatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillars = anatomyConfig.pillars;

  useEffect(() => {
    const ctx = gsap.context(() => {
      pillarRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!anatomyConfig.sectionLabel && !anatomyConfig.title && pillars.length === 0) {
    return null;
  }

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      style={{
        backgroundColor: '#f0ecd7',
        position: 'relative',
        zIndex: 2,
        paddingBottom: '110px',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '100px 24px 70px',
        }}
      >
        {anatomyConfig.sectionLabel && (
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#938977',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            {anatomyConfig.sectionLabel}
          </p>
        )}
        {anatomyConfig.title && (
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(32px, 4.4vw, 48px)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#180c04',
            }}
          >
            {anatomyConfig.title}
          </h2>
        )}
      </div>

      {/* Pillars: image + text, alternating */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
        {pillars.map((pillar, i) => (
          <div
            key={pillar.label}
            ref={(el) => { pillarRefs.current[i] = el; }}
            style={{
              display: 'flex',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              gap: 'clamp(36px, 6vw, 80px)',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: i < pillars.length - 1 ? 'clamp(64px, 8vw, 100px)' : '0',
            }}
          >
            {/* Visual */}
            <div
              style={{
                flex: '1 1 340px',
                minWidth: 'min(340px, 100%)',
                maxWidth: '440px',
                overflow: 'hidden',
                borderRadius: '3px',
                aspectRatio: '3 / 4',
                background: '#e5e0c8',
                boxShadow: '0px 8px 24px 0px rgba(24, 12, 4, 0.12)',
              }}
            >
              <img
                src={pillar.image}
                alt={pillar.imageAlt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: '1 1 320px', minWidth: 'min(320px, 100%)' }}>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#938977',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '22px',
                }}
              >
                {pillar.label}
              </p>
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(26px, 3vw, 34px)',
                  fontWeight: 500,
                  lineHeight: 1.25,
                  color: '#180c04',
                  marginBottom: '20px',
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: '#696969',
                  maxWidth: '480px',
                }}
              >
                {pillar.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
