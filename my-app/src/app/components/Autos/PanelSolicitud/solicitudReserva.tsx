"use client"

import type React from "react"

import { useState, useEffect } from "react"
import LugarRecogida from "./lugarRecogida"
import Caracteristicas from "../Caracteristicas"
import Precio from "./precioSolicitud"
import TerminosCondiciones from "./terminosCondiciones"
import type { Auto } from "@/app/types/auto"
import PanelConfirmarSolicitud from "@/app/components/Autos/PanelSolicitud/PanelConfirmarSolicitud"
import PanelSolicitudEnviada from "@/app/components/Autos/PanelSolicitud/PanelSolicitudEnviada"
import Swal from "sweetalert2"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Drivers from './drivers'

interface SolicitudReservaProps {
  mostrar: boolean
  onClose: () => void
  auto: Auto
  onSolicitudConfirmada?: () => void // Nueva prop para callback
}

interface ReservaData {
  pickupDate: string
  pickupTime: string
  returnDate: string
  returnTime: string
}

export default function SolicitudReserva({ mostrar, onClose, auto, onSolicitudConfirmada }: SolicitudReservaProps) {
  const [activeTab, setActiveTab] = useState<"caracteristicas" | "precio">("caracteristicas")
  const [aceptoTerminos, setAceptoTerminos] = useState(false)
  const [mostrarPanelConfirmarSolicitud, setMostrarPanelConfirmarSolicitud] = useState(false)
  const [mostrarPanelSolicitudEnviada, setMostrarPanelSolicitudEnviada] = useState(false)
  const [reservaData, setReservaData] = useState<ReservaData | null>(null)
  const [diasReserva, setDiasReserva] = useState<number>(1)
  const [selectedDriver, setSelectedDriver] = useState('')

  useEffect(() => {
  const savedData = localStorage.getItem("reservaData")
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      setReservaData(data)

      if (data.pickupDate && data.returnDate) {
        const inicio = new Date(data.pickupDate)
        const fin = new Date(data.returnDate)
        const diffTime = Math.abs(fin.getTime() - inicio.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDiasReserva(diffDays || 1)
      }
    } catch (error) {
      console.error("Error al cargar datos de reserva:", error)
    }
  }
}, [])

  const handleConfirmarSolicitud = () => {
    setMostrarPanelConfirmarSolicitud(false)
    setMostrarPanelSolicitudEnviada(true)
    
    // Llamar al callback del componente padre para bloquear el botón
    if (onSolicitudConfirmada) {
      onSolicitudConfirmada()
    }
  }

  const handleAceptarSolicitudEnviada = () => {
    setMostrarPanelSolicitudEnviada(false)
    onClose()
  }

  const formatFechaCorta = (fechaStr: string) => {
  try {
    const fecha = new Date(fechaStr)
    return format(fecha, "EEE, d MMM", { locale: es })
  } catch (error) {
    console.error("Error formateando fecha:", error)
    return "Fecha no válida"
  }
}

  return (
    <>
      <PanelConfirmarSolicitud
        mostrar={mostrarPanelConfirmarSolicitud}
        onClose={() => setMostrarPanelConfirmarSolicitud(false)}
        onConfirm={handleConfirmarSolicitud}
      />

      <PanelSolicitudEnviada
        mostrar={mostrarPanelSolicitudEnviada}
        onClose={() => setMostrarPanelSolicitudEnviada(false)}
        onConfirm={handleAceptarSolicitudEnviada}
      />

      {mostrar && !mostrarPanelConfirmarSolicitud && !mostrarPanelSolicitudEnviada && (
        <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />
      )}

      {mostrar && !mostrarPanelConfirmarSolicitud && !mostrarPanelSolicitudEnviada && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] px-2 sm:px-4 transition-transform duration-300 scale-100">
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 border-[2px] sm:border-[3px] border-black rounded-xl sm:rounded-2xl shadow-lg">
            <button
              className="absolute top-2 right-2 sm:right-4 bg-[#fca311] text-white text-base sm:text-lg px-2 sm:px-3 py-0.5 sm:py-1 rounded border border-black hover:bg-[#e69500] active:bg-[#cc8400]"
              onClick={onClose}
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-center text-[#002a5c] mb-3 sm:mb-4 mt-2 sm:mt-0">
              Solicitud de Reserva
            </h2>

            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4 text-[#000000]">
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                  <button
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-semibold ${
                      activeTab === "caracteristicas" ? "bg-[#fca311] text-white" : "bg-[#fca31180] text-white"
                    }`}
                    onClick={() => setActiveTab("caracteristicas")}
                  >
                    Características
                  </button>
                  <button
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-semibold ${
                      activeTab === "precio" ? "bg-[#fca311] text-white" : "bg-[#fca31180] text-white"
                    }`}
                    onClick={() => setActiveTab("precio")}
                  >
                    Desglose de precio
                  </button>
                </div>

                <div className="border border-black rounded-lg sm:rounded-xl p-2 sm:p-4 overflow-y-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] bg-white">
                  {activeTab === "caracteristicas" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <Caracteristicas auto={auto} />
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <Precio precioPorDia={auto.precioRentaDiario} dias={diasReserva} montoGarantia={auto.montoGarantia} />
                    </div>
                  )}
                </div>

                <LugarRecogida />
              </div>

              <div className="flex-1 space-y-4">
                <div className="border border-black rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-4 bg-white">
                  {reservaData ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-[#002a5c] mb-3">Periodo de alquiler</h3>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-8 w-8 text-[#11295B]" />
                            <span className="text-base font-medium">
                              {formatFechaCorta(reservaData.pickupDate)} - {formatFechaCorta(reservaData.returnDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[#002a5c] mb-3">Hora de recogida y devolución</h3>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-[#11295B]"></div>
                              <span className="font-medium">Hora de recogida:</span>
                              <span>{reservaData.pickupTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-[#11295B]"></div>
                              <span className="font-medium">Hora de devolución:</span>
                              <span>{reservaData.returnTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <div className="text-red-500 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fechas seleccionadas</h3>
                      <p className="text-gray-600">
                        Por favor, seleccione fechas y horas en la barra de reserva de la página de autos antes de continuar.
                      </p>
                    </div>
                  )}
                </div>

                {reservaData && (
                  <div className="border border-black rounded-lg sm:rounded-xl p-4 sm:p-5 bg-white">
                    <Drivers
                      selectedDriver={selectedDriver}
                      setSelectedDriver={setSelectedDriver}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border border-black rounded-lg sm:rounded-xl w-full mb-3 p-2 sm:p-4">
              <TerminosCondiciones onAceptarTerminos={setAceptoTerminos} />
            </div>

            <div className="flex justify-center">
              <button
                className={`bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition max-w-[250px] w-full ${
                  !reservaData || !aceptoTerminos || !selectedDriver
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e69500] active:bg-[#cc8400]"
                }`}
                onClick={() => {
                  if (!aceptoTerminos) {
                    Swal.fire({
                      icon: "warning",
                      title: "Aviso",
                      text: "Debe aceptar los términos y condiciones antes de continuar.",
                      confirmButtonColor: "#fca311",
                    })
                    return
                  }

                  if (!reservaData) {
                    Swal.fire({
                      icon: "warning",
                      title: "Fechas incompletas",
                      text: "Debe seleccionar fechas y horas en la barra de reserva antes de continuar.",
                      confirmButtonColor: "#fca311",
                    })
                    return
                  }

                  if (!selectedDriver) {
                    Swal.fire({
                      icon: "warning",
                      title: "Conductor no seleccionado",
                      text: "Debe seleccionar un conductor para continuar.",
                      confirmButtonColor: "#fca311"
                    });
                    return;
                  }

                  setMostrarPanelConfirmarSolicitud(true)
                }}
              >
                Enviar solicitud de reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    </svg>
  )
}