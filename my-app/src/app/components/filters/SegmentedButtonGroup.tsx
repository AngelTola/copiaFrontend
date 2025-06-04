interface SegmentedButtonGroupProps {
  buttons: string[];
  activeIndex: number;
  onClick: (index: number) => void;
}

export default function SegmentedButtonGroup({
  buttons,
  activeIndex,
  onClick,
}: SegmentedButtonGroupProps) {
  return (
    <div className="flex overflow-x-auto md:overflow-visible relative w-full md:w-auto justify-start md:justify-center">
      {buttons.map((label, i) => (
        <button
          key={i}
          onClick={() => onClick(i)}
          className={`relative px-6 md:px-12 py-[0.2rem] border border-[#00000033] text-[var(--azul-oscuro)] 
            font-[var(--tamaño-regular)] bg-[var(--blanco)] shadow-[var(--sombra)] text-sm md:text-base
            ${i === 0 ? 'rounded-l-full border-r-0' : ''}
            ${i === buttons.length - 1 ? 'rounded-r-full border-l-0' : ''}
            ${i !== 0 && i !== buttons.length - 1 ? 'border-x-0' : ''}
            ${activeIndex === i ? 'font-semibold' : ''}
          `}
        >
          {label}
          {i !== buttons.length - 1 && (
            <span className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
          )}
          {i !== 0 && (
            <span className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
          )}
        </button>
      ))}
    </div>
  );
}