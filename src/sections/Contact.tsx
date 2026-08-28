import { useState } from 'react';
import { trpc } from '../providers/trpc';
import { contactConfig } from '../config';

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: '#180c04',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(24, 12, 4, 0.22)',
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

const socialLinkStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  color: '#180c04',
  textDecoration: 'none',
  padding: '14px 0',
  borderBottom: '1px solid rgba(24, 12, 4, 0.08)',
  letterSpacing: '0.5px',
};

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMutation = trpc.contact.submit.useMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await submitMutation.mutateAsync({ name, email, topic: topic || undefined, message });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: '#f0ecd7', position: 'relative', zIndex: 2, padding: '120px 0 100px' }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '80px',
        }}
      >
        {/* Left: heading + direct channels */}
        <div>
          {contactConfig.sectionLabel && (
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
              {contactConfig.sectionLabel}
            </p>
          )}
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '42px',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#180c04',
              marginBottom: '24px',
            }}
          >
            {contactConfig.title}
          </h2>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#696969',
              marginBottom: '40px',
              maxWidth: '420px',
            }}
          >
            {contactConfig.intro}
          </p>

          <div>
            <a href={contactConfig.instagramUrl} target="_blank" rel="noreferrer" style={socialLinkStyle}>
              Instagram — @fifthset.collective
            </a>
            <a href={contactConfig.telegramUrl} target="_blank" rel="noreferrer" style={socialLinkStyle}>
              Telegram — Join the channel
            </a>
            <a href={`mailto:${contactConfig.email}`} style={socialLinkStyle}>
              {contactConfig.email}
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div>
          {sent ? (
            <div style={{ paddingTop: '60px' }}>
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '30px',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#180c04',
                  marginBottom: '16px',
                }}
              >
                Received, with thanks.
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: '#696969',
                }}
              >
                A member of our team will reply personally — usually within a day.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ paddingTop: '24px' }}>
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
                <label style={labelStyle}>Topic (optional)</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Select a topic</option>
                  <option value="Open Play — Singapore">Open Play — Singapore</option>
                  <option value="The Championship 2027">The Championship 2027</option>
                  <option value="Experiences">Experiences</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Tell us a little about your game and what you are looking for…"
                />
              </div>

              {error && (
                <p
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#a24a3a',
                    marginBottom: '16px',
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitMutation.isPending}
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#180c04',
                  background: 'transparent',
                  border: '1px solid rgba(24, 12, 4, 0.35)',
                  padding: '16px 40px',
                  borderRadius: '2px',
                  cursor: submitMutation.isPending ? 'wait' : 'pointer',
                  opacity: submitMutation.isPending ? 0.6 : 1,
                }}
              >
                {submitMutation.isPending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
