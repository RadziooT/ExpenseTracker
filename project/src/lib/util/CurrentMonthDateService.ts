import { getLocalTimeZone, startOfMonth, today } from "@internationalized/date";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export function getCurrentMonthDateRange(): DateRange {
  return {
    dateFrom: startOfMonth(today(getLocalTimeZone())).toString(),
    dateTo: today(getLocalTimeZone()).toString(),
  };
}
