'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Carousel.module.css';
import Image from 'next/image';
//import { useRouter } from 'next/navigation';

interface Vehicle {
  id: number;
  nombre: string;
  precio: number;
  calificacion: number;
  estado: string;
  latitud: number;
  longitud: number;
  imageUrl: string;
  brand: string;
  model: string;
  colour: string;
  plate: string;
  description: string;
  pricePerDay: number;
  averageRating?: number;
}

export default function Carousel() {
  //const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const obtenerVehiculosTop = async () => {
    try {
      const response = await axios.get('https://vercel-back-speed-code.vercel.app/api/autos-top');
      const data = response.data;

      type VehiculoApi = {
        idvehiculo: string;
        imagen: string;
        marca: string;
        modelo: string;
        color: string;
        placa: string;
        descripcion: string;
        tarifa: number;
        promedio_calificacion?: number;
      };

      const formattedData: Vehicle[] = data.map((vehiculo: VehiculoApi) => ({
        id: vehiculo.idvehiculo,
        imageUrl: vehiculo.imagen,
        brand: vehiculo.marca,
        model: vehiculo.modelo,
        colour: vehiculo.color,
        plate: vehiculo.placa,
        description: vehiculo.descripcion,
        pricePerDay: vehiculo.tarifa,
        averageRating: vehiculo.promedio_calificacion,
      }));

      setVehicles(formattedData);
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVehiculosTop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (vehicles.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % vehicles.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + vehicles.length) % vehicles.length);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar vehículos</div>;

  return (
    <div id="carousel" className={styles.carouselContainer}>
      <button 
        onClick={handlePrev}
        className={styles.navButton}
        aria-label="Anterior"
      >
        &lt;
      </button>
      
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`${styles.slide} 
            ${index === currentIndex ? styles.active : ''}
            ${index === (currentIndex + 1) % vehicles.length ? styles.next : ''}
            ${index === (currentIndex - 1 + vehicles.length) % vehicles.length ? styles.prev : ''}
          `}
        >
          <div className={styles.imageContainer}>
            {/*<img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className={styles.image}
              loading="lazy"
            />*/}
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className={styles.image}
              width={400} // ajusta según el diseño real
              height={250} // ajusta según el diseño real
              objectFit="cover"
            />
          </div>
          <div className={styles.info}>
            <h3>{vehicle.brand} {vehicle.model}</h3>
            <h2>{vehicle.description}</h2>
            <div className={styles.details}>
              <p className={styles.price}>Bs. {vehicle.pricePerDay}/día</p>
              <p className={styles.rating}>
                ⭐ {vehicle.averageRating?.toFixed(2) || 'N/A'}
              </p>
            </div>
            </div>
        </div>
      ))}

      <button 
        onClick={handleNext}
        className={styles.navButton}
        aria-label="Siguiente"
      >
        &gt;
      </button>
    </div>
  );
} 
// comentario guia para el desarrollo de la pagina de inicio