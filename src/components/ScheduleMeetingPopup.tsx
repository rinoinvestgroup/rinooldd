import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react';
// import { useLanguage } from '@/context/LanguageContext';
import { createGoogleMeeting } from '@/services';
import { trackMeetingSchedule } from '@/utils/googleAnalytics';

interface ScheduleMeetingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  attendeeEmail?: string;
  imageSrc?: string;
}

interface MeetingData {
  title: string;
  date: string;
  time: string;
  timezone: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}

const meetingOptions = [
  {
    id: 'investor-strategy',
    title: 'Exclusive Dubai Property Investor Strategy Session',
    duration: 15,
    description: 'In the next 15 minutes, I can show you 3-5 exclusive off-market Dubai properties with 7-10% net rental yields. But this is more than just a property viewing. So what can you expect from our private strategy session?',
    details: 'My goal is to give you the data-driven insights you need to make an informed decision, without the fluff. This session is designed to be the most productive 15 minutes you spend on your investment strategy this week.',
  },
  {
    id: 'property-viewing',
    title: 'Property Viewing Session',
    duration: 30,
    description: 'Schedule a personalized property viewing session with our expert agents.',
    details: 'We\'ll show you carefully selected properties based on your preferences and investment goals.',
  },
  {
    id: 'consultation',
    title: 'Investment Consultation',
    duration: 45,
    description: 'Comprehensive consultation about Dubai real estate investment opportunities.',
    details: 'Discuss market trends, financing options, ROI expectations, and create a customized investment plan.',
  },
];

const timeSlots = [
  '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
  '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
  '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
  '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
];

