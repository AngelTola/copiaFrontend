'use client';

import { Calendar } from "@/app/components/Autos/ui/calendar";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale"; 

interface CalendarReservaProps {
    dateRange: {
    from: Date | undefined;
    to: Date | undefined;
};
    setDateRange: React.Dispatch<React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>>;
    onChange?: (range: DateRange | undefined) => void;
}

export default function CalendarReserva({
    dateRange,
    setDateRange,
    onChange,
}: CalendarReservaProps) {
    const today = new Date();

    const handleSelect = (range: DateRange | undefined) => {
    const nuevoRango = range
        ? { from: range.from ?? undefined, to: range.to ?? undefined }
        : { from: undefined, to: undefined };

    setDateRange(nuevoRango);
    if (onChange) onChange(range);
    };

return (
    <Calendar
        mode="range"
        selected={dateRange}
        onSelect={handleSelect}
        numberOfMonths={1}
        locale={es}
        disabled={{ before: today }}
        className="rounded-md border shadow"
    />
);
}