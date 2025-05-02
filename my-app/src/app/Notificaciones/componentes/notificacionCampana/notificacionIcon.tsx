import { useEffect, useState } from 'react';
 
 function NotificationIcon({ tipo }: { tipo: string }) {
   const [IconData, setIconData] = useState<{ Icon: React.ComponentType<any>, color: string } | null>(null);
 
   useEffect(() => {
     import('lucide-react').then((module) => {
       let Icon = module.CheckCircle;
       let color = 'text-emerald-500';
 
       switch (tipo) {
         case 'ALQUILER_FINALIZADO':
           Icon = module.ClipboardCheck;
           color = 'text-emerald-500';
           break;
         case 'RESERVA_CANCELADA':
           Icon = module.XCircle;
           color = 'text-red-500';
           break;
         case 'RESERVA_MODIFICADA':
           Icon = module.Edit;
           color = 'text-yellow-500';
           break;
         case 'VEHICULO_CALIFICADO':
           Icon = module.Star;
           color = 'text-amber-500';
           break;
         case 'RESERVA_CONFIRMADA':
           Icon = module.CheckCircle;
           color = 'text-green-500';
           break;
         case 'DEPOSITO_CONFIRMADO':
           Icon = module.DollarSign;
           color = 'text-green-500';
           break;
         case 'DEPOSITO_RECIBIDO':
           Icon = module.CreditCard;
           color = 'text-indigo-500';
           break;
         default:
           Icon = module.CheckCircle;
           color = 'text-gray-500';
       }
 
       setIconData({ Icon, color });
     });
   }, [tipo]);
 
   if (!IconData) return null;
 
   const { Icon, color } = IconData;
 
   return (
     <div className="flex justify-center items-center w-full h-full">
       <Icon className={`w-12 h-12 ${color}`} />
     </div>
   );
 }
 
 export default NotificationIcon;