const timezones = [
  { value: 'Asia/Dubai', label: 'GMT+04:00 Asia/Dubai (GST)' },
  { value: 'Asia/Muscat', label: 'GMT+04:00 Asia/Muscat (GMT+4)' },
  { value: 'Europe/London', label: 'GMT+00:00 Europe/London (GMT)' },
  { value: 'America/New_York', label: 'GMT-05:00 America/New York (EST)' },
  { value: 'Asia/Hong_Kong', label: 'GMT+08:00 Asia/Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'GMT+08:00 Asia/Singapore (SGT)' },
];

const ScheduleMeetingPopup: React.FC<ScheduleMeetingPopupProps> = ({ isOpen, onClose, attendeeEmail = 'outreach@rinoproperties.com', imageSrc = '/images/team/kalid.png' }) => {
  // const { language } = useLanguage();
  const [step, setStep] = useState(1);
  // Set default meeting to first option
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetingOptions[0]>(meetingOptions[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [meetingData, setMeetingData] = useState<MeetingData>({
    title: meetingOptions[0].title, // Set default title
    date: '',
    time: '',
    timezone: 'Asia/Dubai',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    message: '',
  });

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleMeetingSelect = (meeting: typeof meetingOptions[0]) => {
    setSelectedMeeting(meeting);
    setMeetingData(prev => ({ ...prev, title: meeting.title }));
    trackMeetingSchedule('type_selected', meeting.title, { duration: meeting.duration });
    setStep(2);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date && !isDateDisabled(date)) {
      setMeetingData(prev => ({ ...prev, date: formatDate(date) }));
      trackMeetingSchedule('date_selected', selectedMeeting?.title, { date: formatDate(date) });
    }
  };

  const handleTimeSelect = (time: string) => {
    setMeetingData(prev => ({ ...prev, time }));
    trackMeetingSchedule('time_selected', selectedMeeting?.title, { time });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Track form submission start
    trackMeetingSchedule('submitted', selectedMeeting?.title, {
      meeting_date: meetingData.date,
      meeting_time: meetingData.time,
      meeting_duration: selectedMeeting?.duration,
      user_country: meetingData.country,
    });

    try {
      // Format date and time for API
      const [year, month, day] = meetingData.date.split('-');
      const [time, period] = meetingData.time.split(' ');
      const [hours, minutes] = time.split(':');
      
      // Convert 12-hour format to 24-hour format
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      // Create datetime string in the format expected by the API
      const startDateTime = `${year}-${month}-${day}T${hour24.toString().padStart(2, '0')}:${minutes}:00`;
      
      // Calculate end date time based on duration
      const duration = selectedMeeting?.duration || 15;
      
      // Calculate end time by adding duration in minutes
      const startHour = hour24;
      const startMinute = parseInt(minutes);
      const totalMinutes = startMinute + duration;
      const endHour = startHour + Math.floor(totalMinutes / 60);
      const endMinute = totalMinutes % 60;
      
      // Format end datetime to match start format
      const endDateTime = `${year}-${month}-${day}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;
      
      // Prepare meeting data for API
      const meetingPayload = {
        firstName: meetingData.firstName,
        lastName: meetingData.lastName,
        email: meetingData.email,
        phone: meetingData.phone,
        country: meetingData.country,
        meetingDate: meetingData.date,
        meetingTime: meetingData.time,
        duration: duration,
        additionalMessage: meetingData.message,
        summary: `${selectedMeeting?.title || 'Meeting'} with ${meetingData.firstName} ${meetingData.lastName}`,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        timeZone: meetingData.timezone,
        attendees: [attendeeEmail, meetingData.email]
      };

      const result = await createGoogleMeeting(meetingPayload);

      if (result.success) {
        setSubmitStatus('success');
        // Track successful meeting booking
        trackMeetingSchedule('success', selectedMeeting?.title, {
          meeting_date: meetingData.date,
          meeting_time: meetingData.time,
          meeting_duration: selectedMeeting?.duration,
          user_country: meetingData.country,
        });
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      } else {
        setSubmitStatus('error');
        trackMeetingSchedule('error', selectedMeeting?.title, {
          error_message: result.message,
        });
        console.error('Error scheduling meeting:', result.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      trackMeetingSchedule('error', selectedMeeting?.title, {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Error scheduling meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedMeeting(meetingOptions[0]); // Reset to first option instead of null
    setMeetingData({
      title: meetingOptions[0].title, // Reset to default title
      date: '',
      time: '',
      timezone: 'Asia/Dubai',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      message: '',
    });
    setSubmitStatus('idle');
    setCurrentMonth(new Date());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canProceedToStep3 = meetingData.date && meetingData.time;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors z-20 shadow-md border border-gray-200"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Left Sidebar - Agent/Meeting Info */}
        <div className="md:w-80 bg-white border-r border-gray-200 p-8 flex flex-col">

          {/* Agent Profile */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-100">
              <img 
                src={imageSrc} 
                alt="Agent" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23D69F3F"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          {/* Meeting Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {selectedMeeting?.title || 'Exclusive Dubai Property Investor Strategy Session'}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{selectedMeeting?.duration || 15} Mins</span>
            </div>

            {meetingData.date && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {new Date(meetingData.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            )}

            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                {selectedMeeting?.description || 
                  'In the next 15 minutes, I can show you 3-5 exclusive off-market Dubai properties with 7-10% net rental yields. But this is more than just a property viewing. So what can you expect from our private strategy session?'}
              </p>
              <p className="text-xs">
                {selectedMeeting?.details || 
                  'My goal is to give you the data-driven insights you need to make an informed decision, without the fluff. This session is designed to be the most productive 15 minutes you spend on your investment strategy this week.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col max-h-[90vh] md:max-h-none overflow-y-auto">
          {/* Step Content */}
          <div className="p-6 flex-1">
            {/* Step 1: Date & Time Selection (Always visible initially) */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                      {getDaysInMonth(currentMonth).map((date, index) => {
                        const isDisabled = isDateDisabled(date);
                        const isSelected = date && meetingData.date === formatDate(date);
                        const isToday = date && formatDate(date) === formatDate(new Date());

                        return (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            disabled={isDisabled}
                            className={`
                              aspect-square p-2 rounded-lg text-sm font-medium transition-all
                              ${!date ? 'invisible' : ''}
                              ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                              ${isSelected ? 'bg-black text-white hover:bg-gray-800' : ''}
                              ${isToday && !isSelected ? 'border-2 border-gray-300' : ''}
                              ${!isDisabled && !isSelected ? 'text-gray-900' : ''}
                            `}
                          >
                            {date?.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    {/* Timezone selector */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time zone
                      </label>
                      <select
                        name="timezone"
                        value={meetingData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            🌐 {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {meetingData.date ? (
                        timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`
                              w-full px-4 py-3 rounded-lg border text-center font-medium transition-all
                              ${
                                meetingData.time === time
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 hover:border-black hover:bg-gray-50'
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>Please select a date to see available time slots</p>
                        </div>
                      )}
                    </div>

                    {/* Continue button */}
                    {canProceedToStep3 && (
                      <button
                        onClick={() => setStep(2)}
                        className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Details</h2>
                <p className="text-gray-600 mb-6">We'll send you a confirmation email with the meeting link</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={meetingData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={meetingData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={meetingData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={meetingData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={meetingData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="United Arab Emirates"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={meetingData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your requirements or questions..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-medium">
                      Meeting scheduled successfully! Check your email for the Google Meet link.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">
                      Failed to schedule meeting. Please try again or contact us directly.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 inline mr-1" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      flex-1 px-6 py-3 rounded-lg font-semibold transition-colors
                      ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }
                      text-white
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                      </>
                    ) : (
                      'Schedule Meeting'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingPopup;
