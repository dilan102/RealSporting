import { TrainingLoopShowcase } from "@/components/home/TrainingLoopShowcase";
import { readTrainings } from "@/lib/training-store";

export async function RecentTrainings() {
  console.log("[RECENT TRAININGS] Fetching trainings...");
  const trainings = await readTrainings();
  console.log("[RECENT TRAININGS] Trainings fetched:", trainings.length, "items");
  const recent = [...trainings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return <TrainingLoopShowcase items={recent} />;
}
