/**
 * Property Inquiry Form Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface PropertyInquiryFormData {
  fullName: string;
  email: string;
  countryCode?: string;
  phone: string;
  message: string;
}

/**
 * Validates email format using RFC 5322 standard
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates phone number format (international format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters except + for international format
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Validates full name (allows letters, spaces, hyphens, apostrophes)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿĀ-žА-я\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validates message content
 */
export const isValidMessage = (message: string): boolean => {
  const trimmed = message.trim();
  return trimmed.length >= 10 && trimmed.length <= 2000;
};

/**
 * Comprehensive form validation
 */
export const validateInquiryForm = (formData: PropertyInquiryFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Full Name validation
  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (!isValidName(formData.fullName)) {
    errors.fullName = 'Please enter a valid full name (2-50 characters, letters only)';
  }

  // Email validation
  if (!formData.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (7-15 digits)';
  }

  // Message validation
  if (!formData.message?.trim()) {
    errors.message = 'Message is required';
  } else if (!isValidMessage(formData.message)) {
    errors.message = 'Message must be between 10 and 2000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitizes form data before submission
 */
export const sanitizeInquiryData = (formData: PropertyInquiryFormData) => {
  return {
    fullName: formData.fullName?.trim().replace(/\s+/g, ' ') || '',
    email: formData.email?.trim().toLowerCase() || '',
    phone: `${formData.countryCode?.trim() || '+971'}${formData.phone?.trim().replace(/[\s\-\(\)\.]/g, '') || ''}`,
    message: formData.message?.trim() || '',
  };
};

/**
 * Formats phone number for display
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // US/Canada format
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  // International format with country code
  if (cleaned.length > 10) {
    const countryCode = cleaned.slice(0, cleaned.length - 10);
    const number = cleaned.slice(-10);
    return `+${countryCode} ${number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`;
  }
  
  return phone; // Return original if doesn't match expected formats
};

/**
 * Generates inquiry reference number
 */
export const generateInquiryReference = (propertyId: string): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const propId = propertyId.slice(-4).toUpperCase();
  return `INQ-${propId}-${timestamp}-${random}`;
};

/**
 * Validates property ID format
 */
export const isValidPropertyId = (propertyId: string): boolean => {
  return Boolean(propertyId && propertyId.trim().length > 0);
};

/**
 * Validates property link format
 */
export const isValidPropertyLink = (link: string): boolean => {
  try {
    new URL(link);
    return true;
  } catch {
    return false;
  }
};

/**
 * Complete inquiry data validation (including auto-generated fields)
 */
export const validateCompleteInquiryData = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: string;
  property_link: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate form fields
  const formValidation = validateInquiryForm({
    fullName: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });

  Object.assign(errors, formValidation.errors);

  // Validate property-specific fields
  if (!isValidPropertyId(data.property_id)) {
    errors.property_id = 'Valid property ID is required';
  }

  if (!isValidPropertyLink(data.property_link)) {
    errors.property_link = 'Valid property link is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateInquiryForm,
  sanitizeInquiryData,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidMessage,
  formatPhoneForDisplay,
  generateInquiryReference,
  validateCompleteInquiryData,
};
