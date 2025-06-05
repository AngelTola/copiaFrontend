import { useEffect, useState } from 'react';

interface Driver {
  nombreCompleto: string;
  telefono: string;
  email: string;
  fechaAsignacion?: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3001/api/drivers-by-renter', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDrivers(data.drivers || []);
      } catch (error: unknown) {
        if (error instanceof Error) console.error('Error al obtener drivers:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return { drivers, loading };
};

