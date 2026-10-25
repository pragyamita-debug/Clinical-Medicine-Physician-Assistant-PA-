import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Logo } from './Logo';

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'results', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

interface Props {
  name: string;
  tagline: string;
  email?: string;
  active: string;
  isExample: boolean;
  onUploadNew: () => void;
}

/** Transparent over the hero (like the design), turns to frosted glass once the page scrolls. */
export function NavBar({ name, tagline, email, active, isExample, onUploadNew }: Props) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMobile(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <header ref={ref} className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#home">
          <Logo size={46} />
          <span className="nav__name">
            <span className="wordmark">{name}</span>
            <small>{tagline}</small>
          </span>
        </a>

        <nav className={`nav__links ${mobile ? 'is-open' : ''}`} aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} aria-current={active === n.id ? 'location' : undefined} onClick={() => setMobile(false)}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav__end">
          {isExample ? (
            <button className="pill nav__cta" onClick={onUploadNew}>
              Upload CV
            </button>
          ) : (
            <a className="pill nav__cta" href={email ? `mailto:${email}` : '#contact'}>
              Get in Touch
            </a>
          )}
          <button className="nav__icon nav__burger" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
            <Icon name={mobile ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
