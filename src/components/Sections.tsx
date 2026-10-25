import { useEffect, useRef, useState } from 'react';
import hologram from '../assets/photos/hologram.jpg';
import video from '../assets/photos/video.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScramble } from '../hooks/useScramble';
import type { Resume } from '../lib/types';
import { GlowCard, type Accent } from './GlowCard';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { NAV } from './NavBar';
import { Reveal } from './Reveal';

/** "Physician Assistant (PA-C) | Internal & Family Medicine" → ["Physician Assistant (PA-C)", "Internal & Family Medicine"] */
export const splitHeadline = (h: string) => h.split(/\s*[|•·–—]\s*/).filter(Boolean);

const initialsOf = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const firstSentence = (t: string) => t.split(/(?<=[.!?])\s/)[0] || t;

function Head({ label, title, id, link }: { label: string; title: React.ReactNode; id: string; link?: { href?: string; text: string; onClick?: () => void } }) {
  return (
    <div className="head">
      <div>
        <span className="label">{label}</span>
        <h2 id={id} className="title">
          {title}
        </h2>
      </div>
      {link &&
        (link.onClick ? (
          <button className="head__link" onClick={link.onClick}>
            {link.text} <Icon name="arrowRight" size={13} />
          </button>
        ) : (
          <a className="head__link" href={link.href}>
            {link.text} <Icon name="arrowRight" size={13} />
          </a>
        ))}
    </div>
  );
}

/* ================= hero ================= */

const STEPS = ['Role', 'Education', 'Skills', 'Contact'];

/** The "book an appointment" card from the design, turned into a 4-step profile card. */
function ProfileCard({ resume }: { resume: Resume }) {
  const [step, setStep] = useState(0);
  const current = resume.experience[0];
  const edu = resume.education[0];
  const rows: Record<number, { label: string; value: string }[]> = {
    0: [
      { label: 'Current role', value: current?.role || 'Your role' },
      { label: 'Organisation', value: current?.company || 'Organisation' },
      { label: 'Since', value: current?.period || '—' },
    ],
    1: [
      { label: 'Degree', value: edu?.degree || 'Your degree' },
      { label: 'Institution', value: edu?.institution || 'Institution' },
      { label: 'Certified', value: resume.certifications[0] || '—' },
    ],
    2: resume.skills.slice(0, 3).map((s, i) => ({ label: `Skill ${i + 1}`, value: s })),
    3: [
      { label: 'Email', value: resume.email || '—' },
      { label: 'Phone', value: resume.phone || '—' },
      { label: 'Based in', value: resume.location || '—' },
    ],
  };
  const last = step === STEPS.length - 1;
  return (
    <div className="pcard">
      <p className="pcard__title">Profile at a Glance</p>
      <p className="pcard__sub">Fast. Clear. Complete.</p>
      <ol className="pcard__steps">
        {STEPS.map((s, i) => (
          <li key={s} className={`${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`}>
            <button onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}>
              <span>{i < step ? <Icon name="check" size={11} /> : i + 1}</span>
              {s}
            </button>
          </li>
        ))}
      </ol>
      <div className="pcard__rows" key={step} data-search>
        {rows[step].map((r) => (
          <label key={r.label} className="pcard__row">
            <small>{r.label}</small>
            <span>{r.value}</span>
          </label>
        ))}
      </div>
      {last ? (
        <a className="pill pcard__btn" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
          Get in touch <Icon name="arrowRight" size={14} />
        </a>
      ) : (
        <button className="pill pcard__btn" onClick={() => setStep((s) => s + 1)}>
          Continue <Icon name="arrowRight" size={14} />
        </button>
      )}
      <p className="pcard__foot">
        {resume.links.linkedin ? (
          <>
            Prefer LinkedIn?{' '}
            <a href={resume.links.linkedin} target="_blank" rel="noreferrer">
              View profile
            </a>
          </>
        ) : (
          'Usually replies within a day'
        )}
      </p>
    </div>
  );
}

