'use client';
import React, { useEffect, useState } from 'react';
import NavbarInicioSesion from '@/app/components/navbar/NavbarSecundario';


export default function TerminosLogin() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -30% 0px',
                        
      }
    );
    
  
    sections.forEach(section => observer.observe(section));
  
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);
  

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-principal)]">
      <header>
          <NavbarInicioSesion onBecomeHost={function (): void {
          throw new Error('Function not implemented.');
        } } onBecomeDriver={function (): void {
          throw new Error('Function not implemented.');
        } }/>
      </header>


      <main className="flex-1 bg-[var(--blanco)] pt-[1.7rem] px-4 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-8 max-w-[1200px] mx-auto">
          <aside className="flex-none w-full md:w-[260px] bg-[var(--hueso)] p-[2.2rem] md:ml-[-70px] sticky top-[100px] h-fit rounded-[8px] shadow-[var(--sombra)]">
            <nav>
              <ul className="list-none p-0 m-0">
                {[
                  ['descripcion', 'Descripción de la Plataforma'],
                  ['introduccion', 'Introducción'],
                  ['registro', 'Registro y Cuenta'],
                  ['host', 'Obligaciones del Host'],
                  ['renter', 'Obligaciones del Renter'],
                  ['pagos', 'Pagos y Comisiones'],
                  ['cancelaciones', 'Cancelaciones y Reembolsos'],
                  ['seguro', 'Seguro y Responsabilidad'],
                  ['conducta', 'Conducta Prohibida'],
                  ['leyes', 'Ley Aplicable y Resolución de Conflictos'],
                  ['contacto', 'Contacto']
                ].map(([id, label]) => (
                  <li
                    key={id}
                    className={`py-[0.4rem] px-[0.75rem] mb-[0.3rem] text-[0.95rem] leading-[1.2] rounded-[4px] transition-colors ${
                      activeSection === id
                        ? 'bg-[var(--naranja-46)] font-[var(--tamaña-bold)] underline'
                        : 'text-[var(--azul-oscuro)] hover:bg-[var(--naranja-46)]'
                    }`}
                  >
                    <a href={`#${id}`} className="text-inherit no-underline hover:underline block">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

              
          
          <div className="flex-1 bg-[var(--blanco)] p-8 rounded-md">
            <h1 className="text-[2.4rem] font-[var(--tamaña-bold)] text-center text-[var(--negro)] mb-4">Términos y Condiciones REDIBO</h1>
            <p className="text-sm text-[var(--negro)] font-[var(--tamaño-regular)] mb-6">Última Actualización: 10 Marzo 2025</p>
             
               
          
            <section id="descripcion" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">
                Descripción de la Plataforma
              </h2>
              <p className="text-[var(--negro)] leading-relaxed mb-4 font-[var(--tamaño-regular)]">
                REDIBO es una plataforma innovadora diseñada para transformar el mercado del alquiler de vehículos en Bolivia, conectando directamente a propietarios de autos (Hosts) con arrendatarios (Renters) interesados en alquilar vehículos de forma segura, eficiente y transparente. Nuestra plataforma elimina intermediarios tradicionales, brindando autonomía y mayores ingresos a los Hosts, mientras ofrece a los Renters una amplia variedad de opciones para satisfacer diferentes necesidades de transporte.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4 font-[var(--tamaño-regular)]">
                A través de REDIBO, los usuarios pueden listar vehículos particulares, desde autos económicos hasta camionetas de alta gama, proporcionando detalles claros y fotografías actualizadas. Los Renters, por su parte, pueden buscar vehículos según ubicación, rango de precios, características específicas y fechas deseadas. La experiencia de usuario se optimiza mediante un sistema de filtros inteligentes, recomendaciones personalizadas y reseñas de otros usuarios que garantizan la confianza en cada operación.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4 font-[var(--tamaño-regular)]">
                Además, REDIBO incorpora funcionalidades de pago seguro, depósito de garantías, gestión de reservas, soporte al cliente en tiempo real, verificación de identidades y contratos electrónicos para proteger los intereses de ambas partes. Nos enorgullece ser pioneros en democratizar el acceso al alquiler de vehículos, impulsando la economía colaborativa en Bolivia y promoviendo valores de responsabilidad, compromiso y confianza mutua entre todos los miembros de nuestra comunidad.
              </p>
            </section>


            <section id="introduccion" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">
                Introducción
              </h2>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Bienvenidos a REDIBO, una plataforma que redefine el concepto de movilidad compartida en Bolivia. Estos Términos y Condiciones establecen los lineamientos legales y normativos que rigen el acceso y uso de nuestros servicios. Todos los usuarios deben leer detenidamente este documento antes de registrarse o utilizar nuestra plataforma, ya que al hacerlo aceptan quedar legalmente vinculados por estas disposiciones.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                REDIBO actúa como un facilitador tecnológico que conecta, a través de su plataforma digital, a Hosts que desean poner a disposición sus vehículos, con Renters que requieren alquilarlos. Si bien nos esforzamos en promover prácticas seguras y responsables, REDIBO no es propietaria ni operadora de los vehículos listados, ni participa en las transacciones de forma directa, más allá de brindar el espacio virtual para su concreción.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                El incumplimiento de cualquiera de las disposiciones contenidas en estos Términos y Condiciones podrá derivar en la suspensión o cancelación de la cuenta del usuario, sin perjuicio de las acciones legales adicionales que REDIBO pudiera iniciar. Estos términos están sujetos a actualización periódica, y será responsabilidad de los usuarios revisar las modificaciones antes de utilizar nuevamente nuestros servicios.
              </p>
            </section>


            <section id="registro" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Registro y Cuenta</h2>
              <p className="font-semibold text-[var(--negro)] mb-2">Requisitos para Hosts:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Ser mayor de 18 años</li>
                <li>Poseer un vehículo con documentación en regla</li>
                <li>Contar con SOAT vigente</li>
                <li>Presentar cédula de identidad o pasaporte válido</li>
                <li>Proporcionar documentación que acredite la propiedad del vehículo</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Requisitos para Renters:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Ser mayor de 18 años</li>
                <li>Licencia de conducir válida con al menos 2 años de antigüedad</li>
                <li>Documento de identidad oficial (cédula o pasaporte)</li>
                <li>Método de pago válido registrado en la plataforma</li>
              </ul>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                <strong className="font-semibold">Veracidad de la Información:</strong> Todos los usuarios se comprometen a proporcionar
                información veraz y actualizada. REDIBO se reserva el derecho de verificar la identidad y documentación de los usuarios,
                pudiendo solicitar documentación adicional cuando lo considere necesario.
              </p>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                <strong className="font-semibold">Protección de Cuenta:</strong> Cada usuario es responsable de mantener la confidencialidad
                de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta.
              </p>
            </section>


            <section id="host" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Obligaciones del Host</h2>

              <p className="font-semibold text-[var(--negro)] mb-2">Precisión en la información del vehículo:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Host debe proporcionar información precisa y actualizada sobre su vehículo, incluyendo:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Marca, modelo y año</li>
                <li>Características principales y estado del vehículo</li>
                <li>Kilometraje actual</li>
                <li>Fotografías recientes y representativas</li>
                <li>Requisitos específicos de uso</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Mantenimiento del vehículo:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Host debe garantizar que su vehículo:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Está en condiciones óptimas de funcionamiento</li>
                <li>Cumple con todas las normativas técnicas vigentes</li>
                <li>Ha recibido mantenimiento regular según especificaciones del fabricante</li>
                <li>Cuenta con seguro obligatorio vigente (SOAT)</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Entrega y documentación:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Host debe:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Ser puntual en la entrega y recepción del vehículo</li>
                <li>Realizar una inspección documentada del estado del vehículo con el Renter</li>
                <li>Entregar el vehículo con el tanque de combustible lleno</li>
                <li>Proporcionar toda la documentación necesaria para circular legalmente</li>
              </ul>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                <strong className="font-semibold">Disponibilidad y comunicación:</strong> El Host debe mantener actualizado su calendario
                de disponibilidad y responder a las solicitudes y mensajes en un plazo máximo de 24 horas.
              </p>
            </section>

              
            <section id="renter" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Obligaciones del Renter</h2>

              <p className="font-semibold text-[var(--negro)] mb-2">Uso adecuado del vehículo:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Renter se compromete a:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Utilizar el vehículo solo para los fines acordados</li>
                <li>No exceder el límite de kilometraje establecido (si aplica)</li>
                <li>No permitir que personas no autorizadas conduzcan el vehículo</li>
                <li>No transportar más pasajeros que los permitidos por el fabricante</li>
                <li>No utilizar el vehículo para actividades ilegales o peligrosas</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Cuidado del vehículo:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Renter debe:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Mantener el vehículo limpio y en buen estado</li>
                <li>Estacionar en lugares seguros</li>
                <li>Notificar inmediatamente al Host y a REDIBO de cualquier problema mecánico</li>
                <li>No realizar modificaciones al vehículo</li>
                <li>Devolver el vehículo con el mismo nivel de combustible que lo recibió</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Respeto a las normas de tránsito:</p>
              <p className="text-[var(--negro)] leading-relaxed mb-2">El Renter es responsable de:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Cumplir todas las leyes y regulaciones de tránsito</li>
                <li>Pagar cualquier multa o sanción derivada de infracciones cometidas durante el periodo de alquiler</li>
                <li>Utilizar el cinturón de seguridad y asegurar que todos los pasajeros lo utilicen</li>
              </ul>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                <strong className="font-semibold">Devolución puntual:</strong> El Renter debe devolver el vehículo en la fecha, hora y lugar acordados,
                salvo acuerdo explícito con el Host para extender el periodo.
              </p>
            </section>

            
            <section id="pagos" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Pagos y Comisiones</h2>

              <p className="font-semibold text-[var(--negro)] mb-2">Estructura de precios:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Los Hosts establecen libremente el precio diario de alquiler de sus vehículos</li>
                <li>REDIBO cobra una comisión del 15% sobre el precio total del alquiler al Host</li>
                <li>Los Renters pagan una tarifa de servicio del 10% adicional al precio establecido</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Método de pago:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Todos los pagos se realizan a través de la plataforma REDIBO</li>
                <li>Se aceptan tarjetas de crédito, débito y transferencias bancarias</li>
                <li>No se permiten pagos directos entre Host y Renter</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Depósito de seguridad:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>Se requiere un depósito de seguridad para cada alquiler</li>
                <li>El monto es determinado por el valor del vehículo y la duración del alquiler</li>
                <li>Se bloquea en la TARJETA_DEBITO del Renter al momento de la reserva</li>
                <li>Se libera automáticamente 7 días después de finalizado el alquiler si no hay reclamaciones</li>
              </ul>

              <p className="font-semibold text-[var(--negro)] mb-2">Facturación:</p>
              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2 mb-4">
                <li>REDIBO emitirá factura electrónica por el servicio de intermediación</li>
                <li>Los Hosts son responsables de cumplir con sus obligaciones fiscales por los ingresos generados</li>
              </ul>
            </section>

            
            <section id="cancelaciones" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">
                Cancelaciones y Reembolsos
              </h2>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Entendemos que pueden surgir imprevistos tanto para Hosts como para Renters. Por ello, REDIBO establece políticas claras de cancelación que buscan proteger los intereses de ambas partes. Los Renters podrán cancelar una reserva con reembolso completo (menos comisiones) si la cancelación se realiza al menos 48 horas antes del inicio del alquiler.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Cancelaciones realizadas entre 24 y 48 horas antes del inicio del alquiler darán derecho a un reembolso del 50% del monto pagado, mientras que cancelaciones con menos de 24 horas no tendrán derecho a reembolso, salvo situaciones excepcionales debidamente justificadas (accidentes, emergencias médicas, etc.). Las solicitudes de excepción deberán presentarse con documentación comprobatoria.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Los Hosts que cancelen reservas confirmadas sin justificación válida podrán ser sancionados con cargos por cancelación, pérdida de visibilidad en la plataforma y suspensión temporal o permanente de su cuenta, dependiendo de la gravedad de la falta y su reincidencia.
              </p>
            </section>



            <section id="seguro" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">
                Seguro y Responsabilidad
              </h2>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Todos los vehículos ofrecidos a través de REDIBO deben contar obligatoriamente con seguro SOAT vigente. REDIBO recomienda adicionalmente la contratación de seguros complementarios que cubran daños materiales, robo, responsabilidad civil frente a terceros y accidentes personales.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                En caso de accidente, el Renter debe contactar de inmediato a la autoridad competente, al Host y a REDIBO. Se deberán seguir todos los protocolos establecidos en el seguro contratado y en las políticas de la plataforma. La responsabilidad financiera ante daños se determinará en función de los informes periciales, la póliza de seguro y la verificación de cumplimiento de las condiciones de uso pactadas.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                REDIBO actúa como intermediario y no como aseguradora. No cubrimos daños directos, robos ni pérdidas económicas derivadas del uso del vehículo, salvo que expresamente se haya contratado una cobertura específica a través de nuestros servicios complementarios.
              </p>
            </section>


            
            <section id="conducta" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">
                Conducta Prohibida
              </h2>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                REDIBO fomenta un ambiente de respeto, seguridad y colaboración entre todos sus usuarios. Por tanto, queda estrictamente prohibido: falsificar información, suplantar identidades, utilizar vehículos para actividades ilegales, trasladar mercancías peligrosas, permitir que terceros no autorizados conduzcan el vehículo, o realizar prácticas que deterioren intencionalmente los bienes ofrecidos en la plataforma.
              </p>
              <p className="text-[var(--negro)] leading-relaxed mb-4">
                También se prohíbe acosar, discriminar o realizar comentarios ofensivos contra otros usuarios. REDIBO mantiene una política de tolerancia cero frente a cualquier tipo de abuso o maltrato y se reserva el derecho de suspender o eliminar cuentas sin previo aviso ante el incumplimiento de estas normas.
              </p>
            </section>



            <section id="leyes" className="mb-8 scroll-mt-[104.4px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Ley Aplicable y Resolución de Conflictos</h2>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Estos Términos y Condiciones se rigen por la normativa vigente en Bolivia, en especial el Código Civil,
                la Ley General de Transporte y demás disposiciones conexas que regulan el arrendamiento de bienes y servicios
                en el país. REDIBO opera conforme al marco legal establecido, promoviendo prácticas comerciales justas y transparentes.
              </p>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                En caso de presentarse conflictos entre los usuarios (ya sea entre Host y Renter o entre estos y la plataforma),
                REDIBO fomentará en primera instancia la resolución amistosa de las controversias mediante comunicación directa.
                Si esto no fuera suficiente, se brindará apoyo para iniciar procesos de mediación voluntaria, 
                siempre que ambas partes lo acepten.
              </p>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Si la mediación no resulta efectiva o no es aceptada por alguna de las partes, el conflicto podrá resolverse mediante 
                arbitraje institucional de acuerdo con los reglamentos del Centro de Conciliación y Arbitraje 
                reconocido por el Ministerio de Justicia de Bolivia. Esta alternativa ofrece mayor celeridad y confidencialidad en los procedimientos.
              </p>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Finalmente, si no se opta por ninguna de las vías alternativas o si el conflicto requiere intervención judicial,
                el caso deberá ser presentado ante los tribunales ordinarios competentes del Estado Plurinacional de Bolivia,
                con jurisdicción en la ciudad de La Paz, salvo acuerdo distinto entre las partes.
              </p>

              <p className="text-[var(--negro)] leading-relaxed">
                REDIBO no será responsable por las acciones u omisiones de los usuarios fuera del alcance de la plataforma,
                pero colaborará con las autoridades en caso de que se requiera su intervención.
              </p>
            </section>


            <section id="contacto" className="mb-8 scroll-mt-[104.4px] min-h-[300px]">
              <h2 className="text-[1.8rem] font-[var(--tamaña-bold)] text-left text-[var(--negro)] mb-4 mt-8">Contacto</h2>

              <p className="text-[var(--negro)] leading-relaxed mb-4">
                Si tienes consultas, sugerencias o deseas reportar un problema, puedes comunicarte con nosotros a través de los siguientes medios oficiales:
              </p>

              <ul className="list-disc pl-6 text-[var(--negro)] space-y-2">
                <li>
                  📧 Correo: <a href="mailto:soporte@redibo.com.bo" className="underline text-[var(--azul-oscuro)] hover:text-[var(--naranja)]">
                    soporte@redibo.com.bo
                  </a>
                </li>
                <li>
                  📞 WhatsApp: <a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer" className="underline text-[var(--azul-oscuro)] hover:text-[var(--naranja)]">
                    (+591) 70000000
                  </a>
                </li>
                <li>
                  📍 Dirección: <a href="https://www.google.com/maps?q=Edificio+REDIBO,+Cochabamba,+Bolivia" target="_blank" rel="noopener noreferrer" className="underline text-[var(--azul-oscuro)] hover:text-[var(--naranja)]">
                    América, Edificio REDIBO, Cochabamba - Bolivia
                  </a>
                </li>
                <li>⏰ Horario: Lunes a viernes de 08:30 a 18:30</li>
              </ul>
            </section>
          </div>
        </div>
        <div aria-hidden="true" className="mt-[300px] invisible" />
      </main>
      
      <footer className="bg-[var(--hueso)] text-[var(--negro)] font-[var(--fuente-principal)] border-t-[1px] border-[rgba(0,0,0,0.2)] p-8 text-right rounded-t-[20px]">
        {/*<a
          className="underline cursor-pointer text-[rgba(0,0,0,0.64)]"
        >
          Términos y condiciones
        </a>*/}
      </footer>
    </div>
  );
}