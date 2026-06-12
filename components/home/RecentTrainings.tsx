import { TrainingLoopShowcase } from "@/components/home/TrainingLoopShowcase";
import { readTrainings } from "@/lib/training-store";

export async function RecentTrainings() {
  const trainings = await readTrainings();
  const recent = [...trainings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return <TrainingLoopShowcase items={recent} />;
}
