import { partnerConfig } from '../config';
import { getLenis } from '../hooks/useLenis';

export default function Partner() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="partner"
      style={{
        backgroundColor: '#180c04',
        position: 'relative',
        zIndex: 2,
        padding: '130px 24px',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: '#938977',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '26px',
          }}
        >
          {partnerConfig.sectionLabel}
        </p>
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(32px, 4.4vw, 48px)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#fcfaee',
            marginBottom: '28px',
            textWrap: 'balance',
          }}
        >
          {partnerConfig.title}
        </h2>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(19px, 2vw, 23px)',
            lineHeight: 1.55,
            color: 'rgba(252, 250, 238, 0.72)',
            marginBottom: '48px',
            textWrap: 'balance',
          }}
        >
          {partnerConfig.body}
        </p>
        <a
          href={partnerConfig.ctaTargetId}
          onClick={(e) => scrollTo(e, partnerConfig.ctaTargetId)}
          style={{
            display: 'inline-block',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: '#fcfaee',
            background: 'transparent',
            border: '1px solid rgba(252, 250, 238, 0.45)',
            padding: '16px 40px',
            borderRadius: '2px',
            transition: 'border-color 0.5s ease, background 0.5s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fcfaee';
            e.currentTarget.style.background = 'rgba(252, 250, 238, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(252, 250, 238, 0.45)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {partnerConfig.ctaText}
        </a>
      </div>
    </section>
  );
}
