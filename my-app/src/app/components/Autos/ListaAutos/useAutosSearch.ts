"use client"

import { useState } from "react"
import { getAutos, getAutosDisponiblesPorFecha } from "@/libs/autoServices"
import type { Auto, Comentario } from "@/app/types/auto"

export const useAutosSearch = () => {
  const [autos, setAutos] = useState<Auto[]>([])
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([])
  const [busquedaActiva, setBusquedaActiva] = useState<boolean>(false)
  const [fechasReserva, setFechasReserva] = useState<{ inicio: string; fin: string } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [promediosPorAuto, setPromediosPorAuto] = useState<{ [key: number]: number }>({})

  const calcularPromedio = (comentarios: Comentario[]): number => {
    const comentariosValidos = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '')
    return comentariosValidos.length > 0
      ? comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) / comentariosValidos.length
      : 0
  }

  const ordenarPorMejorCalificacion = (autosData: Auto[]): Auto[] => {
    return [...autosData].sort((a, b) => {
      const promedioA = promediosPorAuto[a.idAuto] ?? (a.calificacionPromedio ?? 0)
      const promedioB = promediosPorAuto[b.idAuto] ?? (b.calificacionPromedio ?? 0)
      return promedioB - promedioA
    })
  }

  const cargarComentariosAutos = async (autosData: Auto[]) => {
    try {
      const { getComentariosDeAuto } = await import('@/libs/autoServices')
      
      const comentariosPromises = autosData.map(async (auto) => {
        try {
          const response = await getComentariosDeAuto(auto.idAuto)
          return { idAuto: auto.idAuto, comentarios: response.data }
        } catch (error) {
          console.error(`Error al obtener comentarios para auto ${auto.idAuto}:`, error)
          return { idAuto: auto.idAuto, comentarios: [] }
        }
      })

      const resultados = await Promise.all(comentariosPromises)
      
      const nuevosComentarios: { [key: number]: Comentario[] } = {}
      const nuevosPromedios: { [key: number]: number } = {}

      resultados.forEach(({ idAuto, comentarios }) => {
        nuevosComentarios[idAuto] = comentarios
        nuevosPromedios[idAuto] = calcularPromedio(comentarios)
      })

      setPromediosPorAuto(nuevosPromedios)
      return nuevosPromedios
    } catch (error) {
      console.error('Error al cargar comentarios de autos:', error)
      return {}
    }
  }

  const buscarAutosDisponibles = async (fechaInicio?: string, fechaFin?: string) => {
    try {
      setCargando(true)
      setError(null)

      // Si se proporcionan fechas, las guardamos
      if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio).toISOString().split("T")[0]
        const fin = new Date(fechaFin).toISOString().split("T")[0]

        console.log(`Buscando autos disponibles entre ${inicio} y ${fin}`)
        setFechasReserva({ inicio: fechaInicio, fin: fechaFin })
      }

      let data;
      if (fechaInicio && fechaFin) {
        const response = await getAutosDisponiblesPorFecha(fechaInicio, fechaFin)
        data = response.data
      } else {
        // Llamar sin parámetros o con parámetros por defecto
        const response = await getAutos()
        data = response.data
      }

      setAutos(data)
      setBusquedaActiva(true)
      
      // Cargar comentarios y luego ordenar por mejor calificación
      const nuevosPromedios = await cargarComentariosAutos(data)
      
      // Ordenar por mejor calificación usando los promedios recién cargados
      const autosOrdenados = [...data].sort((a, b) => {
        const promedioA = nuevosPromedios[a.idAuto] ?? (a.calificacionPromedio ?? 0)
        const promedioB = nuevosPromedios[b.idAuto] ?? (b.calificacionPromedio ?? 0)
        return promedioB - promedioA
      })
      
      setAutosFiltrados(autosOrdenados)
    } catch (error) {
      console.error("Error al buscar autos disponibles:", error)
      setError("Hubo un error al buscar autos disponibles. Por favor intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  const filtrarAutos = (busqueda: string) => {
    const autosBase = autos

    if (!busqueda.trim()) {
      const autosOrdenados = ordenarPorMejorCalificacion(autosBase)
      setAutosFiltrados(autosOrdenados)
      return
    }

    const valor = busqueda.toLowerCase().trim()
    const palabras = valor.split(/[\s-]+/)

    if (palabras.length === 2) {
      const [marca, modelo] = palabras
      const filtrados = autosBase.filter(
        (auto) => auto.marca.toLowerCase().includes(marca) && auto.modelo.toLowerCase().includes(modelo),
      )
      const filtradosOrdenados = ordenarPorMejorCalificacion(ordenarResultados(filtrados))
      setAutosFiltrados(filtradosOrdenados)
      return
    }

    const filtrados = autosBase.filter((auto) => {
      const marcaMatch = auto.marca.toLowerCase().includes(valor)
      const modeloMatch = auto.modelo.toLowerCase().includes(valor)
      return marcaMatch || modeloMatch
    })

    const filtradosOrdenados = ordenarPorMejorCalificacion(ordenarResultados(filtrados, valor))
    setAutosFiltrados(filtradosOrdenados)
  }

  const ordenarResultados = (autos: Auto[], termino = "") => {
    return [...autos].sort((a, b) => {
      const aMarcaStarts = a.marca.toLowerCase().startsWith(termino)
      const bMarcaStarts = b.marca.toLowerCase().startsWith(termino)

      if (aMarcaStarts && !bMarcaStarts) return -1
      if (!aMarcaStarts && bMarcaStarts) return 1

      const marcaCompare = a.marca.localeCompare(b.marca)
      if (marcaCompare !== 0) return marcaCompare

      return a.modelo.localeCompare(b.modelo)
    })
  }

  const aplicarOrden = (opcion: string) => {
    const autosOrdenados = [...autosFiltrados]

    switch (opcion) {
      case "Mejor calificación":
        autosOrdenados.sort((a, b) => {
          const promedioA = promediosPorAuto[a.idAuto] ?? (a.calificacionPromedio ?? 0)
          const promedioB = promediosPorAuto[b.idAuto] ?? (b.calificacionPromedio ?? 0)
          return promedioB - promedioA
        })
        break
      case "Modelo: a - z":
        autosOrdenados.sort((a, b) => a.modelo.localeCompare(b.modelo))
        break
      case "Modelo: z - a":
        autosOrdenados.sort((a, b) => b.modelo.localeCompare(a.modelo))
        break
      case "Marca: a - z":
        autosOrdenados.sort((a, b) => a.marca.localeCompare(b.marca))
        break
      case "Marca: z - a":
        autosOrdenados.sort((a, b) => b.marca.localeCompare(a.marca))
        break
      case "Precio: mayor a menor":
        autosOrdenados.sort((a, b) => Number(b.precioRentaDiario) - Number(a.precioRentaDiario))
        break
      case "Precio: menor a mayor":
        autosOrdenados.sort((a, b) => Number(a.precioRentaDiario) - Number(b.precioRentaDiario))
        break
      default:
        break
    }

    setAutosFiltrados(autosOrdenados)
  }

  return {
    // Estados
    autos,
    autosFiltrados,
    busquedaActiva,
    fechasReserva,
    cargando,
    error,
    promediosPorAuto,
    
    // Funciones
    buscarAutosDisponibles,
    filtrarAutos,
    aplicarOrden,
  }
}