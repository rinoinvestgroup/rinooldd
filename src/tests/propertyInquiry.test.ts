/**
 * Test file for Property Inquiry API Integration
 * This file can be used to test the property inquiry functionality
 */

import { sendInquire, PropertyInquiryData } from '../services/inquireApiService';

// Mock data for testing
const mockInquiryData: PropertyInquiryData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  property_id: 'test_property_123',
  property_link: 'http://localhost:3000/properties/test-property',
  message: 'I am interested in this property. Please contact me for more information.',
};

// Function to test the API integration
export const testPropertyInquiry = async () => {
  try {
    const result = await sendInquire(mockInquiryData);
    
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Validation test
export const testInquiryValidation = async () => {
  try {
    
    // Test with missing required fields
    const invalidData = {
      name: '',
      email: 'invalid-email',
      phone: '',
      property_id: '',
      property_link: '',
      message: '',
    } as PropertyInquiryData;
    
    await sendInquire(invalidData);
    return { success: false, error: 'Validation should have failed' };
  } catch (error: any) {
    return { success: true, result: 'Validation working correctly' };
  }
};

// Export for use in development/testing
export default {
  testPropertyInquiry,
  testInquiryValidation,
  mockInquiryData,
};
