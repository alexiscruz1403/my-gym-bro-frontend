import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TermsBackButton } from '@/components/terms/TermsBackButton';

export const metadata: Metadata = {
  title: 'MyGymBro — Términos y condiciones',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <TermsBackButton />

        <div>
          <h1 className="font-display text-3xl font-bold">Términos y condiciones</h1>
          <p className="text-xs text-muted-foreground mt-1">Última actualización: mayo de 2025</p>
        </div>

        <Card>
          <CardContent className="space-y-8 pt-6">
            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">1. Aceptación de los términos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Al acceder y utilizar MyGymBro, aceptás estos Términos y condiciones en su totalidad.
                Si no estás de acuerdo con alguno de los términos aquí establecidos, te pedimos que no
                utilices la aplicación. Para registrarte, debés tener al menos 18 años de edad, o 13 años
                con el consentimiento expreso de un padre o tutor legal.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">2. Descripción del servicio</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MyGymBro es una plataforma de planificación y seguimiento de entrenamiento personal que
                ofrece funcionalidades sociales, registro de sesiones y generación de planes mediante
                inteligencia artificial. El servicio se ofrece en dos modalidades: plan gratuito con
                funcionalidades básicas, y plan premium con acceso a herramientas de IA avanzadas.
                Los planes de entrenamiento generados por la inteligencia artificial son sugerencias
                informativas y no constituyen consejo médico ni reemplazan la orientación de un
                profesional de la salud o el deporte.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">3. Cuenta y datos personales</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Al crear una cuenta en MyGymBro, recolectamos los siguientes datos: dirección de correo
                electrónico, nombre de usuario, contraseña (almacenada de forma segura) y, de manera
                opcional, una foto de perfil. Si utilizás las funciones de inteligencia artificial,
                también podés ingresar métricas físicas como edad, sexo, altura, peso actual, peso
                objetivo, porcentaje estimado de grasa corporal, objetivo fitness, nivel de experiencia,
                disponibilidad horaria, equipamiento disponible, limitaciones físicas y preferencias de
                ejercicio. Las sesiones autenticadas se gestionan mediante cookies HTTP-only. Sos
                responsable de mantener la confidencialidad de tus credenciales y de toda actividad
                que ocurra bajo tu cuenta.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">4. Suscripción y pagos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MyGymBro ofrece una suscripción premium con los siguientes planes: mensual a ARS $100/mes
                o anual a ARS $1.000/año. Los pagos son procesados de forma segura a través de Mercado
                Pago. La renovación automática está habilitada por defecto y puede desactivarse en cualquier
                momento desde la sección de Ajustes. En caso de fallo en el pago, el acceso a las
                funcionalidades premium puede ser restringido o degradado. No se realizan reembolsos
                salvo que la legislación argentina aplicable lo exija expresamente. Los precios pueden
                modificarse con aviso previo al usuario.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">5. Inteligencia artificial</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Las funciones de IA de MyGymBro generan planes de entrenamiento personalizados y análisis
                de progresión a partir de los datos que el usuario ingresa voluntariamente. Estos resultados
                son de carácter informativo y no constituyen consejo médico, diagnóstico ni tratamiento.
                Los usuarios con condiciones médicas preexistentes, lesiones o necesidades especiales
                deben consultar a un médico o profesional del deporte antes de iniciar cualquier programa
                de entrenamiento. MyGymBro no asume responsabilidad alguna por lesiones, daños o perjuicios
                derivados del seguimiento de los planes o sugerencias generados por la inteligencia artificial.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">6. Privacidad y protección de datos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El tratamiento de tus datos personales se realiza en conformidad con la Ley 25.326 de
                Protección de Datos Personales de la República Argentina. Tus datos no son vendidos ni
                cedidos a terceros con fines comerciales. Se comparte información limitada únicamente
                con Mercado Pago en el contexto del procesamiento de pagos. Tenés derecho a solicitar
                en cualquier momento el acceso, rectificación o eliminación de tus datos personales y
                tu cuenta contactándonos a través de los medios indicados en la sección de Contacto.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">7. Contenido social</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sos el único responsable del contenido que publicás en MyGymBro. Queda estrictamente
                prohibido publicar contenido ofensivo, discriminatorio, que incite al acoso, que vulnere
                derechos de terceros o que sea contrario a la legislación vigente. MyGymBro se reserva
                el derecho de eliminar contenido que viole estos términos y de suspender o cancelar
                cuentas en caso de infracciones reiteradas. Los perfiles públicos son visibles para todos
                los usuarios de la plataforma; los perfiles privados solo son accesibles para seguidores
                previamente aprobados por el titular.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">8. Propiedad intelectual</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La marca MyGymBro, su logotipo, diseño y demás elementos de identidad visual son
                propiedad exclusiva del desarrollador y están protegidos por la legislación de propiedad
                intelectual aplicable. El contenido generado por los usuarios — incluyendo publicaciones,
                registros de sesiones y datos de entrenamiento — permanece bajo la titularidad del usuario.
                Al publicar contenido en la plataforma, el usuario otorga a MyGymBro una licencia no
                exclusiva, gratuita y limitada para mostrarlo dentro de la aplicación a los efectos del
                funcionamiento del servicio.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">9. Limitación de responsabilidad</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MyGymBro se provee en el estado en que se encuentra, sin garantías de ningún tipo,
                expresas o implícitas. No nos responsabilizamos por lesiones físicas, pérdida de datos,
                interrupciones del servicio, fallos técnicos ni por las acciones de terceros. En ningún
                caso la responsabilidad total de MyGymBro frente al usuario superará el monto abonado
                por el usuario durante los últimos 30 días previos al evento que originó el reclamo.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">10. Modificaciones</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de actualizar estos Términos y condiciones en cualquier momento.
                Ante cambios materiales, notificaremos a los usuarios a través de la aplicación o por
                correo electrónico con una antelación razonable. El uso continuado de la plataforma
                tras la notificación implica la aceptación de los nuevos términos.
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <h2 className="font-display text-base font-semibold">11. Contacto</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Para consultas, solicitudes de datos o reportes relacionados con estos Términos y
                condiciones, podés contactarnos en:{' '}
                <span className="text-foreground font-medium">soporte@mygymbroapp.com</span>.
                Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia
                será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma
                de Buenos Aires.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
