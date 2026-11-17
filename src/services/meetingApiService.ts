import { apiClient } from './httpServices';

/**
 * Interface for meeting request data
 */
export interface MeetingRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  meetingDate: string;
  meetingTime: string;
  duration: number;
  additionalMessage?: string;
  summary: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees?: string[];
}

/**
 * Interface for meeting response
 */
export interface MeetingResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Centralized API service for meeting operations
 */
export class MeetingApiService {
  
  /**
   * Create a Google Meet meeting
   */
  static async createMeeting(meetingData: MeetingRequest): Promise<MeetingResponse> {
    try {
      // Validate meeting data before sending
      this.validateMeetingData(meetingData);

      const response = await apiClient.post('/google-meet/create', meetingData);
      
      return {
        success: true,
        message: 'Meeting created successfully.',
        data: response.data
      };
    } catch (error: any) {
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to create meeting. Please try again.';
      
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Please check your meeting data and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
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
   * Validate meeting data
   */
  private static validateMeetingData(data: MeetingRequest): void {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.phone?.trim()) {
      errors.push('Phone is required');
    }

    if (!data.country?.trim()) {
      errors.push('Country is required');
    }

    if (!data.meetingDate) {
      errors.push('Meeting date is required');
    }

    if (!data.meetingTime) {
      errors.push('Meeting time is required');
    }

    if (!data.duration || data.duration <= 0) {
      errors.push('Valid duration is required');
    }

    if (!data.summary?.trim()) {
      errors.push('Meeting summary is required');
    }

    if (!data.startDateTime) {
      errors.push('Start date time is required');
    }

    if (!data.endDateTime) {
      errors.push('End date time is required');
    }

    if (!data.timeZone?.trim()) {
      errors.push('Time zone is required');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Email validation helper
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Convenience function to create a meeting
 */
export const createGoogleMeeting = async (meetingData: MeetingRequest): Promise<MeetingResponse> => {
  return MeetingApiService.createMeeting(meetingData);
};
