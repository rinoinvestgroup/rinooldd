import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/Layout';
import RegistrationModal from '@/components/RegistrationModal';
import { Calendar, MapPin, Clock, Phone, Globe, Users, Award, Shield, Star, Building2, TrendingUp, Sparkles, Mail } from 'lucide-react';
import { 
  trackButtonClick, 
  trackCustomEvent, 
  trackEmailClick, 
  trackViewContent,
  trackLead 
} from '@/utils/metaPixel';
import {
  trackEvent,
  trackFormSubmission,
  trackButtonClick as trackGAButtonClick,
  trackContact as trackGAContact,
  trackLead as trackGALead,
  trackExternalLink,
  trackRoadshowPageView,
  trackRoadshowRegistration,
  trackRoadshowCTAClick,
  trackRoadshowModalInteraction
} from '@/utils/googleAnalytics';
import {
  gtmTrackRoadshowPageView,
  gtmTrackRoadshowRegistration,
  gtmTrackRoadshowCTA,
  gtmTrackRoadshowModal,
  gtmTrackButtonClick,
  gtmTrackExternalLink,
  gtmTrackVenueInteraction,
  gtmTrackFormStart,
  gtmTrackFormSubmit,
  gtmTrackFormError,
  initializeRoadshowTracking,
  gtmTrackContact,
  gtmTrackEvent
} from '@/utils/gtm';
import { validateRoadshowGTM } from '@/utils/gtmDebug';
import { useLanguage } from '@/context/LanguageContext';

