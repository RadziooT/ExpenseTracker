"use client";

import React, { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

type Props = {
  initialFromDate: CalendarDate;
  initialToDate: CalendarDate;
  onSearch: (range: { fromDate: CalendarDate; toDate: CalendarDate }) => void;
};

export default function DateRangePicker({
  initialFromDate,
  initialToDate,
  onSearch,
}: Props) {
  const [fromDate, setFromDate] = useState<CalendarDate>(initialFromDate);
  const [toDate, setToDate] = React.useState<CalendarDate>(initialToDate);

  const handleSearch = () => {
    console.log(fromDate);
    onSearch({
      fromDate,
      toDate,
    });
  };

  return (
    <div className="flex justify-center space-x-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <I18nProvider locale="pl-PL">
            <DatePicker
              showMonthAndYearPickers
              variant="bordered"
              labelPlacement="outside"
              firstDayOfWeek="mon"
              label="From"
              value={fromDate}
              onChange={(date) => setFromDate(date!)}
            />

            <DatePicker
              showMonthAndYearPickers
              variant="bordered"
              labelPlacement="outside"
              firstDayOfWeek="mon"
              label="To"
              value={toDate}
              onChange={(date) => setToDate(date!)}
            />
          </I18nProvider>
        </div>

        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );
}
