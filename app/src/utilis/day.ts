import dayjs from "dayjs";
// import "dayjs/locale/ar";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// dayjs.locale("ar");

export function FullDay(dateString: Date): string {
  const date = dayjs(dateString);
  return date.format("D MMMM YYYY HH:mm");
}
export function Day(dateString: string): string {
  const date = dayjs(new Date(dateString));
  return date.format("D/MM/YYYY");
}
export function Time(dateString: string): string {
  const date = dayjs(new Date(dateString));
  return date.format("HH:mm");
}

export const timer = (date: string) => {
  return dayjs(date).fromNow();
};

export function messageDate(dateString: string): string {
  const date = dayjs(new Date(dateString));

  return date.isSame(dayjs(), "day") ? Time(dateString) : Day(dateString);
}
export function messageDateFull(dateString: string): string {
  const date = dayjs(new Date(dateString));

  return date.isSame(dayjs(), "day") ? Time(dateString) : FullDay(new Date(dateString));
}
