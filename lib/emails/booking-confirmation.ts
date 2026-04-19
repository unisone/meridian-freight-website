/**
 * Enterprise-level booking confirmation auto-reply email.
 * Branded, multilingual (en/es/ru), with full container details.
 */
import { CONTACT, COMPANY, SITE, SOCIAL } from "@/lib/constants";
import { localizePath } from "@/lib/i18n-utils";

export interface BookingEmailParams {
  name: string;
  cargo: string;
  locale: string;
  bookingRef: string;
  container: {
    origin: string;
    destination: string;
    departureDate: string;
    etaDate: string | null;
    containerType: string;
    projectNumber: string;
  };
}

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

interface Translations {
  subject: (dest: string) => string;
  greeting: (name: string) => string;
  received: string;
  reviewTime: string;
  bookingDetailsTitle: string;
  reference: string;
  route: string;
  container: string;
  departure: string;
  estimatedArrival: string;
  etaPending: string;
  yourCargo: string;
  nextStepsTitle: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  needChanges: string;
  needChangesDesc: string;
  whatsapp: string;
  callUs: string;
  emailUs: string;
  trackSchedule: string;
  footerTagline: string;
  footerLicensed: string;
}

const TRANSLATIONS: Record<string, Translations> = {
  en: {
    subject: (dest) => `Booking Request Received — ${dest}`,
    greeting: (name) => `Hi ${name},`,
    received: "We received your booking request and our team is on it.",
    reviewTime: "You will hear back from us within <strong>24 hours</strong> with availability, pricing, and next steps.",
    bookingDetailsTitle: "Booking Details",
    reference: "Reference",
    route: "Route",
    container: "Container",
    departure: "Departure",
    estimatedArrival: "Est. Arrival",
    etaPending: "To be confirmed",
    yourCargo: "Your Cargo",
    nextStepsTitle: "What Happens Next",
    step1: "Review",
    step1Desc: "Our logistics team reviews your request and checks space availability",
    step2: "Quote",
    step2Desc: "We send you a detailed quote with pricing and loading instructions",
    step3: "Confirm",
    step3Desc: "You approve, we reserve your space and coordinate pickup",
    needChanges: "Need to make changes?",
    needChangesDesc: "Reply to this email or reach out directly:",
    whatsapp: "WhatsApp",
    callUs: "Call",
    emailUs: "Email",
    trackSchedule: "Track Shipping Schedule",
    footerTagline: "Professional Machinery Export & Logistics",
    footerLicensed: "Fully Insured &middot; 1,000+ Exports &middot; Licensed Freight Forwarder",
  },
  es: {
    subject: (dest) => `Solicitud de reserva recibida — ${dest}`,
    greeting: (name) => `Hola ${name},`,
    received: "Hemos recibido su solicitud de reserva y nuestro equipo ya esta trabajando en ella.",
    reviewTime: "Le responderemos dentro de las proximas <strong>24 horas</strong> con disponibilidad, precios y los siguientes pasos.",
    bookingDetailsTitle: "Detalles de la Reserva",
    reference: "Referencia",
    route: "Ruta",
    container: "Contenedor",
    departure: "Salida",
    estimatedArrival: "Llegada Est.",
    etaPending: "Por confirmar",
    yourCargo: "Su Carga",
    nextStepsTitle: "Proximos Pasos",
    step1: "Revision",
    step1Desc: "Nuestro equipo de logistica revisa su solicitud y verifica la disponibilidad de espacio",
    step2: "Cotizacion",
    step2Desc: "Le enviamos una cotizacion detallada con precios e instrucciones de carga",
    step3: "Confirmacion",
    step3Desc: "Usted aprueba, reservamos su espacio y coordinamos la recogida",
    needChanges: "Necesita hacer cambios?",
    needChangesDesc: "Responda a este correo o contactenos directamente:",
    whatsapp: "WhatsApp",
    callUs: "Llamar",
    emailUs: "Correo",
    trackSchedule: "Ver Calendario de Envios",
    footerTagline: "Exportacion Profesional de Maquinaria y Logistica",
    footerLicensed: "Totalmente Asegurado &middot; 1,000+ Exportaciones &middot; Operador de Carga Autorizado",
  },
  ru: {
    subject: (dest) => `Запрос на бронирование получен — ${dest}`,
    greeting: (name) => `Здравствуйте, ${name},`,
    received: "Мы получили ваш запрос на бронирование, и наша команда уже работает над ним.",
    reviewTime: "Мы свяжемся с вами в течение <strong>24 часов</strong> с информацией о наличии места, ценах и дальнейших шагах.",
    bookingDetailsTitle: "Детали Бронирования",
    reference: "Номер заявки",
    route: "Маршрут",
    container: "Контейнер",
    departure: "Отправление",
    estimatedArrival: "Ожид. прибытие",
    etaPending: "Будет подтверждено",
    yourCargo: "Ваш Груз",
    nextStepsTitle: "Что Дальше",
    step1: "Проверка",
    step1Desc: "Наша команда логистики проверяет ваш запрос и наличие свободного места",
    step2: "Расчет",
    step2Desc: "Мы отправим вам подробный расчет с ценами и инструкциями по загрузке",
    step3: "Подтверждение",
    step3Desc: "Вы подтверждаете, мы резервируем место и координируем забор груза",
    needChanges: "Нужно внести изменения?",
    needChangesDesc: "Ответьте на это письмо или свяжитесь с нами напрямую:",
    whatsapp: "WhatsApp",
    callUs: "Позвонить",
    emailUs: "Написать",
    trackSchedule: "Расписание Отправок",
    footerTagline: "Профессиональный Экспорт Техники и Логистика",
    footerLicensed: "Полная Страховка &middot; 1 000+ Отправок &middot; Лицензированный Экспедитор",
  },
};

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const DATE_LOCALES: Record<string, string> = { en: "en-US", es: "es-ES", ru: "ru-RU" };

