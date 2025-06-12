import { notFound } from 'next/navigation';
import DetalleCocheCliente from './detalleCocheCliente';
import { getAutoPorId } from '@/libs/autoServices';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: auto } = await getAutoPorId(id);
    return <DetalleCocheCliente auto={auto} />;
  } catch {
    return notFound();
  }
}