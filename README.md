# CV → Dashboard (Clinical Medicine · Physician Assistant)

Candidates upload a CV (PDF, DOCX or TXT) and get an animated portfolio dashboard in a modern-clinic style:
a midnight-indigo hero with a glowing body hologram and a sunrise at its curved edge, lavender-white pages,
violet light, glass cards and real photos.

Everything runs in the browser. The CV is read client-side and never sent to a server.

**Live site:** https://pragyamita-debug.github.io/Clinical-Medicine-Physician-Assistant-PA-/ (after Pages is switched on — see below)

## How it works

0. **Example first** — the page opens on the full design filled with neutral placeholder text
   (`src/data/placeholder.ts`: “Your Name”, “Your Role”, “Project One”…) and an **Upload CV** button.
1. **Upload** — drag a CV onto the drop zone, or try the bundled sample (`src/data/sample-cv.txt`, a fictional physician assistant).
2. **Read** — PDF text comes from pdf.js, Word files from mammoth; both load only when needed.
3. **Parse** — `src/lib/parseResume.ts` splits the text into sections and works out years of experience from
   the date ranges, counting overlapping jobs once. Clinical degrees (M.S., MPAS, MSN, MBBS…) are recognised;
   `Tools: …` lines under a project become its tags.
4. **Review** — the candidate checks what was found and fixes anything before the dashboard is built.
5. **Dashboard** — saved to `localStorage`; the profile menu (top right) can upload another CV, edit, download or go back to the example.

## What the dashboard shows

| Section | Built from |
| --- | --- |
| Top bar | petal mark, name and role, section links, expanding search (Enter jumps to and highlights the match), bell with the goals, profile menu, **Upload CV** / **Get in touch** |
| Hero | focus, name, role, motto, first line of the summary, four top skills; the hologram photo; a 4-step **Profile at a Glance** card (role → education → skills → contact) |
| Stats card | years, projects, skills, highest degree, awards — counting / decoding |
| Skills | a carousel of skill cards with an arrow to scroll |
| Experience | role cards (company initials as the avatar); the lit card walks along and shows its first bullet; a “care you can trust” card |
| Projects | dark band: pick a project to read it, a video-consultation frame titled with it, and an “up next” goal card |
| Learning path | degrees and certifications as numbered steps, plus the CV download |
| Milestones | achievements and certifications as review cards with stars, auto-sliding |
| FAQ + areas | questions answered from the CV; interests and skills as a word cloud |
| Contact | email / phone / city, a small map with the city pinned, availability |
| Footer | links, skills, projects, a quick note that opens an email |

## Animations

| Effect | Where | How |
| --- | --- | --- |
| Counting numbers | stats card | `useCountUp` — rAF + ease-out-expo, starts when in view; the “+” lands when the count finishes |
| Decoding text | highest degree | `useScramble` |
| Moving, lit borders | skill, experience and milestone cards | conic gradient on `@property --angle`, masked to a thin ring, plus a blurred halo (`GlowCard`) |
| Hover | every card, chip, icon and button | pointer spotlight + slight tilt, lift, icons fill violet |
| Rising sun | hero | a warm sun climbs up at the curved bottom edge of the hero and its rays start turning |
| Hologram | hero | the photo floats gently and a ring pulses out from the platform |
| Walks and slides | experience, milestones, profile card | small React timers (pause on hover) |

All motion respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev          # local dev server
npm test             # parser tests (vitest)
npm run build        # static build in dist/
npm run build:single # one self-contained index.html in dist-single/
```

## Publish on GitHub Pages

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (it also runs on every push to `main`).

## Writing a CV that parses well

- Clear headings: **Experience**, **Education**, **Skills**, **Projects**, **Achievements**, **Certifications**.
- Dates on the role line or the line after it: `Jan 2023 – Present`, `03/2021 - 06/2023`, `2019 - 2022`.
- Optional extras: **Goals** (`Goal: …`, `Next Step: …`), **Motto**, **Interests**.
- Text-based PDFs only — scanned images have no text to read.

## Project structure

```
src/
  App.tsx                 example → upload → reading → review → dashboard
  data/placeholder.ts     the general example profile shown before any upload
  data/sample-cv.txt      fictional sample CV
  lib/                    extractText, parseResume (+ tests), dates, storage, types
  hooks/                  useCountUp, useScramble, useInView, usePointerGlow, useScrollSpy
  components/
    NavBar.tsx            top bar, search, bell, profile menu
    Sections.tsx          hero + profile card, stats, skills, experience, projects, learning path, milestones, FAQ, contact, footer
    Dashboard.tsx         page layout
    UploadScreen.tsx, ReviewDialog.tsx
    GlowCard.tsx          the moving-border card
  assets/photos/          hologram, video consultation
  styles/global.css       colour tokens, type, buttons
```

The hologram photo was cut from the design mock-up and enlarged with Real-ESRGAN. The video-consultation photo
uses a plain enlargement instead, because faces that small come out distorted from an AI upscaler. Swap in
higher-resolution photos with the same file names for the sharpest page.
