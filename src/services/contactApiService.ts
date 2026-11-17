import { ContactFormData, ContactResponse } from '../types/contact';
import { submitContactForm } from './httpServices';

/**
 * Centralized API service for contact form operations
 */
export class ContactApiService {
  
  /**
   * Submit contact form data
   */
  static async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    try {
     
      // Validate form data before sending
      this.validateFormData(formData);

      const response = await submitContactForm(formData);
      
      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
        data: response
      };
    } catch (error: any) {
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to send your message. Please try again.';
      
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Please check your form data and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later or contact us directly.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Validate contact form data
   */
  private static validateFormData(formData: ContactFormData): void {
    const errors: string[] = [];

    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.email || !this.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.phone || formData.phone.trim().length < 8) {
      errors.push('Please enter a valid phone number');
    }

    if (!formData.subject || formData.subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize form data to prevent XSS
   */
  static sanitizeFormData(formData: ContactFormData): ContactFormData {
    const sanitize = (str: string): string => {
      if (!str) return '';
      return str
        .replace(/[<>]/g, '') // Remove basic HTML tags
        .trim();
    };

    // Combine country code with phone number
    const countryCode = formData.countryCode ? sanitize(formData.countryCode) : '+971';
    const phoneNumber = sanitize(formData.phone);
    const fullPhone = `${countryCode}${phoneNumber}`;

    
    return {
      name: sanitize(formData.name),
      email: sanitize(formData.email),
      phone: fullPhone,
      subject: sanitize(formData.subject),
      message: sanitize(formData.message)
    };
  }

  /**
   * Get contact form statistics (for admin use)
   */
  static async getContactStats(): Promise<{
    totalSubmissions: number;
    todaySubmissions: number;
    averageResponseTime: string;
  }> {
    // This would be implemented when we have a backend endpoint for it
    // For now, return mock data
    return {
      totalSubmissions: 0,
      todaySubmissions: 0,
      averageResponseTime: '24 hours'
    };
  }

  /**
   * Test contact form endpoint connectivity
   */
  static async testEndpoint(): Promise<{ success: boolean; message: string }> {
    try {
      // Send a test ping to check if the contact endpoint is available
      const testData: ContactFormData = {
        name: 'Test',
        email: 'test@example.com',
        phone: '+1234567890',
        subject: 'Test Connection',
        message: 'This is a test message to verify API connectivity.'
      };

      // In a real implementation, you might have a dedicated test endpoint
      // For now, we'll just test the main endpoint with a flag
      
      const response = await submitContactForm({
        ...testData,
        subject: '[TEST] ' + testData.subject // Mark as test
      });

      return {
        success: true,
        message: 'Contact endpoint is working correctly.'
      };
    } catch (error: any) {
      
      return {
        success: false,
        message: error.message || 'Contact endpoint is not responding.'
      };
    }
  }
}

export default ContactApiService;
