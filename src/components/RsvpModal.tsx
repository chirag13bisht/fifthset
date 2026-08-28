import { useEffect, useState } from 'react';
import { trpc } from '../providers/trpc';
import { EVENTS, PLAY_LEVELS } from '@contracts/events';

type RsvpResult = {
  status: 'confirmed' | 'waitlist' | 'interest';
  duplicate: boolean;
  eventName: string;
  waitlistPosition: number | null;
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: '#fcfaee',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(252, 250, 238, 0.22)',
  padding: '12px 0',
  outline: 'none',
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '10px',
  fontWeight: 600,
  color: '#938977',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '2px',
};

export default function RsvpModal() {
  const [eventSlug, setEventSlug] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [level, setLevel] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<RsvpResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statsQuery = trpc.events.stats.useQuery(undefined, { enabled: eventSlug !== null });
  const rsvpMutation = trpc.events.rsvp.useMutation();

  const event = EVENTS.find((e) => e.slug === eventSlug) ?? null;
  const stat = statsQuery.data?.find((s) => s.slug === eventSlug) ?? null;

  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent<{ eventSlug: string }>).detail?.eventSlug;
      if (slug) {
        setEventSlug(slug);
        setResult(null);
        setError(null);
      }
    };
    window.addEventListener('fsc:open-rsvp', handler);
    return () => window.removeEventListener('fsc:open-rsvp', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = eventSlug ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [eventSlug]);

  if (!eventSlug || !event) return null;

  const close = () => setEventSlug(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await rsvpMutation.mutateAsync({
        eventSlug,
        name,
        email,
        whatsapp: whatsapp || undefined,
        level: level || undefined,
        message: message || undefined,
      });
      setResult(res);
      statsQuery.refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const successCopy = result
    ? result.status === 'confirmed'
      ? {
          title: 'Your place is held.',
          body: result.duplicate
            ? 'We already hold a place for this email. Our team will confirm the details with you personally.'
            : 'Welcome to the Collective. Our team will write to you shortly to confirm the details of your session.',
        }
      : result.status === 'waitlist'
        ? {
            title: 'You are on the waitlist.',
            body: result.duplicate
              ? 'This email is already on the list — we will be in touch the moment a place opens.'
              : `Places are limited by design.${
                  result.waitlistPosition ? ` You are number ${result.waitlistPosition} in line.` : ''
                } We will write the moment one opens.`,
          }
        : {
            title: 'Noted, with pleasure.',
            body: result.duplicate
              ? 'We already have your interest on record — you will be first to know.'
              : 'Experiences are announced to registered guests first. You will be the first to know.',
          }
    : null;

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(24, 12, 4, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#1e1006',
          border: '1px solid rgba(252, 250, 238, 0.12)',
          borderRadius: '4px',
          padding: '48px 44px 40px',
          position: 'relative',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#938977',
            fontSize: '22px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            color: '#938977',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          {event.interestOnly ? 'Register Interest' : 'RSVP'}
        </p>
        <h3
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '30px',
            fontWeight: 500,
            color: '#fcfaee',
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          {event.name}
        </h3>

        {stat && !event.interestOnly && event.capacity !== null && (
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              color: '#938977',
              marginBottom: '28px',
            }}
          >
            {stat.remaining && stat.remaining > 0
              ? `${stat.remaining} of ${stat.capacity} places remain for the next session.`
              : 'The next session is fully held — join the waitlist below.'}
          </p>
        )}
        {(event.interestOnly || event.capacity === null) && (
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              color: '#938977',
              marginBottom: '28px',
            }}
          >
            {event.interestOnly
              ? 'Leave your details and you will be first to know.'
              : 'Registration opens to the waitlist first.'}
          </p>
        )}

        {successCopy ? (
          <div style={{ paddingTop: '8px' }}>
            <h4
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '26px',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#fcfaee',
                marginBottom: '16px',
              }}
            >
              {successCopy.title}
            </h4>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'rgba(252, 250, 238, 0.75)',
                marginBottom: '32px',
              }}
            >
              {successCopy.body}
            </p>
            <button
              onClick={close}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#180c04',
                background: '#fcfaee',
                border: 'none',
                padding: '14px 36px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                placeholder="Your name"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>WhatsApp (optional)</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={inputStyle}
                placeholder="+65 ..."
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Playing Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ color: '#180c04' }}>
                  Select your level
                </option>
                {PLAY_LEVELS.map((l) => (
                  <option key={l} value={l} style={{ color: '#180c04' }}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Anything we should know (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Doubles partner, dietary notes, preferred evenings…"
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '12px',
                  color: '#d98a7a',
                  marginBottom: '16px',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={rsvpMutation.isPending}
              style={{
                width: '100%',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#180c04',
                background: '#fcfaee',
                border: 'none',
                padding: '16px',
                borderRadius: '2px',
                cursor: rsvpMutation.isPending ? 'wait' : 'pointer',
                opacity: rsvpMutation.isPending ? 0.6 : 1,
              }}
            >
              {rsvpMutation.isPending
                ? 'One moment…'
                : event.interestOnly
                  ? 'Register Interest'
                  : 'Submit RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
