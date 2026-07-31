import type { Metadata } from "next";
import { ScmTrainingModelSection } from "@/components/trainings/ScmTrainingModelSection";
import { TrainingManager } from "@/components/trainings/TrainingManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { SafeImage } from "@/components/ui/SafeImage";
import { club, galleryItems } from "@/lib/content";
import { contentOverride, readContentOverrides } from "@/lib/content-overrides";
import { readTrainings } from "@/lib/training-store";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrenamientos",
  description: `Sesiones de entrenamiento de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Entrenamientos | ${club.name}`,
    `Sesiones de entrenamiento de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

export default async function EntrenamientosPage() {
  const overrides = await readContentOverrides();
  const trainings = await readTrainings();

  return (
    <main className="bg-bg text-text">
      <PageHero
        title={contentOverride(
          overrides,
          "entrenamientos.hero.title",
          "Entrenamientos",
        )}
        subtitle={contentOverride(
          overrides,
          "entrenamientos.hero.subtitle",
          "Registro visual de sesiones, comunidad y proceso deportivo.",
        )}
        eyebrow={contentOverride(
          overrides,
          "entrenamientos.hero.eyebrow",
          "Entrenamientos",
        )}
      />

      <ScmTrainingModelSection />

      <RevealSection>
        <section className="section-shell section-padding">
          <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:items-end">
            <div>
              <p className="eyebrow">
                {contentOverride(
                  overrides,
                  "entrenamientos.gallery.eyebrow",
                  "Memoria visual",
                )}
              </p>
              <h2 className="font-gallery mt-4 text-balance text-3xl font-black leading-[1.05] sm:text-4xl lg:text-5xl">
                {contentOverride(
                  overrides,
                  "entrenamientos.gallery.title",
                  "Sesiones que muestran disciplina, trabajo técnico y comunidad.",
                )}
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                {contentOverride(
                  overrides,
                  "entrenamientos.gallery.description",
                  "Las publicaciones del administrador aparecen debajo como registro público. Las imágenes de apoyo editorial refuerzan la identidad visual mientras el club suma material propio.",
                )}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryItems.map((item) => (
                <article
                  key={item.title}
                  className="cinematic-card alive-card group relative min-h-[220px] overflow-hidden rounded-lg border border-border"
                >
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="interactive-image object-cover"
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="image-card-overlay absolute inset-0" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
                      {item.category}
                    </p>
                    <h3 className="font-gallery mt-1 text-2xl font-black">
                      {item.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="section-shell pb-24">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">
              {contentOverride(
                overrides,
                "entrenamientos.published.eyebrow",
                "Entrenamientos publicados",
              )}
            </p>
            <h2 className="font-training mt-3 text-4xl font-black sm:text-5xl">
              {contentOverride(
                overrides,
                "entrenamientos.published.title",
                "Registro de sesiones",
              )}
            </h2>
          </div>
          <TrainingManager initialItems={trainings} />
        </section>
      </RevealSection>
    </main>
  );
}
