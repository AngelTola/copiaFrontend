'use client';

interface DriversProps {
  selectedDriver: string;
  setSelectedDriver: (driver: string) => void;
}

export default function Drivers({ selectedDriver, setSelectedDriver }: DriversProps) {
  // Lista de conductores disponibles
  const drivers = [
    { id: '1', nombre: 'Jhonatan Camacho' },
    { id: '2', nombre: 'Orlando Condori Balderrama' },
    { id: '3', nombre: 'Brandon Manuel' },
  ];

  return (
    <div className="border border-black rounded-lg p-3 bg-white">
      <h3 className="text-base sm:text-lg font-semibold text-[#002a5c] mb-2">Seleccione el driver</h3>
      
      <div className="space-y-2">
        <div className="relative">
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full py-2 px-3 border border-black bg-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fca311] appearance-none"
          >
            <option value="" disabled>Seleccione un conductor</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.nombre}>
                {driver.nombre}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" stroke="currentColor" fill="none" />
            </svg>
          </div>
        </div>
        

      </div>
    </div>
  );
}