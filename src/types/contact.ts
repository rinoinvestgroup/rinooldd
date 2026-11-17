export interface ContactFormData {
  name: string;
  email: string;
  countryCode?: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  [key: string]: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface ContactApiRequest extends ContactFormData {
  timestamp?: string;
  userAgent?: string;
  ip?: string;
}
