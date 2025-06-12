import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={className}
            classNames={{
                months: 'flex flex-col items-center justify-center space-y-4', // Centrado
                month: 'space-y-4 w-full flex flex-col items-center', // Centrado
                caption: 'flex justify-center relative py-4 w-full', // Más espacio vertical
                caption_label: 'text-base font-medium text-center', // Texto más grande
                nav: 'flex absolute top-3 w-full justify-between px-2', // Ajustado para alinear con el texto
                nav_button: 'h-8 w-8 bg-white text-black hover:bg-gray-100 p-0 rounded-md', // Botones ligeramente más grandes
                nav_button_previous: 'absolute left-2',
                nav_button_next: 'absolute right-2',
                table: 'w-full border-collapse space-y-1 max-w-[300px]', // Ancho máximo para centrar
                head_row: 'flex justify-center', // Centrado
                head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center', // Centrado
                row: 'flex w-full justify-center mt-2', // Centrado
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                day_selected: 'bg-[#fca311] text-white hover:bg-[#e69500]',
                day_today: 'bg-gray-100',
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };