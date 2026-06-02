import { endDateCutoffForQuery } from "@/lib/publication-dates";
import { prisma } from "@/lib/prisma";
import { removeUpload } from "@/lib/upload-store";

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

export async function cleanupExpiredNews(now = new Date()) {
  const cutoff = endDateCutoffForQuery(now);
  const expired = await prisma.noticia
    .findMany({
      where: { fechaFin: { not: null, lte: cutoff } },
      select: { id: true, imagen: true },
    })
    .catch((error: unknown) => {
      throw databaseError("consultar noticias vencidas", error);
    });

  if (expired.length === 0) {
    return { deleted: 0, cutoff };
  }

  await prisma.noticia
    .deleteMany({ where: { id: { in: expired.map((item) => item.id) } } })
    .catch((error: unknown) => {
      throw databaseError("borrar noticias vencidas", error);
    });

  await Promise.all(
    expired.map((item) => (item.imagen ? removeUpload(item.imagen, "news") : undefined)),
  );

  return { deleted: expired.length, cutoff };
}

export async function cleanupExpiredTrainings(now = new Date()) {
  const cutoff = endDateCutoffForQuery(now);
  const expired = await prisma.entrenamiento
    .findMany({
      where: { fechaFin: { not: null, lte: cutoff } },
      select: { id: true, imagen: true, imagenes: true, videos: true },
    })
    .catch((error: unknown) => {
      throw databaseError("consultar entrenamientos vencidos", error);
    });

  if (expired.length === 0) {
    return { deleted: 0, cutoff };
  }

  await prisma.entrenamiento
    .deleteMany({ where: { id: { in: expired.map((item) => item.id) } } })
    .catch((error: unknown) => {
      throw databaseError("borrar entrenamientos vencidos", error);
    });

  await Promise.all(
    expired.flatMap((item) => {
      const media = [
        ...(item.imagen ? [item.imagen] : []),
        ...(item.imagenes ?? []),
        ...(item.videos ?? []),
      ];

      return media.map((url) => removeUpload(url, "trainings"));
    }),
  );

  return { deleted: expired.length, cutoff };
}

export async function cleanupExpiredContent(now = new Date()) {
  const news = await cleanupExpiredNews(now);
  const trainings = await cleanupExpiredTrainings(now);

  return {
    news,
    trainings,
    deleted: news.deleted + trainings.deleted,
  };
}
