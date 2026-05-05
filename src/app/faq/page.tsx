import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { TermsBackButton } from '@/components/terms/TermsBackButton';

export const metadata: Metadata = {
  title: 'MyGymBro — FAQ y contacto',
};

const FAQ_ITEMS = [
  {
    value: 'q1',
    question: '¿Qué es MyGymBro y para qué sirve?',
    answer:
      'MyGymBro es una aplicación de planificación y seguimiento de entrenamiento personal. Te permite crear rutinas de ejercicio, registrar tus sesiones, ver tu progreso a lo largo del tiempo y compararte con otros usuarios a través del sistema de rangos. El plan premium incluye generación de planes personalizados mediante inteligencia artificial.',
  },
  {
    value: 'q2',
    question: '¿Cómo creo una rutina de entrenamiento?',
    answer:
      'Desde la sección "Rutinas" podés crear un nuevo plan de entrenamiento. Definís los días de entrenamiento, agregás los ejercicios que querés realizar en cada día, configurás series, repeticiones y peso. Una vez creado el plan, podés activarlo para comenzar a registrar sesiones.',
  },
  {
    value: 'q3',
    question: '¿Qué incluye el plan gratuito y qué el premium?',
    answer:
      'El plan gratuito te permite crear rutinas personalizadas, registrar sesiones, ver tu historial y participar en el feed social. El plan premium agrega acceso a la generación de planes con inteligencia artificial, análisis de progresión automático y sugerencias de carga semana a semana. El premium está disponible en dos modalidades: mensual (ARS $100/mes) o anual (ARS $1.000/año).',
  },
  {
    value: 'q4',
    question: '¿Cómo funciona la generación de planes con IA?',
    answer:
      'Al acceder a la sección de IA, completás un asistente de 6 pasos donde ingresás tu perfil físico (edad, peso, altura), tu objetivo (pérdida de grasa, ganancia muscular, etc.), tu nivel de experiencia, la cantidad de días disponibles, el equipamiento que tenés y tus preferencias o limitaciones físicas. Con esa información, la IA genera un plan de entrenamiento personalizado que podés guardar y activar directamente.',
  },
  {
    value: 'q5',
    question: '¿Los planes generados por IA reemplazan a un entrenador personal?',
    answer:
      'No. Los planes generados por la inteligencia artificial de MyGymBro son sugerencias informativas basadas en los datos que ingresás. No constituyen asesoramiento médico ni deportivo profesional. Si tenés condiciones médicas, lesiones o necesidades especiales, siempre consultá con un médico o entrenador certificado antes de comenzar cualquier programa de entrenamiento.',
  },
  {
    value: 'q6',
    question: '¿Cómo cancelo o modifico mi suscripción?',
    answer:
      'Podés gestionar tu suscripción desde la sección "Ajustes". Allí encontrás la opción de desactivar la renovación automática, lo que cancelará tu suscripción al finalizar el período actual. Los pagos son procesados por Mercado Pago. Si necesitás ayuda adicional con tu suscripción, contactanos por mail.',
  },
  {
    value: 'q7',
    question: '¿Mis datos de salud están seguros?',
    answer:
      'Sí. Los datos que ingresás en MyGymBro (métricas físicas, historial de sesiones, preferencias) se almacenan de forma segura y no son vendidos a terceros. Solo compartimos información limitada con Mercado Pago para el procesamiento de pagos. El tratamiento de tus datos personales cumple con la Ley 25.326 de Protección de Datos Personales de la República Argentina. Podés solicitar la eliminación de tu cuenta y tus datos desde la sección de Perfil.',
  },
  {
    value: 'q8',
    question: '¿Puedo hacer privado mi perfil?',
    answer:
      'Sí. Desde "Ajustes" → "Privacidad" podés activar el modo de perfil privado. Con esta opción, solo los seguidores que vos aprobés podrán ver tu perfil, tus sesiones y tus publicaciones. Las solicitudes de seguimiento quedarán pendientes hasta que las aceptes o rechaces manualmente.',
  },
  {
    value: 'q9',
    question: '¿Cómo funciona el sistema de rangos?',
    answer:
      'El sistema de rangos clasifica a los usuarios según su volumen de entrenamiento acumulado por grupo muscular. A medida que completás sesiones y registrás series, tu volumen total aumenta y podés subir de rango en categorías como pecho, espalda, piernas, entre otras. Podés ver tu posición en el leaderboard general y compararte con otros usuarios desde la sección "Rangos".',
  },
  {
    value: 'q10',
    question: '¿Qué hago si olvidé mi contraseña?',
    answer:
      'En la pantalla de inicio de sesión encontrás la opción "¿Olvidaste tu contraseña?". Ingresá tu dirección de correo electrónico y recibirás un enlace para restablecerla. Si no recibís el email en unos minutos, revisá tu carpeta de spam. También podés iniciar sesión directamente con tu cuenta de Google si la asociaste al registrarte.',
  },
] as const;

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <TermsBackButton />

        <div>
          <h1 className="font-display text-3xl font-bold">Preguntas frecuentes</h1>
        </div>

        <Card>
          <CardContent className="pt-4 pb-2">
            <Accordion>
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Para consultas, soporte técnico o cualquier duda, escribinos a:
            </p>
            <Link
              href="mailto:mygymbrosoporte@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" />
              mygymbrosoporte@gmail.com
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
