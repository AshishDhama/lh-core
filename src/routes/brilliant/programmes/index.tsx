import { createFileRoute } from '@tanstack/react-router';

import { BrilliantHeader } from '@/forge/patterns/BrilliantHeader';
import { BrilliantCarousel } from '@/forge/patterns/BrilliantCarousel';
import { BrilliantAssessmentCarouselCard } from '@/forge/composites/BrilliantAssessmentCarouselCard';
import { Overline, Title, Text } from '@/forge/primitives/Typography';
import { programList } from '@/data/programs';

export const Route = createFileRoute('/brilliant/programmes/')({
  component: BrilliantProgrammesPage,
});

interface PathSection {
  title: string;
  overline: string;
  items: {
    id: string;
    title: string;
    illustration: string;
    progress?: number;
    isNew?: boolean;
  }[];
}

function buildSections(): PathSection[] {
  return programList.map((program) => {
    const allExercises = [
      ...program.seqExercises,
      ...program.openExercises,
    ];

    return {
      title: program.name,
      overline: program.desc.slice(0, 60),
      items: allExercises.map((ex) => ({
        id: ex.id,
        title: ex.name,
        illustration: ex.illustration ?? 'assessment',
        progress: ex.pct > 0 ? ex.pct : undefined,
        isNew: ex.status === 'notstarted',
      })),
    };
  });
}

function BrilliantProgrammesPage() {
  const sections = buildSections();

  return (
    <div className="min-h-screen bg-surface-primary">
      <BrilliantHeader activeTab="courses" streakCount={7} energyCount={42} userName="Priya Sharma" />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Hero header */}
        <section className="text-center mb-12">
          <Overline className="mb-3 block">EXPLORE PROGRAMMES</Overline>
          <Title level={1} weight="bold" heroSize="6xl" color="primary" className="!mb-3">
            Learn by doing
          </Title>
          <Text size="lg" color="secondary" className="max-w-lg mx-auto">
            Interactive assessments and exercises designed to build real competencies.
          </Text>
        </section>

        {/* Path sections with carousel rows */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <Overline className="mb-1 block">{section.overline}</Overline>
              <Title level={3} weight="bold" color="primary" className="!mb-4">
                {section.title}
              </Title>

              <BrilliantCarousel>
                {section.items.map((item) => (
                  <BrilliantAssessmentCarouselCard
                    key={item.id}
                    title={item.title}
                    illustration={item.illustration as 'assessment'}
                    progress={item.progress}
                    isNew={item.isNew}
                  />
                ))}
              </BrilliantCarousel>
            </section>
          ))}
        </div>

        <div className="h-16" aria-hidden="true" />
      </main>
    </div>
  );
}
