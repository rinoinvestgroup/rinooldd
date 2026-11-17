// API Services
export { default as api } from './api';
export { default as httpServices } from './httpServices';

// Properties Services
export { default as PropertiesApiService } from './propertiesApiService';

// Blog Services
export { default as BlogApiService } from './blogApiService';

// Contact Services
export { default as ContactApiService } from './contactApiService';

// Meeting Services
export { MeetingApiService, createGoogleMeeting } from './meetingApiService';
export type { MeetingRequest, MeetingResponse } from './meetingApiService';


// HTTP Services - Properties
export {
  getAllProperties,
  searchProperties,
  getFilteredProperties,
  getPropertiesByCategory,
  getPropertyById,
  getPropertyBySlug,
  getBuyProperties,
  getRentProperties,
  sendPropertyInquiry,
  transformApiProperty
} from './httpServices';

// HTTP Services - Blogs
export {
  getAllBlogs,
  searchBlogs,
  getBlogCategories,
  getBlogById,
  getBlogBySlug,
  transformApiBlog
} from './httpServices';

// HTTP Services - Contact
export {
  submitContactForm
} from './httpServices';