
//import PanelDashBoard from '../Notificaciones/PanelNotificaciones/PanelDashBoard';
import PanelDashBoard from '@/app/home/homePage/PanelNotificaciones/PanelDashBoard';

export default function Page() {
  const usuarioId = '24fdafde-3838-475c-90b5-d4c56dba5f5a'; // usuario de prueba para las notificaciones
  return (
    <main>
      <PanelDashBoard usuarioId={usuarioId} />
    </main>
  );
}
