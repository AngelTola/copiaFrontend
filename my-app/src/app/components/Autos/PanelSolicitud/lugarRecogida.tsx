"use client"

export default function LugarRecogida() {
    return (
        <div className="border border-black rounded-xl w-[325px] h-[150px] p-4 bg-white shadow-sm flex flex-col">
            {/* Título con ícono integrado */}
            <div className="flex items-center gap-2">
                <h2 className='text-[#11295B] font-bold text-lg'>Lugar de recogida y devolucion:</h2>
            </div>
            
            {/* Contenedor del lugar con altura fija para mantener el espacio */}
            <div className="flex-grow flex items-center">
                <div className="flex items-start gap-2 w-full">
                    <span className="inline-block mt-1 w-2 h-2 bg-[#11295B] rounded-full flex-shrink-0"></span>
                    <span className="text-black">Aeropuerto Jorge Wilstermann</span>
                </div>
            </div>
        </div>
    )
}