import type { NextApiRequest, NextApiResponse } from 'next';
import { ContactFormData, ContactResponse } from '../../types/contact';

// In a real application, you would forward this to your backend API
// For now, we'll simulate the endpoint behavior
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Please use POST.'
    });
  }

  try {
    const formData: ContactFormData = req.body;

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Message length validation
    if (formData.message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long.'
      });
    }

   
    // Simulate successful submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

    // Check if this is a test submission
    const isTest = formData.subject.includes('[TEST]');
    
    res.status(200).json({
      success: true,
      message: isTest 
        ? 'Test submission successful. Contact endpoint is working correctly.'
        : 'Thank you for your message! We have received your inquiry and will get back to you within 24 hours.',
      data: {
        submissionId: `contact_${Date.now()}`,
        timestamp: new Date().toISOString(),
        estimatedResponseTime: '24 hours'
      }
    });

  } catch (error: any) {
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later or contact us directly.'
    });
  }
}
