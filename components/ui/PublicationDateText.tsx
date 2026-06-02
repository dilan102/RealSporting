import { formatPublicationRange } from "@/lib/publication-dates";

type PublicationDateTextProps = {
  startDate: string;
  endDate: string;
  className?: string;
};

export function PublicationDateText({
  startDate,
  endDate,
  className,
}: PublicationDateTextProps) {
  return <time className={className}>{formatPublicationRange(startDate, endDate)}</time>;
}
