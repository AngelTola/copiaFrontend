interface Props {
    precioPorDia: string
    dias?: number
    montoGarantia?: number // Hacemos que sea opcional para evitar errores
  }
  
  export default function Precio({ precioPorDia, dias = 1, montoGarantia = 500 }: Props) {
    // Convertir a número y calcular
    const precioBOB = Number.parseFloat(precioPorDia)
    const precioUSD = precioBOB / 6.89
  
    // Asegurarnos de que montoGarantia sea un número
    const garantiaBOB = typeof montoGarantia === "number" ? montoGarantia : 500
    const garantiaUSD = garantiaBOB / 6.89
  
    // Calcular el precio total por los días seleccionados
    const subtotalBOB = precioBOB * dias
    const subtotalUSD = precioUSD * dias
  
    const totalBOB = subtotalBOB + garantiaBOB
    const totalUSD = subtotalUSD + garantiaUSD
  
    return (
      <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
        <h3 className="text-[#11295b] font-semibold text-lg mb-4">Desglose del precio</h3>
  
        {/* Precio por día - BOB primero */}
        <div className="flex justify-between">
          <span className="font-normal text-black">Precio por día:</span>
          <span className="font-normal text-black">{precioBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{precioUSD.toFixed(2)} USD</div>
  
        {/* Días de alquiler */}
        <div className="flex justify-between mt-3">
          <span className="font-normal text-black">Días de alquiler:</span>
          <span className="font-normal text-black">{dias}</span>
        </div>
  
        {/* Subtotal */}
        <div className="flex justify-between mt-3 border-t pt-2 border-gray-300">
          <span className="font-medium text-black">Subtotal:</span>
          <span className="font-medium text-black">{subtotalBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{subtotalUSD.toFixed(2)} USD</div>
  
        {/* Garantía */}
        <div className="flex justify-between mt-3">
          <span className="font-normal text-black">Garantía:</span>
          <span className="font-normal text-black">{garantiaBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{garantiaUSD.toFixed(2)} USD</div>
  
        {/* Precio total */}
        <div className="flex justify-between mt-4 border-t pt-2 border-gray-300">
          <span className="font-semibold text-black">Precio total:</span>
          <span className="font-semibold text-black">{totalBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{totalUSD.toFixed(2)} USD</div>
      </div>
    )
  }