"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const getSiguienteHora = (currentTime: Date) => {
  const siguienteHora = new Date(currentTime)
  siguienteHora.setMinutes(0, 0, 0)
  siguienteHora.setHours(siguienteHora.getHours() + 1)
  return siguienteHora
}

interface BarraReservaProps {
  onBuscarDisponibilidad: (fechaInicio: string, fechaFin: string) => void
}

const BarraReserva: React.FC<BarraReservaProps> = ({ onBuscarDisponibilidad }) => {
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [pickupTime, setPickupTime] = useState<string>("")
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [returnTime, setReturnTime] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [formValid, setFormValid] = useState<boolean>(false)

  useEffect(() => {
    if (pickupDate && pickupTime && returnDate && returnTime) {
      const dataToSave = {
        pickupDate: pickupDate.toISOString(),
        pickupTime,
        returnDate: returnDate.toISOString(),
        returnTime,
      }
      localStorage.setItem("reservaData", JSON.stringify(dataToSave))
    }
  }, [pickupDate, pickupTime, returnDate, returnTime])

  const handleDatesChange = useCallback(() => {
    setErrorMessage("")
    setFormValid(false)

    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      return
    }

    if (pickupDate && returnDate) {
      const pickupDay = new Date(pickupDate)
      pickupDay.setHours(0, 0, 0, 0)
      const returnDay = new Date(returnDate)
      returnDay.setHours(0, 0, 0, 0)

      if (returnDay < pickupDay) {
        setErrorMessage("La fecha de devolución debe ser posterior a la fecha de recogida.")
        return
      }
    }

    if (pickupDate && returnDate && pickupTime && returnTime) {
      const pickupDateTime = new Date(pickupDate)
      const [pickupHour, pickupMinute] = pickupTime.split(":").map(Number)
      pickupDateTime.setHours(pickupHour, pickupMinute || 0, 0, 0)

      const returnDateTime = new Date(returnDate)
      const [returnHour, returnMinute] = returnTime.split(":").map(Number)
      returnDateTime.setHours(returnHour, returnMinute || 0, 0, 0)

      if (pickupDateTime.getTime() === returnDateTime.getTime()) {
        setErrorMessage("La fecha y hora de recogida y devolución no pueden ser iguales.")
        return
      }

      const sameDay = pickupDate.toISOString().split("T")[0] === returnDate.toISOString().split("T")[0]

      if (sameDay && returnTime <= pickupTime) {
        setErrorMessage("La hora de devolución debe ser posterior a la hora de recogida.")
        return
      }

      if (returnDateTime <= pickupDateTime) {
        setErrorMessage("La fecha y hora de devolución deben ser posteriores a las de recogida.")
        return
      }
    }

    setFormValid(true)
  }, [pickupDate, pickupTime, returnDate, returnTime])

  useEffect(() => {
    handleDatesChange()
  }, [handleDatesChange])

  const handlePickupDateChange = (date: Date | null) => {
    setPickupDate(date)

    if (date) {
      setReturnDate(null)
      setReturnTime("")
      setPickupTime("")
    }

    if (date && new Date(date).toDateString() === new Date().toDateString()) {
      const siguienteHora = getSiguienteHora(new Date())
      const siguienteHoraStr = `${siguienteHora.getHours() < 10 ? "0" + siguienteHora.getHours() : siguienteHora.getHours()}:00`
      setPickupTime(siguienteHoraStr)
    }
  }

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date)
    if (pickupDate && date && pickupDate.toDateString() === date.toDateString()) {
      const siguienteHoraRetornar = new Date(pickupDate)
      siguienteHoraRetornar.setHours(siguienteHoraRetornar.getHours() + 1)
      setReturnTime(
        `${siguienteHoraRetornar.getHours() < 10 ? "0" + siguienteHoraRetornar.getHours() : siguienteHoraRetornar.getHours()}:00`,
      )
    } else {
      setReturnTime("")
    }
  }

  const generarHoraOpciones = (pickupDate: Date | null) => {
    const times = []
    let horaInicial = 0
    const currentHour = new Date().getHours()

    if (pickupDate && new Date(pickupDate).toDateString() === new Date().toDateString()) {
      horaInicial = currentHour + 1
    } else {
      horaInicial = 0
    }

    for (let i = horaInicial; i < 24; i++) {
      const hora = i < 10 ? `0${i}:00` : `${i}:00`
      times.push(
        <option key={hora} value={hora}>
          {hora}
        </option>,
      )
    }
    return times
  }

  const handleBuscar = () => {
    if (!formValid || !pickupDate || !returnDate || !pickupTime || !returnTime) {
      setErrorMessage("Por favor complete todos los campos correctamente.")
      return
    }

    const fechaInicio = new Date(pickupDate)
    const [horaInicio, minInicio] = pickupTime.split(":").map(Number)
    fechaInicio.setHours(horaInicio, minInicio || 0, 0, 0)

    const fechaFin = new Date(returnDate)
    const [horaFin, minFin] = returnTime.split(":").map(Number)
    fechaFin.setHours(horaFin, minFin || 0, 0, 0)

    onBuscarDisponibilidad(fechaInicio.toISOString(), fechaFin.toISOString())
  }

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .react-datepicker-popper {
        z-index: 9999 !important;
      }
      .react-datepicker-wrapper {
        position: relative;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col border rounded-lg p-3 bg-white shadow-md gap-3">
        {/* Contenedor principal con grid para pantallas pequeñas y flex para pantallas grandes */}
        <div className="grid grid-cols-2 gap-x-0 gap-y-3 md:flex md:flex-row md:flex-wrap md:items-center md:gap-3">
          {/* Fecha de recogida */}
          <div className="flex items-center gap-1 w-full md:w-auto">
            <CalendarIcon className="h-6 w-6 md:h-10 md:w-10 text-gray-800 shrink-0" />
            <div className="flex flex-col">
              <label className="w-36 text-sm font-bold text-blue-950">Fecha de recogida:</label>
              <DatePicker
                selected={pickupDate}
                onChange={handlePickupDateChange}
                dateFormat="dd/MM/yyyy"
                className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
                calendarClassName="shadow-lg"
                popperClassName="z-50"
                portalId="root-portal"
                popperPlacement="bottom-start"
                minDate={new Date()}
                wrapperClassName="z-50"
              />
            </div>
          </div>

          {/* Hora de recogida */}
          <div className="flex items-center gap-1 w-full md:w-auto">
            <ClockIcon className="h-6 w-6 md:h-10 md:w-10 text-gray-800 shrink-0" />
            <div className="flex flex-col">
              <label className="w-36 text-sm font-bold text-blue-950">Hora de recogida:</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
              >
                <option value=""></option>
                {generarHoraOpciones(pickupDate)}
              </select>
            </div>
          </div>

          {/* Fecha de devolución */}
          <div className="flex items-center gap-1 w-full md:w-auto">
            <CalendarIcon className="h-6 w-6 md:h-10 md:w-10 text-gray-800 shrink-0" />
            <div className="flex flex-col">
              <label className="w-36 text-sm font-bold text-blue-950">Fecha de devolución:</label>
              <DatePicker
                selected={returnDate}
                onChange={handleReturnDateChange}
                dateFormat="dd/MM/yyyy"
                className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
                calendarClassName="shadow-lg"
                popperClassName="z-40"
                portalId="root-portal"
                popperPlacement="bottom-start"
                minDate={pickupDate || new Date()}
                wrapperClassName="z-40"
              />
            </div>
          </div>

          {/* Hora de devolución */}
          <div className="flex items-center gap-1 w-full md:w-auto">
            <ClockIcon className="h-6 w-6 md:h-10 md:w-10 text-gray-800 shrink-0" />
            <div className="flex flex-col">
              <label className="w-36 text-sm font-bold text-blue-950">Hora de devolución:</label>
              <select
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
              >
                <option value=""></option>
                {generarHoraOpciones(pickupDate)}
              </select>
            </div>
          </div>
        </div>

        {/* Botón alineado a la derecha */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleBuscar}
            disabled={!formValid}
            className="bg-[#FCA311] text-white px-4 py-2 rounded font-medium transition duration-200 hover:bg-blue-700 disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </div>

      {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
    </div>
  )
}

export default BarraReserva