import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Building, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { 
  trackCustomEvent, 
  trackLead
} from '@/utils/metaPixel';
import { 
  trackRoadshowRegistration, 
  trackFormSubmission, 
  trackEvent,
  trackLead as trackGALead 
} from '@/utils/googleAnalytics';
import { useLanguage } from '@/context/LanguageContext';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}



const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  // Use the global language context
  const { language: contextLanguage } = useLanguage();
  // Map context language to supported languages - default to English
  const language = contextLanguage === 'ar' ? 'ar' : 
                   contextLanguage === 'es' ? 'es' : 'en';
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Track key field interactions
    if (name === 'email' && value.includes('@')) {
      trackCustomEvent('FormFieldComplete', {
        field: 'email',
        event: 'Madrid Roadshow 2025'
      });
    }
    
    if (name === 'country' && value) {
      trackCustomEvent('FormFieldComplete', {
        field: 'country',
        value: value,
        event: 'Madrid Roadshow 2025'
      });
    }
    
    if (name === 'propertyType' && value) {
      trackCustomEvent('FormFieldComplete', {
        field: 'property_type',
        value: value,
        event: 'Madrid Roadshow 2025'
      });
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
      //     leadSource: 'Madrid Roadshow Modal',
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

      // Prepare auto-reply email content based on language
      const autoReplyContent = {
        en: {
          subject: 'Thank You for Registering - Madrid Roadshow 2025',
          message: `Dear ${formData.firstName} ${formData.lastName},

Thank you for registering for the Madrid Roadshow 2025!

We're thrilled to confirm your registration for our exclusive three-day event from November 20-22, 2025, at the Wellington Hotel & Spa, Madrid.

EVENT DETAILS:
📍 Venue: Wellington Hotel & Spa
   Calle de Velázquez 8, 28001 Madrid, Spain
📅 Dates: November 20-22, 2025
⏰ Time: 11:00 AM - 11:00 PM

WHAT TO EXPECT:
✅ Exclusive access to 100+ premium properties in Dubai and Spain
✅ One-on-one consultation with our expert property advisors
✅ Golden Visa pathway information and guidance
✅ Special launch offers and investment opportunities
✅ Complimentary refreshments and networking opportunities

NEXT STEPS:
Our team will contact you within 24 hours to schedule your personalized appointment and share additional event details.

For immediate assistance, please contact us:
📧 Email: roadshow@rinoproperties.com
📱 Phone: +34 657 55 57 10
💬 WhatsApp: https://wa.me/34657555710
🌐 Website: www.rinoproperties.com

We look forward to welcoming you to this free event!

Best regards,
RINO Properties & RINO Assets Team
Madrid Roadshow 2025

---
This is an automated confirmation email.`
        },
        es: {
          subject: 'Gracias por su Registro - Madrid Roadshow 2025',
          message: `Estimado/a ${formData.firstName} ${formData.lastName},

¡Gracias por registrarse en el Madrid Roadshow 2025!

Estamos encantados de confirmar su registro para nuestro evento exclusivo de tres días del 20 al 22 de noviembre de 2025, en el Wellington Hotel & Spa, Madrid.

DETALLES DEL EVENTO:
📍 Lugar: Wellington Hotel & Spa
   Calle de Velázquez 8, 28001 Madrid, España
📅 Fechas: 20-22 de noviembre de 2025
⏰ Horario: 11:00 AM - 11:00 PM

QUÉ ESPERAR:
✅ Acceso exclusivo a más de 100 propiedades premium en Dubái y España
✅ Consulta individual con nuestros asesores inmobiliarios expertos
✅ Información y orientación sobre el proceso de Golden Visa
✅ Ofertas especiales de lanzamiento y oportunidades de inversión
✅ Refrigerios de cortesía y oportunidades de networking

PRÓXIMOS PASOS:
Nuestro equipo se pondrá en contacto con usted en un plazo de 24 horas para programar su cita personalizada y compartir detalles adicionales del evento.

Para asistencia inmediata, contáctenos:
📧 Email: roadshow@rinoproperties.com
📱 Teléfono: +34 657 55 57 10
💬 WhatsApp: https://wa.me/34657555710
🌐 Sitio web: www.rinoproperties.com

¡Esperamos darle la bienvenida a este evento exclusivo!

Saludos cordiales,
Equipo RINO Properties & RINO Assets
Madrid Roadshow 2025

---
Este es un correo electrónico de confirmación automática.`
        },
        ar: {
          subject: 'شكراً للتسجيل - معرض مدريد 2025',
          message: `عزيزي/عزيزتي ${formData.firstName} ${formData.lastName}،

شكراً لتسجيلك في معرض مدريد 2025!

يسعدنا تأكيد تسجيلك في حدثنا الحصري لمدة ثلاثة أيام من 20 إلى 22 نوفمبر 2025، في فندق Wellington Hotel & Spa، مدريد.

تفاصيل الحدث:
📍 المكان: Wellington Hotel & Spa
   8 Calle de Velázquez، 28001 مدريد، إسبانيا
📅 التواريخ: 20-22 نوفمبر 2025
⏰ التوقيت: 11:00 صباحاً - 11:00 مساءً

ما يمكن توقعه:
✅ وصول حصري إلى أكثر من 100 عقار متميز في دبي وإسبانيا
✅ استشارة فردية مع مستشارينا العقاريين الخبراء
✅ معلومات وإرشادات حول مسار الحصول على التأشيرة الذهبية
✅ عروض إطلاق خاصة وفرص استثمارية
✅ مرطبات مجانية وفرص للتواصل

الخطوات التالية:
سيتصل بك فريقنا خلال 24 ساعة لجدولة موعدك الشخصي ومشاركة تفاصيل إضافية عن الحدث.

للحصول على المساعدة الفورية، يرجى الاتصال بنا:
📧 البريد الإلكتروني: roadshow@rinoproperties.com
📱 الهاتف: +34 657 55 57 10
💬 واتساب: https://wa.me/34657555710
🌐 الموقع الإلكتروني: www.rinoproperties.com

نتطلع إلى الترحيب بك في هذا الحدث الحصري!

مع أطيب التحيات،
فريق RINO Properties & RINO Assets
معرض مدريد 2025

---
هذا بريد إلكتروني تأكيد تلقائي.`
        }
      };

      const selectedContent = autoReplyContent[language as 'en' | 'es' | 'ar'] || autoReplyContent.en;
     
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
          _cc: 'mehdi@rinoproperties.com',
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
      // EMAIL 2: Send auto-reply confirmation to customer
      const customerEmailResponse = await fetch('https://formspree.io/f/mqawkbqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          // Customer email - Confirmation
          _to: formData.email,
          _subject: selectedContent.subject,
          _replyto: 'roadshow@rinoproperties.com',
          
          // Auto-reply message body
          message: selectedContent.message,
          
          // Customer details for personalization
          firstName: formData.firstName,
          lastName: formData.lastName,
          
          // Spam protection
          _gotcha: '',
        }),
      });

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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 p-4 rounded-t-xl text-white relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 text-black hover:text-gray-800 transition-all z-10 hover:scale-110 transform duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-center pr-8">
            <div className="inline-block bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-black mb-2">
              🎯 FREE EVENT
            </div>
            <h2 className="text-lg font-bold mb-1 text-black">Madrid Roadshow 2025</h2>
            <p className="text-xs text-black font-medium">📅 Nov 20-22 • 📍 Wellington Hotel, Madrid</p>
          </div>
        </div>

        {/* Add animation styles */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.4s ease-out;
          }
        `}</style>

        {/* Form */}
        <div className="p-4">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">We'll contact you shortly with event details.</p>
              <Link 
                href="/madrid-roadshow-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-100  font-medium"
                onClick={() => {
                  trackCustomEvent('RoadshowDetailsClick', {
                    event: 'Madrid Roadshow 2025',
                    source: 'success_message'
                  });
                }}
              >
                View Full Event Details <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-3">
                <Link 
                  href="/madrid-roadshow-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  onClick={() => {
                    trackCustomEvent('RoadshowDetailsClick', {
                      event: 'Madrid Roadshow 2025',
                      source: 'modal_header'
                    });
                  }}
                >
                  View Event Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-gray-900 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white placeholder-gray-500 text-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-gray-900 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white placeholder-gray-500 text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-900 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white placeholder-gray-500 text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-900 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white placeholder-gray-500 text-sm"
                      placeholder="+34 123 456 789"
                    />
                  </div>
                </div>

                {/* Location and Property Type */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="country" className="block text-xs font-medium text-gray-900 mb-1">
                      Country/Region *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white text-sm"
                    >
                      <option value="" className="text-gray-500">Select your country</option>
                      <option value="Spain" className="text-gray-900">Spain</option>
                      <option value="UAE" className="text-gray-900">United Arab Emirates</option>
                      <option value="UK" className="text-gray-900">United Kingdom</option>
                      <option value="France" className="text-gray-900">France</option>
                      <option value="Germany" className="text-gray-900">Germany</option>
                      <option value="Italy" className="text-gray-900">Italy</option>
                      <option value="Portugal" className="text-gray-900">Portugal</option>
                      <option value="Netherlands" className="text-gray-900">Netherlands</option>
                      <option value="Belgium" className="text-gray-900">Belgium</option>
                      <option value="Other" className="text-gray-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-xs font-medium text-gray-900 mb-1">
                      Property Interest
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors text-gray-900 bg-white text-sm"
                    >
                      <option value="" className="text-gray-500">Select property type</option>
                      <option value="Residential" className="text-gray-900">Residential Properties</option>
                      <option value="Commercial" className="text-gray-900">Commercial Properties</option>
                      <option value="Off-plan" className="text-gray-900">Off-plan Developments</option>
                      <option value="Golden Visa" className="text-gray-900">Golden Visa Properties</option>
                      <option value="Investment" className="text-gray-900">Investment Properties</option>
                      <option value="All" className="text-gray-900">All Types</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-900 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-rino-red-500 focus:border-rino-red-500 transition-colors resize-none text-gray-900 bg-white placeholder-gray-500 text-sm"
                    placeholder="Property requirements or questions..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C4903A] hover:bg-[#B5822E] disabled:bg-gray-400 text-black py-3 px-4 rounded-md font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.01] disabled:transform-none transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Registering...
                      </div>
                    ) : (
                      'Reserve Appointment'
                    )}
                  </button>
                </div>

                {submitStatus === 'error' && (
                  <div className="text-center text-red-600 bg-red-50 p-2 rounded-md text-xs">
                    Error submitting registration. Please try again.
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center pt-1">
                  By submitting, you agree to be contacted regarding this event.
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;