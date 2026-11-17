import { apiClient } from './httpServices';

// Interface for property inquiry data matching the backend schema
export interface PropertyInquiryData {
  name: string;
  email: string;
  phone: string;
  property_id: string;
  property_link: string;
  message: string;
}

/**
 * POST /property-inquiry - Submit property inquiry form
 */
export const sendInquire = async (inquireData: PropertyInquiryData) => {
  try {
    // Ensure all required fields are present and not empty
    const sanitizedInquireData = {
      name: inquireData.name?.trim() || '',
      email: inquireData.email?.trim() || '',
      phone: inquireData.phone?.trim() || '',
      property_id: inquireData.property_id?.trim() || '',
      property_link: inquireData.property_link?.trim() || '',
      message: inquireData.message?.trim() || '',
      timestamp: new Date().toISOString(),
    };

    // Validate required fields before sending
    const requiredFields = ['name', 'email', 'phone', 'property_id', 'property_link', 'message'];
    const missingFields = requiredFields.filter(field => !sanitizedInquireData[field as keyof typeof sanitizedInquireData]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await apiClient.post('/property-inquiry', sanitizedInquireData);
    
    return response.data;
  } catch (error: any) {
  
    throw new Error(error.response?.data?.message || 'Failed to send property inquiry');
  }
};

export default {
  sendInquire
};
