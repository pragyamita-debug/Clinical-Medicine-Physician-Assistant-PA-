import { useEffect, useRef, useState } from 'react';
import type { Goal } from '../lib/types';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'results', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

/** Searches the dashboard text (elements marked data-search), scrolls to the first hit and flashes it. */
function findInPage(term: string) {
  const q = term.trim().toLowerCase();
  if (!q) return false;
  const hit = Array.from(document.querySelectorAll<HTMLElement>('main [data-search]')).find((el) => el.textContent?.toLowerCase().includes(q));
  if (!hit) return false;
  hit.scrollIntoView({ behavior: 'smooth', block: 'center' });
  hit.classList.remove('is-flash');
  void hit.offsetWidth;
  hit.classList.add('is-flash');
  return true;
}

interface Props {
  name: string;
  tagline: string;
  email?: string;
  goals: Goal[];
  active: string;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onDownloadCv: () => void;
  onReset: () => void;
}

type Pop = 'bell' | 'menu' | null;

export function NavBar({ name, tagline, email, goals, active, isExample, onUploadNew, onEdit, onDownloadCv, onReset }: Props) {
  const [pop, setPop] = useState<Pop>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [term, setTerm] = useState('');
  const [miss, setMiss] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPop(null);
        setMobile(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPop(null);
        setSearch(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (search) input.current?.focus();
  }, [search]);

  const toggle = (p: Pop) => setPop((cur) => (cur === p ? null : p));
  const actions: { icon: IconName; label: string; run: () => void }[] = [
    { icon: 'upload', label: isExample ? 'Upload a CV' : 'Upload a new CV', run: onUploadNew },
    { icon: 'edit', label: 'Edit details', run: onEdit },
    { icon: 'download', label: isExample ? 'Download the sample CV' : 'Download the CV', run: onDownloadCv },
  ];
  if (!isExample) actions.push({ icon: 'refresh', label: 'Back to the example', run: onReset });

  return (
    <header ref={ref} className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#home">
          <Logo />
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
          <form
            className={`nav__search ${search ? 'is-open' : ''} ${miss ? 'is-miss' : ''}`}
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!search) return setSearch(true);
              setMiss(!findInPage(term));
            }}
          >
            <input
              ref={input}
              type="search"
              value={term}
              placeholder="Search the dashboard…"
              aria-label="Search the dashboard"
              tabIndex={search ? 0 : -1}
              onChange={(e) => {
                setTerm(e.target.value);
                setMiss(false);
              }}
              onBlur={() => !term && setSearch(false)}
            />
            <button className="nav__icon" aria-label={search ? 'Search' : 'Open search'} type="submit">
              <Icon name="search" size={18} />
            </button>
          </form>

          <div className="nav__pop">
            <button className="nav__icon nav__bell" aria-label="What’s next" aria-expanded={pop === 'bell'} onClick={() => toggle('bell')}>
              <Icon name="bell" size={18} />
              {goals.length > 0 && <i className="nav__dot" />}
            </button>
            {pop === 'bell' && (
              <div className="popover popover--wide" role="dialog" aria-label="What’s next">
                <p className="popover__title">What’s next</p>
                {goals.length ? (
                  <ul className="popover__list">
                    {goals.slice(0, 3).map((g) => (
                      <li key={g.label + g.value}>
                        <small>{g.label}</small>
                        {g.value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="popover__empty">Add a Goals section to the CV to show it here.</p>
                )}
              </div>
            )}
          </div>

          <div className="nav__pop">
            <button className="nav__avatar" aria-label="Dashboard options" aria-haspopup="menu" aria-expanded={pop === 'menu'} onClick={() => toggle('menu')}>
              <Icon name="user" size={19} />
            </button>
            {pop === 'menu' && (
              <ul className="popover" role="menu">
                {actions.map((a) => (
                  <li key={a.label} role="none">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setPop(null);
                        a.run();
                      }}
                    >
                      <Icon name={a.icon} size={16} /> {a.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isExample ? (
            <button className="pill pill--sm nav__cta" onClick={onUploadNew}>
              Upload CV
            </button>
          ) : (
            <a className="pill pill--sm nav__cta" href={email ? `mailto:${email}` : '#contact'}>
              Get in touch
            </a>
          )}
          <button className="nav__icon nav__burger" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
            <Icon name={mobile ? 'close' : 'menu'} size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
