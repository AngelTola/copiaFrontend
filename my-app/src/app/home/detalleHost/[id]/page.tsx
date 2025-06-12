import DetalleHost from './detalleHost';
import { getComentariosDeHost, getAutosPorHost } from '@/libs/autoServices';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: comentarios } = await getComentariosDeHost(id);
    const autos = await getAutosPorHost(Number(id));

    return <DetalleHost id={id} comentarios={comentarios} autos={autos ?? []} />;
  } catch (error) {
    console.error('Error cargando datos del host:', error);
    return <div>Error al cargar el perfil del host.</div>;
  }
}

