import dayjs, { Dayjs } from 'dayjs';

export function createDayjsDate(args: {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
}): Dayjs {
  const now = dayjs(); // Get the current date and time

  const {
    year = now.year(),   // Default to the current year
    month = now.month(), // Default to the current month (0-11)
    date = now.date(),   // Default to the current day of the month
    hour = now.hour(),   // Default to the current hour
    minute = now.minute(), // Default to the current minute
  } = args;

  return dayjs(new Date(year, month, date, hour, minute));
}
