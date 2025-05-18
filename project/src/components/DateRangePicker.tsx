import React, { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { Button, DatePicker } from "@heroui/react";

type Props = {
  disabled?: boolean;
  initialFromDate: CalendarDate;
  initialToDate: CalendarDate;
  onSearch: (range: { fromDate: CalendarDate; toDate: CalendarDate }) => void;
};

export default function DateRangePicker({
  disabled = false,
  initialFromDate,
  initialToDate,
  onSearch,
}: Props) {
  const [fromDate, setFromDate] = useState<CalendarDate>(initialFromDate);
  const [toDate, setToDate] = React.useState<CalendarDate>(initialToDate);

  const handleSearch = () => {
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
              isDisabled={disabled}
              onChange={(date) => setFromDate(date!)}
            />

            <DatePicker
              showMonthAndYearPickers
              variant="bordered"
              labelPlacement="outside"
              firstDayOfWeek="mon"
              label="To"
              value={toDate}
              isDisabled={disabled}
              onChange={(date) => setToDate(date!)}
            />
          </I18nProvider>
        </div>

        {disabled ? (
          <p>In offline mode only current month data is available</p>
        ) : (
          <Button
            onPress={handleSearch}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </Button>
        )}
      </div>
    </div>
  );
}
