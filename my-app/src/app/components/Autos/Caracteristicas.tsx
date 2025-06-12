import Image from 'next/image';
import { Auto } from '@/app/types/auto';

type AutoClaveMostrable = 'asientos' | 'kilometraje' | 'transmision' | 'combustible' | 'capacidadMaletero';

const caracteristicas: {
  icon: string;
  key: AutoClaveMostrable;
  label: string;
  suffix: string;
}[] = [
  { icon: '/imagenesIconos/usuario.png', key: 'asientos', label: 'Capacidad', suffix: ' personas' },
  { icon: '/imagenesIconos/velocimetro.png', key: 'kilometraje', label: 'Kilometraje', suffix: ' km' },
  { icon: '/imagenesIconos/cajaDeCambios.png', key: 'transmision', label: 'Transmisión', suffix: '' },
  { icon: '/imagenesIconos/gasolinera.png', key: 'combustible', label: 'Combustible', suffix: '' },
  { icon: '/imagenesIconos/maleta.png', key: 'capacidadMaletero', label: 'Maletero', suffix: ' equipaje/s' },
];

export default function Caracteristicas({ auto }: { auto: Auto }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-4">
      {caracteristicas.map(({ icon, key, label, suffix }, index) => (
        <div key={index} className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <Image
            src={icon}
            alt={label}
            width={40}
            height={40}
            className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]"
            unoptimized
          />
          <div className="flex flex-col">
            <span className="font-bold text-[14px] sm:text-[16px] text-black whitespace-nowrap">
              {String(auto[key])
                .charAt(0)
                .toUpperCase() + String(auto[key]).slice(1).toLowerCase()}
              {suffix}
            </span>
            <span className="text-[12px] sm:text-[14px] text-[#292929]">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}