const MadridRoadshow2025 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Use the global language context
  const { language: contextLanguage } = useLanguage();
  // Map context language to supported languages - default to Spanish for this page
  const language = contextLanguage === 'ar' ? 'ar' : 
                   contextLanguage === 'en' ? 'en' : 'es';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    propertyType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Translation content type
  interface TranslationContent {
    pageTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    heroDescription: string;
    eventBadge: string;
    daysLabel: string;
    propertiesLabel: string;
    experienceLabel: string;
    venueLabel: string;
    addressLabel: string;
    datesLabel: string;
    timingLabel: string;
    formTitle: string;
    formSubtitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    propertyInterest: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    privacyNote: string;
    whyAttendBadge: string;
    whyAttendTitle: string;
    whyAttendSubtitle: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    benefit4Title: string;
    benefit4Desc: string;
    benefit5Title: string;
    benefit5Desc: string;
    reserveSpotBtn: string;
    eventDetailsTitle: string;
    venueHeading: string;
    datesHeading: string;
    timingHeading: string;
    openInMaps: string;
    reserveAppointmentTitle: string;
    reserveAppointmentDesc: string;
    bookSlotBtn: string;
    whyChooseTitle: string;
    whyChooseSubtitle: string;
    whyCard1Title: string;
    whyCard1Desc: string;
    whyCard2Title: string;
    whyCard2Desc: string;
    whyCard3Title: string;
    whyCard3Desc: string;
    whyCard4Title: string;
    whyCard4Desc: string;
    aboutTitle: string;
    aboutDesc: string;
    ourExpertiseTitle: string;
    expertise1: string;
    expertise2: string;
    expertise3: string;
    expertise4: string;
    ourMarketsTitle: string;
    market1: string;
    market2: string;
    market3: string;
    market4: string;
    contactTitle: string;
    registerNowBtn: string;
  }

  // Translation content
  const content: Record<'en' | 'es' | 'ar', TranslationContent> = {
    en: {
      pageTitle: "Madrid Roadshow 2025 - RINO Properties | Nov 20-22",
      heroTitle: "RINO Properties & RINO Assets",
      heroSubtitle: "Madrid Roadshow",
      heroTagline: "Exclusive Properties in Dubai & Spain",
      heroDescription: "Join RINO Properties for an exclusive three-day event showcasing the finest real estate and investment opportunities across the United Arab Emirates and Spain.",
      eventBadge: "Free Event • Nov 20-22, 2025",
      daysLabel: "Days",
      propertiesLabel: "Properties",
      experienceLabel: "Experience",
      venueLabel: "Wellington Hotel & Spa",
      addressLabel: "Calle de Velázquez 8, 28001 Madrid, Spain",
      datesLabel: "20–22 November 2025",
      timingLabel: "11 AM – 9 PM",
      formTitle: "Reserve Your Spot",
      formSubtitle: "Limited appointments available",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      country: "Country",
      propertyInterest: "Property Interest",
      submitButton: "Reserve My Appointment",
      submitting: "Registering...",
      successTitle: "Registration Successful!",
      successMessage: "We'll contact you shortly with event details.",
      errorMessage: "There was an error. Please try again.",
      privacyNote: "By submitting, you agree to be contacted about the Madrid Roadshow 2025.",
      
      // Why Attend Section
      whyAttendBadge: "Event Highlights",
      whyAttendTitle: "Why Attend This Free Event",
      whyAttendSubtitle: "Unlock unparalleled investment opportunities and connect with industry experts",
      benefit1Title: "Premium Properties",
      benefit1Desc: "Explore premium residential and investment projects in Spain and Dubai",
      benefit2Title: "Investment Benefits",
      benefit2Desc: "0 Taxes • High ROI, Golden Visas, company formation, and investment residency options",
      benefit3Title: "Expert Consultants",
      benefit3Desc: "Meet our property consultants in person for personalized guidance",
      benefit4Title: "Exclusive Access",
      benefit4Desc: "Access to exclusive off-plan developments and listings in Dubai",
      benefit5Title: "RINO Invest Asset",
      benefit5Desc: "Comprehensive asset management and investment services tailored to maximize your portfolio returns with expert guidance and strategic planning",
      reserveSpotBtn: "Reserve Your Spot Now",
      
      // Event Details Section
      eventDetailsTitle: "Event Details",
      venueHeading: "Venue",
      datesHeading: "Dates",
      timingHeading: "Timing",
      openInMaps: "Open in Maps",
      reserveAppointmentTitle: "Reserve Your Appointment",
      reserveAppointmentDesc: "Attendance is by appointment only. Secure your private consultation with our investment and property advisors.",
      bookSlotBtn: "Book Your Slot Now",
      
      // Why Choose Us Section
      whyChooseTitle: "Why Choose RINO Properties",
      whyChooseSubtitle: "Discover. Connect. Grow with Confidence.",
      whyCard1Title: "15+ Years of Excellence",
      whyCard1Desc: "Proven track record in luxury real estate across Dubai and Spain with thousands of satisfied clients.",
      whyCard2Title: "Expert Consultation",
      whyCard2Desc: "Dedicated property consultants with deep market knowledge and personalized investment strategies.",
      whyCard3Title: "Secure Investments",
      whyCard3Desc: "Verified properties, legal compliance, and transparent processes ensuring your investment security.",
      whyCard4Title: "Exclusive Access",
      whyCard4Desc: "First access to off-plan developments, exclusive listings, and premium investment opportunities.",
      
      // About Section
      aboutTitle: "About RINO Properties",
      aboutDesc: "RINO Properties specializes in luxury real estate across Dubai and Spain, delivering exceptional properties that combine design, value, and investment potential.",
      ourExpertiseTitle: "Our Expertise",
      expertise1: "Luxury residential properties",
      expertise2: "Commercial real estate",
      expertise3: "Investment consulting",
      expertise4: "Golden Visa assistance",
      ourMarketsTitle: "Our Markets",
      market1: "Dubai, UAE",
      market2: "Madrid, Spain",
      market3: "Barcelona, Spain",
      market4: "Marbella, Spain",
      
      // Contact Section
      contactTitle: "Contact Us",
      registerNowBtn: "Register Now for Madrid Roadshow 2025",
    },
    es: {
      pageTitle: "Madrid Roadshow 2025 - RINO Properties | Nov 20-22",
      heroTitle: "RINO Properties & RINO Assets",
      heroSubtitle: "Madrid Roadshow",
      heroTagline: "Propiedades Exclusivas en Dubái y España",
      heroDescription: "Únase a RINO Properties para un evento exclusivo de tres días que presenta las mejores oportunidades inmobiliarias y de inversión en los Emiratos Árabes Unidos y España.",
      eventBadge: "Evento Exclusivo • 20-22 Nov, 2025",
      daysLabel: "Días",
      propertiesLabel: "Propiedades",
      experienceLabel: "Experiencia",
      venueLabel: "Wellington Hotel & Spa",
      addressLabel: "Calle de Velázquez 8, 28001 Madrid, España",
      datesLabel: "20–22 Noviembre 2025",
      timingLabel: "11 AM – 9 PM",
      formTitle: "Reserve Su Lugar",
      formSubtitle: "Citas limitadas disponibles",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      phone: "Teléfono",
      country: "País",
      propertyInterest: "Interés de Propiedad",
      submitButton: "Reservar Mi Cita",
      submitting: "Registrando...",
      successTitle: "¡Registro Exitoso!",
      successMessage: "Nos pondremos en contacto pronto con los detalles del evento.",
      errorMessage: "Hubo un error. Por favor, inténtelo de nuevo.",
      privacyNote: "Al enviar, acepta ser contactado sobre el Madrid Roadshow 2025.",
      
      // Why Attend Section
      whyAttendBadge: "Destacados del Evento",
      whyAttendTitle: "Por Qué Asistir a Este Evento Exclusivo",
      whyAttendSubtitle: "Desbloquee oportunidades de inversión incomparables y conéctese con expertos de la industria",
      benefit1Title: "Propiedades Premium",
      benefit1Desc: "Explore proyectos residenciales y de inversión premium en España y Dubái",
      benefit2Title: "Beneficios de Inversión",
      benefit2Desc: "0 Impuestos • Alto ROI, Visas Doradas, formación de empresas y opciones de residencia por inversión",
      benefit3Title: "Consultores Expertos",
      benefit3Desc: "Conozca a nuestros consultores inmobiliarios en persona para orientación personalizada",
      benefit4Title: "Acceso Exclusivo",
      benefit4Desc: "Acceso a desarrollos sobre plano exclusivos y listados en Dubái",
      benefit5Title: "RINO Invest Asset",
      benefit5Desc: "Servicios integrales de gestión de activos e inversiones diseñados para maximizar los rendimientos de su cartera con orientación experta y planificación estratégica",
      reserveSpotBtn: "Reserve Su Lugar Ahora",
      
      // Event Details Section
      eventDetailsTitle: "Detalles del Evento",
      venueHeading: "Lugar",
      datesHeading: "Fechas",
      timingHeading: "Horario",
      openInMaps: "Abrir en Mapas",
      reserveAppointmentTitle: "Reserve Su Cita",
      reserveAppointmentDesc: "La asistencia es solo con cita previa. Asegure su consulta privada con nuestros asesores de inversión e inmobiliarios.",
      bookSlotBtn: "Reserve Su Cita Ahora",
      
      // Why Choose Us Section
      whyChooseTitle: "Por Qué Elegir RINO Properties",
      whyChooseSubtitle: "Descubra. Conéctese. Crezca con Confianza.",
      whyCard1Title: "Más de 15 Años de Excelencia",
      whyCard1Desc: "Trayectoria comprobada en bienes raíces de lujo en Dubái y España con miles de clientes satisfechos.",
      whyCard2Title: "Consultoría Experta",
      whyCard2Desc: "Consultores inmobiliarios dedicados con profundo conocimiento del mercado y estrategias de inversión personalizadas.",
      whyCard3Title: "Inversiones Seguras",
      whyCard3Desc: "Propiedades verificadas, cumplimiento legal y procesos transparentes que garantizan la seguridad de su inversión.",
      whyCard4Title: "Acceso Exclusivo",
      whyCard4Desc: "Primer acceso a desarrollos sobre plano, listados exclusivos y oportunidades de inversión premium.",
      
      // About Section
      aboutTitle: "Acerca de RINO Properties",
      aboutDesc: "RINO Properties se especializa en bienes raíces de lujo en Dubái y España, ofreciendo propiedades excepcionales que combinan diseño, valor y potencial de inversión.",
      ourExpertiseTitle: "Nuestra Experiencia",
      expertise1: "Propiedades residenciales de lujo",
      expertise2: "Bienes raíces comerciales",
      expertise3: "Consultoría de inversiones",
      expertise4: "Asistencia con Visa Dorada",
      ourMarketsTitle: "Nuestros Mercados",
      market1: "Dubái, EAU",
      market2: "Madrid, España",
      market3: "Barcelona, España",
      market4: "Marbella, España",
      
      // Contact Section
      contactTitle: "Contáctenos",
      registerNowBtn: "Regístrese Ahora para Madrid Roadshow 2025",
    },
    ar: {
      pageTitle: "معرض مدريد 2025 - RINO Properties | 20-22 نوفمبر",
      heroTitle: "RINO Properties & RINO Assets",
      heroSubtitle: "معرض مدريد",
      heroTagline: "عقارات حصرية في دبي وإسبانيا",
      heroDescription: "انضم إلى RINO Properties في حدث حصري لمدة ثلاثة أيام يعرض أفضل الفرص العقارية والاستثمارية في الإمارات العربية المتحدة وإسبانيا.",
      eventBadge: "حدث حصري • 20-22 نوفمبر 2025",
      daysLabel: "أيام",
      propertiesLabel: "عقارات",
      experienceLabel: "تجربة",
      venueLabel: "Wellington Hotel & Spa",
      addressLabel: "8 Calle de Velázquez، 28001 مدريد، إسبانيا",
      datesLabel: "20-22 نوفمبر 2025",
      timingLabel: "11 صباحاً – 11 مساءً",
      formTitle: "احجز مكانك",
      formSubtitle: "المواعيد محدودة",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      country: "الدولة",
      propertyInterest: "الاهتمام العقاري",
      submitButton: "احجز موعدي",
      submitting: "جاري التسجيل...",
      successTitle: "تم التسجيل بنجاح!",
      successMessage: "سنتواصل معك قريباً بتفاصيل الحدث.",
      errorMessage: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      privacyNote: "بإرسالك، فإنك توافق على الاتصال بك بخصوص معرض مدريد 2025.",
      
      // Why Attend Section
      whyAttendBadge: "أبرز معالم الحدث",
      whyAttendTitle: "لماذا تحضر هذا الحدث الحصري",
      whyAttendSubtitle: "افتح فرص استثمارية لا مثيل لها وتواصل مع خبراء الصناعة",
      benefit1Title: "عقارات متميزة",
      benefit1Desc: "استكشف المشاريع السكنية والاستثمارية المتميزة في إسبانيا ودبي",
      benefit2Title: "مزايا الاستثمار",
      benefit2Desc: "0 ضرائب • عائد استثمار مرتفع، التأشيرات الذهبية، تأسيس الشركات وخيارات الإقامة الاستثمارية",
      benefit3Title: "استشاريون خبراء",
      benefit3Desc: "التقِ بمستشارينا العقاريين شخصياً للحصول على إرشادات مخصصة",
      benefit4Title: "وصول حصري",
      benefit4Desc: "الوصول إلى التطويرات خارج الخطة والقوائم الحصرية في دبي",
      benefit5Title: "RINO Invest Asset",
      benefit5Desc: "خدمات شاملة لإدارة الأصول والاستثمار مصممة لتحقيق أقصى عائدات من محفظتك مع إرشادات الخبراء والتخطيط الاستراتيجي",
      reserveSpotBtn: "احجز مكانك الآن",
      
      // Event Details Section
      eventDetailsTitle: "تفاصيل الحدث",
      venueHeading: "المكان",
      datesHeading: "التواريخ",
      timingHeading: "التوقيت",
      openInMaps: "افتح في الخرائط",
      reserveAppointmentTitle: "احجز موعدك",
      reserveAppointmentDesc: "الحضور بموعد مسبق فقط. احجز استشارتك الخاصة مع مستشاري الاستثمار والعقارات لدينا.",
      bookSlotBtn: "احجز موعدك الآن",
      
      // Why Choose Us Section
      whyChooseTitle: "لماذا تختار RINO Properties",
      whyChooseSubtitle: "اكتشف. تواصل. انمُ بثقة.",
      whyCard1Title: "أكثر من 15 عاماً من التميز",
      whyCard1Desc: "سجل حافل في العقارات الفاخرة عبر دبي وإسبانيا مع آلاف العملاء الراضين.",
      whyCard2Title: "استشارات خبيرة",
      whyCard2Desc: "مستشارون عقاريون متخصصون بمعرفة عميقة بالسوق واستراتيجيات استثمار مخصصة.",
      whyCard3Title: "استثمارات آمنة",
      whyCard3Desc: "عقارات موثقة، امتثال قانوني، وعمليات شفافة تضمن أمان استثمارك.",
      whyCard4Title: "وصول حصري",
      whyCard4Desc: "الوصول الأول إلى التطويرات خارج الخطة، والقوائم الحصرية، وفرص الاستثمار المتميزة.",
      
      // About Section
      aboutTitle: "حول RINO Properties",
      aboutDesc: "تتخصص RINO Properties في العقارات الفاخرة عبر دبي وإسبانيا، حيث تقدم عقارات استثنائية تجمع بين التصميم والقيمة وإمكانات الاستثمار.",
      ourExpertiseTitle: "خبرتنا",
      expertise1: "عقارات سكنية فاخرة",
      expertise2: "عقارات تجارية",
      expertise3: "استشارات استثمارية",
      expertise4: "المساعدة في التأشيرة الذهبية",
      ourMarketsTitle: "أسواقنا",
      market1: "دبي، الإمارات",
      market2: "مدريد، إسبانيا",
      market3: "برشلونة، إسبانيا",
      market4: "ماربيا، إسبانيا",
      
      // Contact Section
      contactTitle: "اتصل بنا",
      registerNowBtn: "سجل الآن لمعرض مدريد 2025",
    }
  };

  const t = content[language as 'en' | 'es' | 'ar'] || content.en;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Track key field interactions
    if (name === 'email' && value.includes('@')) {
      // Meta Pixel tracking
      trackCustomEvent('FormFieldComplete', {
        field: 'email',
        event: 'Madrid Roadshow 2025'
      });
      // Google Analytics tracking
      trackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'email_field',
        custom_parameters: {
          field_name: 'email',
          event_name: 'Madrid Roadshow 2025',
          form_name: 'Madrid Roadshow Registration'
        }
      });
      // GTM tracking
      gtmTrackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'email_field',
        custom_parameters: {
          field_name: 'email',
          field_value: 'email_entered',
          event_name: 'Madrid Roadshow 2025',
          form_name: 'Madrid Roadshow Registration',
          form_step: 'email_validation'
        }
      });
    }
    
    if (name === 'country' && value) {
      // Google Analytics tracking for country selection
      trackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'country_selection',
        custom_parameters: {
          field_name: 'country',
          field_value: value,
          event_name: 'Madrid Roadshow 2025'
        }
      });
      // GTM tracking
      gtmTrackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'country_selection',
        custom_parameters: {
          field_name: 'country',
          field_value: value,
          event_name: 'Madrid Roadshow 2025',
          form_name: 'Madrid Roadshow Registration',
          form_step: 'country_selection'
        }
      });
    }
    
    if (name === 'propertyType' && value) {
      // Google Analytics tracking for property type selection
      trackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'property_type_selection',
        custom_parameters: {
          field_name: 'propertyType',
          field_value: value,
          event_name: 'Madrid Roadshow 2025'
        }
      });
      // GTM tracking
      gtmTrackEvent('form_field_complete', {
        event_category: 'form_interaction',
        event_label: 'property_type_selection',
        custom_parameters: {
          field_name: 'propertyType',
          field_value: value,
          event_name: 'Madrid Roadshow 2025',
          form_name: 'Madrid Roadshow Registration',
          form_step: 'property_interest_selection'
        }
      });
    }

    // Track form start on first interaction
    if (name === 'firstName' && value.length === 1) {
      gtmTrackFormStart('Madrid Roadshow Registration', 'roadshow-registration-form');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Meta Pixel tracking
    trackCustomEvent('RegistrationFormSubmit', {
      event: 'Madrid Roadshow 2025',
      country: formData.country,
      property_type: formData.propertyType,
      form_completion: 'started'
    });
    
    // Google Analytics tracking
    trackRoadshowRegistration(formData.country, formData.propertyType, 'started');
    trackFormSubmission('Madrid Roadshow Registration', 'event_registration', {
      event_name: 'Madrid Roadshow 2025',
      user_country: formData.country,
      property_interest: formData.propertyType
    });

    // GTM tracking - Form submission started
    gtmTrackRoadshowRegistration({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      propertyType: formData.propertyType,
      language: language,
      stage: 'started'
    });
    
    try {
      // // ZAPIER WEBHOOK: Send lead data to Zapier for CRM integration
      // const zapierWebhookResponse = await fetch('https://hooks.zapier.com/hooks/catch/14712787/u8w1779/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     // Lead information for CRM
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     fullName: `${formData.firstName} ${formData.lastName}`,
      //     email: formData.email,
      //     phone: formData.phone,
      //     country: formData.country,
      //     propertyInterest: formData.propertyType || 'Not specified',
      //     message: formData.message || 'No additional message',
          
      //     // Event details
      //     eventName: 'Madrid Roadshow 2025',
      //     eventDates: 'November 20-22, 2025',
      //     venue: 'Wellington Hotel & Spa, Madrid',
      //     language: language.toUpperCase(),
          
      //     // Lead metadata
      //     leadSource: 'Madrid Roadshow Landing Page',
      //     leadType: 'Event Registration',
      //     leadValue: 2000,
      //     currency: 'EUR',
      //     registrationDate: new Date().toISOString(),
      //     registrationDateFormatted: new Date().toLocaleString('en-GB', { 
      //       dateStyle: 'full', 
      //       timeStyle: 'short',
      //       timeZone: 'Europe/Madrid'
      //     }),
          
      //     // UTM parameters (if available)
      //     utmSource: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : null,
      //     utmMedium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : null,
      //     utmCampaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null,
      //   }),
      // });

      // EMAIL 1: Send registration data to your team
      const teamEmailResponse = await fetch('https://formspree.io/f/mqawkbqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          // Team email - Registration data
          _to: 'roadshow@rinoproperties.com',
          _cc: 'info03@ecolexlegal.com',
          _subject: `🎯 New Madrid Roadshow Registration - ${formData.firstName} ${formData.lastName} (${formData.country})`,
          _replyto: formData.email,
          
          // Customer information
          'Full Name': `${formData.firstName} ${formData.lastName}`,
          'Email': formData.email,
          'Phone': formData.phone,
          'Country': formData.country,
          'Property Interest': formData.propertyType || 'Not specified',
          'Message': formData.message || 'No additional message',
          
          // Registration metadata
          'Language': language.toUpperCase(),
          'Registration Date': new Date().toLocaleString('en-GB', { 
            dateStyle: 'full', 
            timeStyle: 'short',
            timeZone: 'Europe/Madrid'
          }),
          'Event': 'Madrid Roadshow 2025',
          'Event Dates': 'November 20-22, 2025',
          'Venue': 'Wellington Hotel & Spa, Madrid',
          
          // Spam protection
          _gotcha: '',
        }),
      });

      // Check if team email was sent successfully
      if (!teamEmailResponse.ok) {
        throw new Error('Failed to send registration to team');
      }
      
      // Use team email response as primary indicator of success
      const response = teamEmailResponse;

      
      if (response.ok) {
        setSubmitStatus('success');
        
        // Meta Pixel tracking
        trackLead({
          content_name: 'Madrid Roadshow 2025 Registration',
          content_category: 'Event Registration',
          value: 2000,
          currency: 'EUR'
        });

        trackCustomEvent('RoadshowRegistrationComplete', {
          event: 'Madrid Roadshow 2025',
          country: formData.country,
          property_type: formData.propertyType,
          form_completion: 'success'
        });

        // Google Analytics tracking
        trackRoadshowRegistration(formData.country, formData.propertyType, 'completed');
        trackGALead('Madrid Roadshow Registration', 2000, 'Madrid Roadshow 2025', {
          event_name: 'Madrid Roadshow 2025',
          user_country: formData.country,
          property_interest: formData.propertyType,
          event_date: '2025-11-20',
          lead_value: 2000,
          currency: 'EUR'
        });

        // GTM tracking - Registration completed with lead generation
        gtmTrackRoadshowRegistration({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          propertyType: formData.propertyType,
          language: language,
          stage: 'completed'
        });

        // GTM form submission tracking
        gtmTrackFormSubmit('Madrid Roadshow Registration', {
          form_id: 'roadshow-registration-form',
          form_type: 'event_registration',
          form_destination: '/madrid-roadshow-thank-you',
          form_submit_text: t.submitButton,
          lead_value: 2000,
          currency: 'EUR'
        });

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            propertyType: '',
            message: ''
          });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        // Meta Pixel tracking
        trackCustomEvent('RegistrationFormError', {
          event: 'Madrid Roadshow 2025',
          error: 'form_submission_failed'
        });
        // Google Analytics tracking
        trackRoadshowRegistration(formData.country, formData.propertyType, 'failed');
        trackEvent('form_error', {
          event_category: 'form',
          event_label: 'Madrid Roadshow Registration',
          custom_parameters: {
            error_type: 'form_submission_failed',
            event_name: 'Madrid Roadshow 2025'
          }
        });
        // GTM tracking
        gtmTrackRoadshowRegistration({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          propertyType: formData.propertyType,
          language: language,
          stage: 'failed'
        });
        gtmTrackFormError('Madrid Roadshow Registration', 'form_submission_failed', 'general');
      }
    } catch (error) {
      setSubmitStatus('error');
      // Meta Pixel tracking
      trackCustomEvent('RegistrationFormError', {
        event: 'Madrid Roadshow 2025',
        error: 'network_error'
      });
      // Google Analytics tracking
      trackRoadshowRegistration(formData.country, formData.propertyType, 'failed');
      trackEvent('form_error', {
        event_category: 'form',
        event_label: 'Madrid Roadshow Registration',
        custom_parameters: {
          error_type: 'network_error',
          event_name: 'Madrid Roadshow 2025'
        }
      });
      // GTM tracking
      gtmTrackRoadshowRegistration({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        propertyType: formData.propertyType,
        language: language,
        stage: 'failed'
      });
      gtmTrackFormError('Madrid Roadshow Registration', 'network_error', 'general');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Initialize GTM roadshow tracking
    initializeRoadshowTracking();

    // Meta Pixel tracking
    trackViewContent({
      content_name: 'Madrid Roadshow 2025 Landing Page',
      content_category: 'Event Landing Page',
      content_ids: ['madrid-roadshow-2025']
    });

    trackCustomEvent('RoadshowPageView', {
      event_name: 'Madrid Roadshow 2025',
      page_type: 'landing_page',
      event_date: '2025-11-20'
    });

    // Google Analytics tracking
    trackRoadshowPageView(language);
    trackEvent('page_view', {
      event_category: 'event_page',
      event_label: 'Madrid Roadshow 2025',
      custom_parameters: {
        event_name: 'Madrid Roadshow 2025',
        page_type: 'landing_page',
        event_date: '2025-11-20',
        page_language: language,
        content_group1: 'Event Pages',
        content_group2: 'Roadshow'
      }
    });

    // GTM tracking - Roadshow page view with enhanced data
    gtmTrackRoadshowPageView(language);

    // Enhanced scroll tracking for GTM
    let scrollThresholds = [25, 50, 75, 90, 100];
    let trackedThresholds: number[] = [];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Batch all layout reads together
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          const scrollPercent = Math.round(
            (scrollY / (documentHeight - windowHeight)) * 100
          );

          scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !trackedThresholds.includes(threshold)) {
              trackedThresholds.push(threshold);
              gtmTrackEvent('scroll_depth', {
                event_category: 'engagement',
                event_label: `${threshold}%`,
                value: threshold,
                custom_parameters: {
                  event_name: 'Madrid Roadshow 2025',
                  scroll_percentage: threshold,
                  page_type: 'landing_page'
                }
              });
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // GTM validation in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        validateRoadshowGTM();
      }, 3000);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [language]);

  const eventDetails = {
    venue: "Wellington Hotel & Spa, Calle de Velázquez 8, 28001 Madrid, Spain",
    venueWebsite: "https://www.hotel-wellington.com",
    venueMapLink: "https://maps.app.goo.gl/iPXcHfYLswH2Sbub8",
    dates: "20–22 November 2025",
    timing: "11 AM – 9 PM",
    contact: "roadshow@rinoproperties.com",
    website: "www.rinoproperties.com"
  };

  const whyChooseUs = [
    {
      icon: <Award className="w-8 h-8 text-rino-red-500" />,
      title: "15+ Years of Excellence",
      description: "Proven track record in luxury real estate across Dubai and Spain with thousands of satisfied clients."
    },
    {
      icon: <Users className="w-8 h-8 text-rino-yellow-500" />,
      title: "Expert Consultation",
      description: "Dedicated property consultants with deep market knowledge and personalized investment strategies."
    },
    {
      icon: <Shield className="w-8 h-8 text-rino-red-500" />,
      title: "Secure Investments",
      description: "Verified properties, legal compliance, and transparent processes ensuring your investment security."
    },
    {
      icon: <Star className="w-8 h-8 text-rino-yellow-500" />,
      title: "Exclusive Access",
      description: "First access to off-plan developments, exclusive listings, and premium investment opportunities."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "RINO Properties & RINO Assets – Madrid Roadshow 2025",
    "startDate": "2025-11-20T10:00:00",
    "endDate": "2025-11-22T19:00:00",
    "location": {
      "@type": "Place",
      "name": "Wellington Hotel & Spa",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Madrid",
        "addressCountry": "Spain"
      }
    },
    "description": "Exclusive three-day event showcasing the finest real estate and investment opportunities across the United Arab Emirates and Spain.",
    "organizer": {
      "@type": "Organization",
      "name": "RINO Properties",
      "url": "https://rinoproperties.com"
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <meta name="keywords" content="Madrid roadshow, real estate event, Dubai properties, Spain properties, investment opportunities, luxury real estate" />
        <meta property="og:title" content="Madrid Roadshow 2025 - RINO Properties" />
        <meta property="og:description" content="Exclusive real estate event showcasing premium properties in Dubai and Spain" />
        <meta property="og:image" content="https://rinoproperties.com/images/hero_bg.webp" />
        <meta property="og:type" content="event" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <Layout 
        title="Madrid Roadshow 2025 - RINO Properties | Nov 20-22"
        description="Join RINO Properties exclusive Madrid event Nov 20-22, 2025. Discover premium Dubai & Spain properties. Book your appointment now!"
        noIndex={true}
        className="bg-gradient-to-br from-gray-50 to-white"
      >
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 -left-4 w-48 h-48 md:w-72 md:h-72 bg-rino-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 -right-4 w-48 h-48 md:w-72 md:h-72 bg-rino-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-48 h-48 md:w-72 md:h-72 bg-rino-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
          </div>

          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bg.webp"
              alt="Madrid Skyline"
              fill
              className="object-cover opacity-40 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
          </div>

          {/* Decorative Elements - Hidden on mobile */}
          <div className="hidden md:block absolute top-20 left-10 w-20 h-20 border-2 border-rino-yellow-500/30 rounded-full animate-ping-slow"></div>
          <div className="hidden md:block absolute bottom-40 right-20 w-16 h-16 border-2 border-rino-red-500/30 rounded-full animate-ping-slow animation-delay-2000"></div>

          {/* Two Column Layout */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              
              {/* Left Side - Content */}
              <div className="text-white">
                {/* Event Badge with Animation */}
                <div className="inline-flex items-center bg-gradient-to-r from-rino-red-500 via-rino-red-600 to-rino-yellow-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xl animate-fade-in-down backdrop-blur-sm border border-white/20 mb-6">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
                  <span className="whitespace-nowrap">{t.eventBadge}</span>
                </div>

                {/* Main Heading with Stagger Animation */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up mb-6">
                  <span className="block text-white drop-shadow-2xl">
                    {t.heroTitle}
                  </span>
                  <span className="block text-white drop-shadow-2xl mt-2">
                    {t.heroSubtitle}
                  </span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2">
                    2025
                  </span>
                </h1>

                {/* Subtitle */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="hidden sm:block h-px w-8 bg-gradient-to-r from-transparent to-rino-yellow-500"></div>
                  <p className="text-lg sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rino-yellow-400 to-rino-red-400">
                  </p>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-8 max-w-xl">
                  {t.heroDescription}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="text-3xl font-bold text-rino-yellow-400 mb-1">3</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">{t.daysLabel}</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="text-3xl font-bold text-rino-red-400 mb-1">100+</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">{t.propertiesLabel}</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="text-3xl font-bold text-rino-yellow-400 mb-1">VIP</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">{t.experienceLabel}</div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3 text-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-rino-yellow-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <a 
                        href={eventDetails.venueWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-rino-yellow-400 transition-colors underline font-semibold"
                      >
                        {t.venueLabel}
                      </a>
                      <p className="text-sm text-gray-300 mt-0.5">{t.addressLabel}</p>
                      <a
                        href={eventDetails.venueMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          // Google Analytics tracking
                          trackExternalLink(eventDetails.venueMapLink, 'Google Maps - Wellington Hotel', 'hero_section');
                          trackEvent('map_click', {
                            event_category: 'venue_interaction',
                            event_label: 'Wellington Hotel Madrid',
                            custom_parameters: {
                              venue_name: 'Wellington Hotel & Spa',
                              map_type: 'google_maps',
                              event_name: 'Madrid Roadshow 2025',
                              source: 'hero_section'
                            }
                          });
                          // GTM tracking
                          gtmTrackVenueInteraction('map_click', 'Wellington Hotel & Spa');
                          gtmTrackExternalLink(eventDetails.venueMapLink, 'Google Maps - Wellington Hotel', 'hero_section');
                        }}
                        className="inline-flex items-center gap-1.5 mt-2 text-xs bg-rino-yellow-500/20 hover:bg-rino-yellow-500/30 text-rino-yellow-300 px-3 py-1.5 rounded-full transition-all duration-300 border border-rino-yellow-500/30"
                      >
                        <MapPin className="w-3 h-3" />
                        {language === 'ar' ? 'عرض على خرائط جوجل' : language === 'es' ? 'Ver en Google Maps' : 'View on Google Maps'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-rino-red-400 shrink-0" />
                    <span>{t.datesLabel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-rino-yellow-400 shrink-0" />
                    <span>{t.timingLabel}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="animate-fade-in animation-delay-500">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
                  {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
                      <p className="text-gray-600">{t.successMessage}</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.formTitle}</h3>
                        <p className="text-sm text-gray-600">{t.formSubtitle}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4" data-gtm-manual="true">
                        {/* Name Fields */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                              {t.firstName} *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                              placeholder={language === 'ar' ? 'أحمد' : language === 'es' ? 'Juan' : 'John'}
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                              {t.lastName} *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                              placeholder={language === 'ar' ? 'محمد' : language === 'es' ? 'García' : 'Doe'}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                            {t.email} *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                            placeholder={language === 'ar' ? 'ahmed@example.com' : language === 'es' ? 'juan@ejemplo.com' : 'john@example.com'}
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                            {t.phone} *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                            placeholder={language === 'ar' ? '+971 43 21 2433' : '+34 635 955 137'}
                          />
                        </div>

                        {/* Country */}
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-1">
                            {t.country} *
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                          >
                            <option value="">{language === 'ar' ? 'اختر بلدك' : language === 'es' ? 'Seleccione su país' : 'Select your country'}</option>
                            <option value="Spain">{language === 'ar' ? 'إسبانيا' : language === 'es' ? 'España' : 'Spain'}</option>
                            <option value="UAE">{language === 'ar' ? 'الإمارات العربية المتحدة' : language === 'es' ? 'Emiratos Árabes Unidos' : 'United Arab Emirates'}</option>
                            <option value="UK">{language === 'ar' ? 'المملكة المتحدة' : language === 'es' ? 'Reino Unido' : 'United Kingdom'}</option>
                            <option value="France">{language === 'ar' ? 'فرنسا' : language === 'es' ? 'Francia' : 'France'}</option>
                            <option value="Germany">{language === 'ar' ? 'ألمانيا' : language === 'es' ? 'Alemania' : 'Germany'}</option>
                            <option value="Italy">{language === 'ar' ? 'إيطاليا' : language === 'es' ? 'Italia' : 'Italy'}</option>
                            <option value="Portugal">{language === 'ar' ? 'البرتغال' : 'Portugal'}</option>
                            <option value="Other">{language === 'ar' ? 'أخرى' : language === 'es' ? 'Otro' : 'Other'}</option>
                          </select>
                        </div>

                        {/* Property Interest */}
                        <div>
                          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-900 mb-1">
                            {t.propertyInterest}
                          </label>
                          <select
                            id="propertyType"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white"
                          >
                            <option value="">{language === 'ar' ? 'اختر نوع العقار' : language === 'es' ? 'Seleccionar tipo de propiedad' : 'Select property type'}</option>
                            <option value="Residential">{language === 'ar' ? 'عقارات سكنية' : language === 'es' ? 'Propiedades Residenciales' : 'Residential Properties'}</option>
                            <option value="Commercial">{language === 'ar' ? 'عقارات تجارية' : language === 'es' ? 'Propiedades Comerciales' : 'Commercial Properties'}</option>
                            <option value="Off-plan">{language === 'ar' ? 'تطويرات على الخارطة' : language === 'es' ? 'Desarrollos sobre Plano' : 'Off-plan Developments'}</option>
                            <option value="Golden Visa">{language === 'ar' ? 'عقارات التأشيرة الذهبية' : language === 'es' ? 'Propiedades Golden Visa' : 'Golden Visa Properties'}</option>
                            <option value="Investment">{language === 'ar' ? 'عقارات استثمارية' : language === 'es' ? 'Propiedades de Inversión' : 'Investment Properties'}</option>
                            <option value="All">{language === 'ar' ? 'جميع الأنواع' : language === 'es' ? 'Todos los Tipos' : 'All Types'}</option>
                          </select>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#C4903A] hover:bg-[#B58230] disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              {t.submitting}
                            </div>
                          ) : (
                            t.submitButton
                          )}
                        </button>

                        {submitStatus === 'error' && (
                          <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                            {t.errorMessage}
                          </div>
                        )}

                        <p className="text-xs text-gray-500 text-center">
                          {t.privacyNote}
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* Add custom animations in a style tag */}
        <style jsx>{`
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          @keyframes blob {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.8s ease-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          .animation-delay-500 {
            animation-delay: 0.5s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          .animation-delay-700 {
            animation-delay: 0.7s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          .animation-delay-1500 {
            animation-delay: 1.5s;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>

        {/* Why Attend Section - Redesigned */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rino-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rino-red-500/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  {t.whyAttendBadge}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t.whyAttendTitle}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.whyAttendSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
              {/* Benefit 1 */}
              <div className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-rino-red-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rino-red-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rino-red-500 to-rino-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Building2 className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.benefit1Title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {t.benefit1Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rino-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Benefit 2 */}
              <div className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-rino-yellow-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rino-yellow-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rino-yellow-500 to-rino-yellow-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.benefit2Title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {t.benefit2Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rino-yellow-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Benefit 3 */}
              <div className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-rino-red-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rino-red-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rino-red-500 to-rino-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.benefit3Title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {t.benefit3Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rino-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Benefit 4 */}
              <div className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-rino-yellow-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rino-yellow-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rino-yellow-500 to-rino-yellow-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.benefit4Title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {t.benefit4Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rino-yellow-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Benefit 5 - RINO Invest Asset */}
              <div className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-rino-red-500/20 overflow-hidden md:col-span-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rino-red-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rino-red-500 to-rino-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Shield className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t.benefit5Title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {t.benefit5Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rino-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  // Meta Pixel tracking
                  trackButtonClick('Register Now - Why Attend', {
                    event: 'Madrid Roadshow 2025',
                    section: 'why_attend',
                    action: 'open_registration_modal'
                  });
                  // Google Analytics tracking
                  trackRoadshowCTAClick('why_attend_section', t.reserveSpotBtn);
                  trackGAButtonClick(t.reserveSpotBtn, 'why_attend', {
                    event_name: 'Madrid Roadshow 2025',
                    cta_type: 'registration_modal',
                    button_position: 'why_attend_section'
                  });
                  trackRoadshowModalInteraction('open', 'why_attend_cta');
                  // GTM tracking
                  gtmTrackRoadshowCTA(t.reserveSpotBtn, 'why_attend_section', 'registration');
                  gtmTrackRoadshowModal('open', 'why_attend_cta');
                  gtmTrackButtonClick(t.reserveSpotBtn, 'why_attend_section', {
                    event_name: 'Madrid Roadshow 2025',
                    cta_type: 'registration_modal',
                    button_position: 'why_attend_section'
                  });
                }}
                className="inline-flex items-center justify-center gap-2 bg-white text-black hover:from-rino-red-600 hover:to-rino-yellow-600  px-8 py-4 rounded-xl font-semibold text-black shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                {t.reserveSpotBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Event Details Section */}
        <section id="event-details" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t.eventDetailsTitle}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <MapPin className="w-12 h-12 text-rino-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t.venueHeading}</h3>
                  <p className="text-gray-300 mb-4">{eventDetails.venue}</p>
                  <a
                    href={eventDetails.venueMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Google Analytics tracking
                      trackExternalLink(eventDetails.venueMapLink, 'Google Maps - Wellington Hotel', 'event_details_section');
                      trackEvent('map_click', {
                        event_category: 'venue_interaction',
                        event_label: 'Wellington Hotel Madrid',
                        custom_parameters: {
                          venue_name: 'Wellington Hotel & Spa',
                          map_type: 'google_maps',
                          event_name: 'Madrid Roadshow 2025',
                          source: 'event_details_section'
                        }
                      });
                    }}
                    className="inline-flex items-center gap-2 text-sm bg-rino-yellow-500 hover:bg-rino-yellow-600 text-black px-4 py-2 rounded-lg transition-all duration-300 font-semibold"
                  >
                    <MapPin className="w-4 h-4" />
                    {t.openInMaps}
                  </a>
                </div>

                <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Calendar className="w-12 h-12 text-rino-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t.datesHeading}</h3>
                  <p className="text-gray-300">{eventDetails.dates}</p>
                </div>

                <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <Clock className="w-12 h-12 text-rino-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t.timingHeading}</h3>
                  <p className="text-gray-300">{eventDetails.timing}</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-rino-red-500/20 to-rino-yellow-500/20 p-8 rounded-2xl border border-rino-red-500/30">
                  <h3 className="text-2xl font-bold mb-4 text-rino-yellow-500">{t.reserveAppointmentTitle}</h3>
                  <p className="text-gray-300 mb-6">{t.reserveAppointmentDesc}</p>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      // Meta Pixel tracking
                      trackButtonClick('Book Your Slot Now - Event Details', {
                        event: 'Madrid Roadshow 2025',
                        section: 'event_details',
                        action: 'open_registration_modal'
                      });
                      trackLead({
                        content_name: 'Madrid Roadshow Registration',
                        content_category: 'Event Registration',
                        value: 1000,
                        currency: 'EUR'
                      });
                      // Google Analytics tracking
                      trackRoadshowCTAClick('event_details_section', t.bookSlotBtn);
                      trackGAButtonClick(t.bookSlotBtn, 'event_details', {
                        event_name: 'Madrid Roadshow 2025',
                        cta_type: 'registration_modal',
                        button_position: 'event_details_section'
                      });
                      trackGALead('Madrid Roadshow Registration', 1000, 'Event Details CTA', {
                        event_name: 'Madrid Roadshow 2025',
                        cta_location: 'event_details'
                      });
                      trackRoadshowModalInteraction('open', 'event_details_cta');
                    }}
                    className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 hover:from-rino-red-600 hover:to-rino-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {t.bookSlotBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.whyChooseTitle}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t.whyChooseSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {index === 0 ? t.whyCard1Title : index === 1 ? t.whyCard2Title : index === 2 ? t.whyCard3Title : t.whyCard4Title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {index === 0 ? t.whyCard1Desc : index === 1 ? t.whyCard2Desc : index === 2 ? t.whyCard3Desc : t.whyCard4Desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About RINO Properties Section */}
        <section className="py-20 bg-gradient-to-br from-gray-100 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.aboutTitle}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full mb-8"></div>
              
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  {t.aboutDesc}
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.ourExpertiseTitle}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-red-500 rounded-full mr-3"></div>
                        {t.expertise1}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-red-500 rounded-full mr-3"></div>
                        {t.expertise2}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-red-500 rounded-full mr-3"></div>
                        {t.expertise3}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-red-500 rounded-full mr-3"></div>
                        {t.expertise4}
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.ourMarketsTitle}</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-yellow-500 rounded-full mr-3"></div>
                        {t.market1}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-yellow-500 rounded-full mr-3"></div>
                        {t.market2}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-yellow-500 rounded-full mr-3"></div>
                        {t.market3}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-rino-yellow-500 rounded-full mr-3"></div>
                        {t.market4}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">{t.contactTitle}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full mb-12"></div>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col flex-wrap sm:flex-row justify-center items-center gap-8 mb-12">
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-rino-red-500 mr-3" />
                  <a 
                    href={`mailto:${eventDetails.contact}`} 
                    onClick={() => {
                      // Meta Pixel tracking
                      trackEmailClick('Madrid Roadshow Contact Section');
                      trackCustomEvent('ContactMethodClick', {
                        method: 'email',
                        event: 'Madrid Roadshow 2025',
                        section: 'contact'
                      });
                      // Google Analytics tracking
                      trackGAContact('email', 'contact_section', {
                        event_name: 'Madrid Roadshow 2025',
                        email_address: eventDetails.contact
                      });
                      trackEvent('email_click', {
                        event_category: 'contact',
                        event_label: 'madrid_roadshow_email',
                        custom_parameters: {
                          contact_method: 'email',
                          source: 'contact_section',
                          event_name: 'Madrid Roadshow 2025'
                        }
                      });
                    }}
                    className="text-lg hover:text-rino-yellow-500 transition-colors"
                  >
                    {eventDetails.contact}
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-rino-yellow-500 mr-3" />
                  <a 
                    href={`https://${eventDetails.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => {
                      // Meta Pixel tracking
                      trackCustomEvent('WebsiteClick', {
                        website: eventDetails.website,
                        event: 'Madrid Roadshow 2025',
                        section: 'contact'
                      });
                      // Google Analytics tracking
                      trackExternalLink(`https://${eventDetails.website}`, eventDetails.website, 'contact_section');
                      trackEvent('website_click', {
                        event_category: 'external_link',
                        event_label: eventDetails.website,
                        custom_parameters: {
                          link_url: `https://${eventDetails.website}`,
                          source: 'contact_section',
                          event_name: 'Madrid Roadshow 2025'
                        }
                      });
                    }}
                    className="text-lg hover:text-rino-red-500 transition-colors"
                  >
                    {eventDetails.website}
                  </a>
                </div>
                <div className="flex w-[100%] justify-center items-center">
                  <Phone className="w-6 h-6 text-rino-red-500 mr-3" />
                  <a 
                    href="tel:+34657555710" 
                    onClick={() => {
                      // Google Analytics tracking
                      trackGAContact('phone', 'contact_section', {
                        event_name: 'Madrid Roadshow 2025',
                        phone_number: '+34 657 55 57 10'
                      });
                      trackEvent('phone_click', {
                        event_category: 'contact',
                        event_label: 'madrid_roadshow_phone',
                        custom_parameters: {
                          contact_method: 'phone',
                          source: 'contact_section',
                          event_name: 'Madrid Roadshow 2025',
                          phone_number: '+34 657 55 57 10'
                        }
                      });
                    }}
                    className="text-lg  hover:text-rino-yellow-500 transition-colors"
                  >
                    +34 657 55 57 10
                  </a>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  // Meta Pixel tracking
                  trackButtonClick('Register Now - Contact Section', {
                    event: 'Madrid Roadshow 2025',
                    section: 'contact',
                    action: 'open_registration_modal'
                  });
                  trackLead({
                    content_name: 'Madrid Roadshow Registration',
                    content_category: 'Event Registration',
                    value: 1000,
                    currency: 'EUR'
                  });
                  // Google Analytics tracking
                  trackRoadshowCTAClick('contact_section', t.registerNowBtn);
                  trackGAButtonClick(t.registerNowBtn, 'contact', {
                    event_name: 'Madrid Roadshow 2025',
                    cta_type: 'registration_modal',
                    button_position: 'contact_section',
                    button_prominence: 'primary'
                  });
                  trackGALead('Madrid Roadshow Registration', 1000, 'Contact Section CTA', {
                    event_name: 'Madrid Roadshow 2025',
                    cta_location: 'contact_section'
                  });
                  trackRoadshowModalInteraction('open', 'contact_cta');
                  
                  // GTM tracking
                  gtmTrackRoadshowCTA(t.registerNowBtn, 'contact_section', 'registration');
                  gtmTrackRoadshowModal('open', 'contact_cta');
                  gtmTrackButtonClick(t.registerNowBtn, 'contact_section', {
                    event_name: 'Madrid Roadshow 2025',
                    cta_type: 'registration_modal',
                    button_position: 'contact_section',
                    button_prominence: 'primary'
                  });
                }}
                className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 hover:from-rino-red-600 hover:to-rino-yellow-600 text-white px-12 py-4 rounded-xl font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {t.registerNowBtn}
              </button>
            </div>
          </div>
        </section>

        {/* Registration Modal */}
        <RegistrationModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // Meta Pixel tracking
            trackCustomEvent('RegistrationModalClosed', {
              event: 'Madrid Roadshow 2025',
              action: 'close_modal'
            });
            // Google Analytics tracking
            trackRoadshowModalInteraction('close');
            trackEvent('modal_close', {
              event_category: 'modal_interaction',
              event_label: 'registration_modal',
              custom_parameters: {
                modal_type: 'registration',
                event_name: 'Madrid Roadshow 2025'
              }
            });
            // GTM tracking
            gtmTrackRoadshowModal('close');
          }}
        />
      </Layout>
    </>
  );
};

export default MadridRoadshow2025;