export function Hero({ resume, isExample, onUpload }: { resume: Resume; isExample: boolean; onUpload: () => void }) {
  const [role, focus] = splitHeadline(resume.headline);
  const motto = (resume.motto || '').replace(/\.$/, '').split(/\.\s*/);
  const chipIcons: IconName[] = ['sparkle', 'file', 'shield', 'clock'];
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero__sky" aria-hidden>
        <span className="hero__sun" />
        <span className="hero__rays" />
      </div>
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__tag">
            <Icon name="sparkle" size={12} /> {focus || 'Portfolio'}
          </p>
          <h1 className="hero__title" data-search>
            {resume.name}
            <span>{role || resume.headline}</span>
          </h1>
          {motto.length > 1 && <p className="hero__motto">{motto.join('. ')}.</p>}
          <p className="hero__intro">{resume.summary ? firstSentence(resume.summary) : resume.tagline}</p>
          <ul className="hero__chips">
            {resume.skills.slice(0, 4).map((s, i) => (
              <li key={s} style={{ ['--i' as string]: i }} data-search>
                <Icon name={chipIcons[i]} size={17} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="hero__actions">
            {isExample ? (
              <button className="pill hero__btn" onClick={onUpload}>
                Upload your CV
              </button>
            ) : (
              <a className="pill hero__btn" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
                Get in touch
              </a>
            )}
            <a className="hero__link" href="#skills">
              Explore skills <Icon name="arrowRight" size={14} />
            </a>
          </div>
        </div>
        <div className="hero__holo" aria-hidden>
          <img src={hologram} alt="" />
          <span className="hero__ring" />
        </div>
        <ProfileCard resume={resume} />
      </div>
    </section>
  );
}

/* ================= stats card ================= */

function Stat({ icon, value, suffix = '', label, run, delay }: { icon: IconName; value: number | string; suffix?: string; label: string; run: boolean; delay: number }) {
  const numeric = typeof value === 'number';
  const n = useCountUp(numeric ? value : 0, run, { duration: 2200, delay });
  const text = useScramble(numeric ? '' : value, run && !numeric, { delay });
  const done = numeric ? n >= value * 0.98 : text === value;
  return (
    <li className="stat">
      <span className="stat__icon">
        <Icon name={icon} size={28} />
      </span>
      <span>
        <b aria-label={`${value}${suffix}`}>
          <span aria-hidden>
            {numeric ? Math.round(n) : text || ' '}
            {suffix && <i className={done ? 'is-on' : ''}>{suffix}</i>}
          </span>
        </b>
        <small>{label}</small>
      </span>
    </li>
  );
}

export function StatsCard({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLUListElement>(0.4);
  const { stats } = resume;
  return (
    <div className="wrap">
      <ul className="stats" ref={ref}>
        <Stat icon="heart" value={stats.years} suffix={stats.yearsPlus ? '+' : ''} label="Years of Experience" run={inView} delay={0} />
        <Stat icon="shield" value={stats.projects} suffix={stats.projectsPlus ? '+' : ''} label="Projects Delivered" run={inView} delay={120} />
        <Stat icon="calendar" value={stats.skills} suffix="+" label="Clinical Skills" run={inView} delay={240} />
        <Stat icon="clock" value={resume.education[0]?.short || '—'} label="Highest Degree" run={inView} delay={360} />
        <Stat icon="star" value={resume.achievements.length + resume.certifications.length} label="Awards & Certifications" run={inView} delay={480} />
      </ul>
    </div>
  );
}

/* ================= skills ("Comprehensive care under one roof") ================= */

const SKILL_ICONS: IconName[] = ['stethoscope2', 'heartPulse', 'activity', 'shield', 'pill2', 'users', 'clipboard', 'video', 'file', 'book'];

export function SkillsSection({ resume }: { resume: Resume }) {
  const track = useRef<HTMLDivElement>(null);
  const [end, setEnd] = useState(false);
  const notes = [...resume.interests, ...resume.certifications, ...resume.projects.map((p) => p.title)];
  const scroll = () => {
    const el = track.current;
    if (!el) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
  };
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <Head label="My skills" id="skills-title" title="Comprehensive care, one clinician" link={{ href: '#projects', text: 'See my projects' }} />
        <div className="skills">
          <div className="skills__track" ref={track} onScroll={(e) => setEnd(e.currentTarget.scrollLeft + e.currentTarget.clientWidth >= e.currentTarget.scrollWidth - 8)}>
            {resume.skills.map((s, i) => (
              <Reveal key={s} delay={(i % 6) * 70} className="skills__cell">
                <GlowCard className="skill" accent={(['purple', 'blue', 'teal'] as Accent[])[i % 3]} phase={i * 0.17} speed={6 + (i % 4)} data-search>
                  <span className="skill__icon">
                    <Icon name={SKILL_ICONS[i % SKILL_ICONS.length]} size={24} />
                  </span>
                  <b>{s}</b>
                  <small>{notes[i % Math.max(notes.length, 1)] || 'Core skill'}</small>
                  <span className="skill__go">
                    <Icon name="arrowRight" size={12} />
                  </span>
                </GlowCard>
              </Reveal>
            ))}
          </div>
          {resume.skills.length > 6 && (
            <button className="skills__next" aria-label={end ? 'Back to the first skills' : 'More skills'} onClick={scroll}>
              <Icon name={end ? 'chevronLeft' : 'chevronRight'} size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= experience ("Experienced. Empathetic. Exceptional.") ================= */

export function ExperienceSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const roles = resume.experience.slice(0, 4);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || roles.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [reduced, paused, roles.length]);

  return (
    <section id="experience" className="section" aria-labelledby="exp-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="wrap">
        <Head label="My experience" id="exp-title" title="Experienced. Empathetic. Exceptional." />
        <div className="team" style={{ ['--n' as string]: Math.max(roles.length, 1) }}>
          {roles.map((r, i) => (
            <Reveal key={r.role + i} delay={i * 90} className="team__cell">
              <GlowCard className={`person ${i === active ? 'is-current' : ''}`} accent={i === active ? 'teal' : 'purple'} active={i === active} phase={i * 0.25} speed={7} onPointerEnter={() => setActive(i)} data-search>
                <span className="person__photo">
                  <span>{initialsOf(r.company || r.role)}</span>
                </span>
                <b>{r.role}</b>
                <span className="person__org">{r.company}</span>
                <small>{r.period}</small>
                {i === active && r.bullets[0] && <em>{r.bullets[0]}</em>}
              </GlowCard>
            </Reveal>
          ))}
          {!roles.length && <p className="empty">No experience section was found in the CV.</p>}
          <div className="trust">
            <Icon name="users" size={30} />
            <h3>Care you can trust, from someone who listens.</h3>
            <p>{resume.tagline || 'Clinical expertise with empathy, every visit.'}</p>
            <a className="pill pill--sm pill--white" href="#contact">
              Meet me <Icon name="arrowRight" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= projects ("Telemedicine") ================= */

export function ProjectsBand({ resume }: { resume: Resume }) {
  const [open, setOpen] = useState(0);
  const projects = resume.projects.slice(0, 4);
  const p = projects[open];
  const goal = resume.goals[1] || resume.goals[0];
  const icons: IconName[] = ['video', 'file', 'clipboard', 'bell'];
  return (
    <section id="projects" className="wrap" aria-labelledby="proj-title">
      <div className="band">
        <div className="band__copy">
          <span className="band__tag">
            <Icon name="video" size={12} /> My projects
          </span>
          <h2 id="proj-title" className="band__title">
            Quality care,
            <br />
            wherever it’s needed
          </h2>
          <p className="band__desc" key={open} data-search>
            {p ? p.description || p.meta : 'Add projects to the CV to show them here.'}
          </p>
          <ul className="band__list" role="tablist" aria-label="Projects">
            {projects.map((x, i) => (
              <li key={x.title}>
                <button role="tab" aria-selected={open === i} className={open === i ? 'is-on' : ''} onClick={() => setOpen(i)} onPointerEnter={() => setOpen(i)} data-search>
                  <Icon name={icons[i % icons.length]} size={16} />
                  {x.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="band__video" aria-hidden>
          <span className="band__bar">
            <span className="band__live" /> {resume.name} · {p?.title || 'Consultation'}
          </span>
          <img src={video} alt="" loading="lazy" />
          <span className="band__controls">
            <i />
            <i />
            <i className="is-red" />
          </span>
        </div>
        {goal && (
          <div className="band__next">
            <p className="band__next-title">Up next</p>
            <div className="band__who">
              <span>{initialsOf(resume.name)}</span>
              <span>
                <b>{goal.value}</b>
                <small>{goal.label}{goal.note ? ` · ${goal.note}` : ''}</small>
              </span>
            </div>
            <a className="pill pill--sm band__btn" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
              Talk about it <Icon name="arrowRight" size={14} />
            </a>
            <a className="band__all" href="#results">
              View all milestones <Icon name="arrowRight" size={12} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= learning path ("Care navigator") ================= */

export function PathSection({ resume, isExample, onDownloadCv }: { resume: Resume; isExample: boolean; onDownloadCv: () => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const steps = [
    ...resume.education.map((e) => ({ icon: 'graduation' as IconName, title: e.degree, text: [e.institution, e.year].filter(Boolean).join(' · ') })),
    ...resume.certifications.map((c) => ({ icon: 'shield' as IconName, title: c, text: 'Certification' })),
  ].slice(0, 3);
  return (
    <section className="section" aria-labelledby="path-title">
      <div className={`wrap path ${inView ? 'is-on' : ''}`} ref={ref}>
        <div className="path__intro">
          <span className="label">
            <Icon name="graduation" size={12} /> Learning path
          </span>
          <h2 id="path-title" className="path__title">
            Trained, certified
            <br />
            and still learning.
          </h2>
          <p>Degrees and certifications behind the care I give.</p>
        </div>
        <div className="path__card">
          <ol className="path__steps">
            {steps.map((s, i) => (
              <li key={s.title} style={{ ['--i' as string]: i }} data-search>
                <span className="path__icon">
                  <Icon name={s.icon} size={18} />
                </span>
                <b>
                  {i + 1}. {s.title}
                </b>
                <small>{s.text}</small>
              </li>
            ))}
          </ol>
          <div className="path__cta">
            <button className="pill pill--sm" onClick={onDownloadCv}>
              {isExample ? 'Download sample CV' : 'Download CV'}
            </button>
            <small>Takes less than a minute to read</small>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= achievements ("Real stories. Real impact.") ================= */

export function ResultsSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const items = [...resume.achievements.map((t) => ({ text: t, kind: 'Achievement' })), ...resume.certifications.map((t) => ({ text: t, kind: 'Certification' }))];
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const count = Math.min(4, items.length);
  const shown = Array.from({ length: count }, (_, k) => items[(start + k) % items.length]);

  useEffect(() => {
    if (reduced || paused || items.length <= 4) return;
    const t = window.setInterval(() => setStart((s) => (s + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, items.length]);

  return (
    <section id="results" className="section" aria-labelledby="results-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="wrap">
        <span className="label">Milestones</span>
        <h2 id="results-title" className="title">
          Real work. Real impact.
        </h2>
        <div className={`stories ${inView ? 'is-on' : ''}`} ref={ref}>
          <button className="stories__arrow" aria-label="Previous" disabled={items.length <= 4} onClick={() => setStart((s) => (s - 1 + items.length) % items.length)}>
            <Icon name="chevronLeft" size={15} />
          </button>
          <div className="stories__row" style={{ ['--n' as string]: Math.max(count, 1) }}>
            {shown.map((it, i) => (
              <GlowCard key={it.text + start} className="story" accent={i % 2 ? 'blue' : 'purple'} phase={i * 0.25} speed={8} data-search>
                <Icon name="quote" size={16} className="story__mark" />
                <p>{it.text}</p>
                <footer>
                  <small>— {it.kind}</small>
                  <span className="stars" aria-hidden>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Icon key={s} name="star" size={12} style={{ ['--s' as string]: s }} />
                    ))}
                  </span>
                </footer>
              </GlowCard>
            ))}
            {!items.length && <p className="empty">Add Achievements or Certifications to the CV to show them here.</p>}
          </div>
          <button className="stories__arrow" aria-label="Next" disabled={items.length <= 4} onClick={() => setStart((s) => (s + 1) % items.length)}>
            <Icon name="chevronRight" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ + tools ================= */

export function FaqRow({ resume }: { resume: Resume }) {
  const [open, setOpen] = useState<number | null>(0);
  const [role, focus] = splitHeadline(resume.headline);
  const faqs = [
    { q: 'What kind of care do you provide?', a: [role, focus].filter(Boolean).join(' — ') + (resume.skills.length ? `. Day to day: ${resume.skills.slice(0, 4).join(', ')}.` : '') },
    { q: 'Do you offer telemedicine?', a: resume.skills.some((s) => /tele/i.test(s)) ? 'Yes — video consultations and follow-ups are part of my regular work.' : 'Ask me — I am happy to talk about remote and hybrid work.' },
    { q: 'What are your qualifications?', a: [...resume.education.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(', ')), ...resume.certifications].join('; ') },
    { q: 'Where are you based?', a: resume.location ? `${resume.location} — open to on-site and remote roles.` : '' },
    { q: 'What are you looking for next?', a: resume.goals.map((g) => `${g.label}: ${g.value}${g.note ? ` (${g.note})` : ''}`).join(' · ') },
  ].filter((f) => f.a);
  const tags = [...resume.interests, ...resume.skills];
  return (
    <section className="wrap faqrow" aria-label="Questions and tools">
      <div className="faq">
        <h2 className="faq__title">FAQs</h2>
        <p className="faq__sub">Answers from my CV</p>
        <ul>
          {faqs.map((f, i) => (
            <li key={f.q} className={open === i ? 'is-open' : ''} data-search>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <Icon name="chevronDown" size={14} />
              </button>
              <div className="faq__a">
                <p>{f.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="tools">
        <h2 className="tools__title">Areas I work across</h2>
        <ul className="tools__list">
          {tags.map((t, i) => (
            <li key={t + i} style={{ ['--i' as string]: i }} data-search>
              {t}
            </li>
          ))}
        </ul>
        <p className="tools__more">and always learning more…</p>
      </div>
    </section>
  );
}

/* ================= contact ================= */

export function ContactSection({ resume }: { resume: Resume }) {
  const city = resume.location?.split(',')[0] || 'Your city';
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="contact__info">
          <span className="label">Get in touch</span>
          <h2 id="contact-title" className="title">
            I’m here to help
          </h2>
          <ul>
            {resume.phone && (
              <li>
                <Icon name="phone" size={16} /> {resume.phone}
              </li>
            )}
            {resume.email && (
              <li>
                <Icon name="mail" size={16} /> <a href={`mailto:${resume.email}`}>{resume.email}</a>
              </li>
            )}
            {resume.location && (
              <li>
                <Icon name="pin" size={16} /> {resume.location}
              </li>
            )}
          </ul>
        </div>
        <div className="map" aria-hidden>
          <svg viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0 140 C 80 120, 120 160, 200 130 S 330 90, 400 110" />
            <path d="M60 0 C 70 60, 40 120, 80 200" />
            <path d="M260 0 C 240 70, 300 120, 280 200" />
            <path d="M0 60 L 400 80" />
            <path d="M150 0 L 170 200" />
          </svg>
          <span className="map__pin">
            <Icon name="pin" size={18} />
            <b>{city}</b>
          </span>
        </div>
        <div className="hours">
          <h3>Availability</h3>
          <ul>
            <li>
              <span>Monday – Friday</span>
              <b>Open to roles</b>
            </li>
            <li>
              <span>Telehealth</span>
              <b>{resume.skills.some((s) => /tele/i.test(s)) ? 'Experienced' : 'Open to it'}</b>
            </li>
            <li>
              <span>Start</span>
              <b>By arrangement</b>
            </li>
          </ul>
          <a className="pill pill--sm hours__btn" href={resume.email ? `mailto:${resume.email}` : '#home'}>
            Email me <Icon name="arrowRight" size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================= footer ================= */

export function Footer({ resume }: { resume: Resume }) {
  const [role] = splitHeadline(resume.headline);
  const [msg, setMsg] = useState('');
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <span className="footer__brand">
            <Logo size={34} light />
            <span>
              <b className="wordmark">{resume.name}</b>
              <small>{role}</small>
            </span>
          </span>
          <p className="footer__motto">{resume.motto || resume.tagline}</p>
          <nav className="footer__social" aria-label="Profiles">
            {resume.links.linkedin && (
              <a href={resume.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={14} />
              </a>
            )}
            {resume.links.github && (
              <a href={resume.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" size={14} />
              </a>
            )}
            {resume.email && (
              <a href={`mailto:${resume.email}`} aria-label="Email">
                <Icon name="mail" size={14} />
              </a>
            )}
          </nav>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Skills</h4>
          <ul>
            {resume.skills.slice(0, 6).map((s) => (
              <li key={s}>
                <a href="#skills">{s}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Projects</h4>
          <ul>
            {resume.projects.slice(0, 5).map((p) => (
              <li key={p.title}>
                <a href="#projects">{p.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Send a quick note</h4>
          <p className="footer__note">Write a line and it opens in your email app.</p>
          <form
            className="footer__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (resume.email) window.location.href = `mailto:${resume.email}?subject=${encodeURIComponent('Hello')}&body=${encodeURIComponent(msg)}`;
            }}
          >
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Your message" aria-label="Your message" />
            <button aria-label="Send">
              <Icon name="arrowUpRight" size={15} />
            </button>
          </form>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>
          © {new Date().getFullYear()} {resume.name}. Built from a CV.
        </span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
