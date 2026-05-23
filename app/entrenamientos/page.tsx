import type { Metadata } from "next";
import { TrainingManager } from "@/components/trainings/TrainingManager";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { club } from "@/lib/content";
import { readTrainings } from "@/lib/training-store";

export const metadata: Metadata = {
  title: "Entrenamientos",
  description: `Galería de sesiones de entrenamiento de ${club.name}.`,
};

export const dynamic = "force-dynamic";

export default async function EntrenamientosPage() {
  const trainings = await readTrainings();

  return (
    <div className="pt-28">
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cuerpo técnico"
          title="Entrenamientos"
          description="Registro de sesiones con fotografía y descripción de cada actividad."
        />
        <TrainingManager initialItems={trainings} />
      </section>
    </div>
  );
}