function formatDate(dateStr: string, locale: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(DATE_LOCALES[locale] ?? "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// HTML builder
// ---------------------------------------------------------------------------

const LOGO_URL = `${SITE.url}/logos/MF%20Logos%20White/meridianFreight-logo-W-250.png`;
export function buildBookingConfirmationEmail(params: BookingEmailParams): {
  subject: string;
  html: string;
} {
  const t = TRANSLATIONS[params.locale] ?? TRANSLATIONS.en;
  const { name, cargo, bookingRef, container } = params;
  const locale = params.locale;

  const departureFormatted = formatDate(container.departureDate, locale);
  const etaFormatted = container.etaDate
    ? formatDate(container.etaDate, locale)
    : t.etaPending;
  const route = `${container.origin} → ${container.destination}`;
  const containerLabel = container.containerType === "fortyhc" || container.containerType === "40HC"
    ? "40HC"
    : container.containerType;
  const scheduleUrl = `${SITE.url}${localizePath(locale, "/schedule")}`;

  const subject = `${t.subject(container.destination)} | ${COMPANY.name}`;

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#0c4a6e,#0369a1,#0ea5e9);padding:32px 40px;border-radius:12px 12px 0 0;text-align:center">
    <img src="${LOGO_URL}" alt="${COMPANY.name}" width="180" height="auto" style="display:block;margin:0 auto 16px"/>
    <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);letter-spacing:0.5px;text-transform:uppercase">${t.bookingDetailsTitle}</p>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#ffffff;padding:40px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">

    <!-- Greeting -->
    <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111827">${t.greeting(name)}</p>
    <p style="margin:0 0 6px;font-size:15px;color:#374151;line-height:1.6">${t.received}</p>
    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.6">${t.reviewTime}</p>

    <!-- Booking Details Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:32px">
      <tr><td style="padding:20px 24px 12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

          <!-- Reference -->
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;width:130px;vertical-align:top">${t.reference}</td>
            <td style="padding:8px 0;font-size:15px;color:#0369a1;font-weight:700;font-family:'Courier New',monospace;letter-spacing:0.5px">${bookingRef}</td>
          </tr>

          <!-- Route -->
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;vertical-align:top">${t.route}</td>
            <td style="padding:8px 0;font-size:15px;color:#111827;font-weight:600">${route}</td>
          </tr>

          <!-- Container -->
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;vertical-align:top">${t.container}</td>
            <td style="padding:8px 0;font-size:15px;color:#111827">${containerLabel} &middot; ${container.projectNumber}</td>
          </tr>

          <!-- Departure -->
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;vertical-align:top">${t.departure}</td>
            <td style="padding:8px 0;font-size:15px;color:#111827;font-weight:600">${departureFormatted}</td>
          </tr>

          <!-- ETA -->
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#64748b;vertical-align:top">${t.estimatedArrival}</td>
            <td style="padding:8px 0;font-size:15px;color:#6b7280">${etaFormatted}</td>
          </tr>

          <!-- Cargo -->
          <tr>
            <td style="padding:8px 0;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;vertical-align:top;padding-top:14px">${t.yourCargo}</td>
            <td style="padding:8px 0;border-top:1px solid #e2e8f0;font-size:15px;color:#111827;padding-top:14px">${cargo}</td>
          </tr>

        </table>
      </td></tr>
    </table>

    <!-- Next Steps -->
    <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#111827">${t.nextStepsTitle}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
      <!-- Step 1 -->
      <tr>
        <td width="44" style="vertical-align:top;padding:0 12px 20px 0">
          <div style="width:36px;height:36px;border-radius:50%;background:#dbeafe;color:#1d4ed8;font-size:15px;font-weight:700;text-align:center;line-height:36px">1</div>
        </td>
        <td style="vertical-align:top;padding-bottom:20px">
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#111827">${t.step1}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5">${t.step1Desc}</p>
        </td>
      </tr>
      <!-- Step 2 -->
      <tr>
        <td width="44" style="vertical-align:top;padding:0 12px 20px 0">
          <div style="width:36px;height:36px;border-radius:50%;background:#dbeafe;color:#1d4ed8;font-size:15px;font-weight:700;text-align:center;line-height:36px">2</div>
        </td>
        <td style="vertical-align:top;padding-bottom:20px">
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#111827">${t.step2}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5">${t.step2Desc}</p>
        </td>
      </tr>
      <!-- Step 3 -->
      <tr>
        <td width="44" style="vertical-align:top;padding:0 12px 0 0">
          <div style="width:36px;height:36px;border-radius:50%;background:#dbeafe;color:#1d4ed8;font-size:15px;font-weight:700;text-align:center;line-height:36px">3</div>
        </td>
        <td style="vertical-align:top">
          <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#111827">${t.step3}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5">${t.step3Desc}</p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 28px"/>

    <!-- Need changes -->
    <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#111827">${t.needChanges}</p>
    <p style="margin:0 0 16px;font-size:14px;color:#6b7280">${t.needChangesDesc}</p>

    <!-- Contact buttons -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr>
        <td style="padding-right:10px">
          <a href="${CONTACT.whatsappUrl}" style="display:inline-block;padding:10px 20px;background:#25D366;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px">${t.whatsapp}</a>
        </td>
        <td style="padding-right:10px">
          <a href="${CONTACT.phoneHref}" style="display:inline-block;padding:10px 20px;background:#f1f5f9;color:#334155;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #cbd5e1">${t.callUs} ${CONTACT.phone}</a>
        </td>
        <td>
        <a href="${CONTACT.emailHref}" style="display:inline-block;padding:10px 20px;background:#f1f5f9;color:#334155;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #cbd5e1">${t.emailUs}</a>
        </td>
      </tr>
    </table>

    <!-- Track schedule CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${scheduleUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;letter-spacing:0.3px">${t.trackSchedule} &rarr;</a>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0f172a;padding:32px 40px;border-radius:0 0 12px 12px;text-align:center">

    <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#ffffff">${COMPANY.name}</p>
    <p style="margin:0 0 16px;font-size:13px;color:#94a3b8">${t.footerTagline}</p>

    <p style="margin:0 0 16px;font-size:13px;color:#64748b">${CONTACT.address.full}</p>

    <!-- Social links -->
    <p style="margin:0 0 20px">
      <a href="${SOCIAL.facebook}" style="display:inline-block;margin:0 8px;color:#94a3b8;font-size:13px;text-decoration:none">Facebook</a>
      <span style="color:#475569">&middot;</span>
      <a href="${SOCIAL.instagram}" style="display:inline-block;margin:0 8px;color:#94a3b8;font-size:13px;text-decoration:none">Instagram</a>
      <span style="color:#475569">&middot;</span>
      <a href="${SOCIAL.youtube}" style="display:inline-block;margin:0 8px;color:#94a3b8;font-size:13px;text-decoration:none">YouTube</a>
    </p>

    <hr style="border:none;border-top:1px solid #1e293b;margin:0 0 16px"/>

    <p style="margin:0;font-size:11px;color:#475569;line-height:1.5">${t.footerLicensed}</p>
    <p style="margin:8px 0 0;font-size:11px;color:#475569">&copy; ${new Date().getFullYear()} ${COMPANY.name}</p>

  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html };
}
