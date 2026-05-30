import type { Metadata } from "next";
import { TrainingManager } from "@/components/trainings/TrainingManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { readTrainings } from "@/lib/training-store";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrenamientos",
  description: `Galería de sesiones de entrenamiento de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Entrenamientos | ${club.name}`,
    `Galería de sesiones de entrenamiento de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

export default async function EntrenamientosPage() {
  const trainings = await readTrainings();

  return (
    <div className="bg-bg pt-24 text-text sm:pt-28">
      <PageHero title="Entrenamientos" subtitle="Registro de sesiones del proceso" />

      <RevealSection>
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <TrainingManager initialItems={trainings} />
      </section>
      </RevealSection>
    </div>
  );
}
