import PanelDashBoard from '../../Notificaciones/PanelNotificaciones/PanelDashBoard';

export default function Page() {
  const usuarioId = '123'; // o recíbelo de tu contexto/auth
  return (
    <main>
      <PanelDashBoard usuarioId={usuarioId} />
    </main>
  );
}
