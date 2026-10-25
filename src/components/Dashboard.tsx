import { useScrollSpy } from '../hooks/useScrollSpy';
import type { StoredProfile } from '../lib/types';
import { NAV, NavBar } from './NavBar';
import { ContactSection, ExperienceSection, FaqRow, Footer, Hero, PathSection, ProjectsBand, ResultsSection, SkillsSection, splitHeadline, StatsCard } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

interface Props {
  profile: StoredProfile;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onReset: () => void;
  onDownloadCv: () => void;
}

export function Dashboard({ profile, isExample, onUploadNew, onEdit, onReset, onDownloadCv }: Props) {
  const { resume } = profile;
  const active = useScrollSpy(IDS, 140);
  const [role] = splitHeadline(resume.headline);

  return (
    <>
      <NavBar
        name={resume.name}
        tagline={role || resume.headline}
        email={resume.email}
        active={active}
        isExample={isExample}
        onUploadNew={onUploadNew}
      />
      <main>
        <Hero resume={resume} isExample={isExample} onUpload={onUploadNew} onEdit={onEdit} onReset={onReset} />
        <StatsCard resume={resume} />
        <SkillsSection resume={resume} />
        <ExperienceSection resume={resume} />
        <ProjectsBand resume={resume} />
        <PathSection resume={resume} isExample={isExample} onDownloadCv={onDownloadCv} />
        <ResultsSection resume={resume} />
        <FaqRow resume={resume} />
        <ContactSection resume={resume} />
      </main>
      <Footer resume={resume} />
    </>
  );
}
