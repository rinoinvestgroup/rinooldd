# Meeting Scheduler - Quick Start Guide

Get your meeting scheduling system up and running in 15 minutes!

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies ✅ (Already Done)

The required packages have been installed:
- `googleapis` - For Google Calendar API
- `nodemailer` - For sending emails
- `@types/nodemailer` - TypeScript types

### Step 2: Set Up Google Calendar API (10 minutes)

Follow the detailed guide in [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)

**Quick version:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Get refresh token from [OAuth Playground](https://developers.google.com/oauthplayground/)

### Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Google Calendar API
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=your_refresh_token_here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Company Settings
COMPANY_AGENT_EMAIL=agent@rinoestates.com
```

### Step 4: Add to Your Page (2 minutes)

Example: Add to homepage

```tsx
// src/pages/index.tsx
import { useState } from 'react';
import ScheduleMeetingPopup from '@/components/ScheduleMeetingPopup';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Schedule a Meeting
      </button>

      <ScheduleMeetingPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
```

### Step 5: Test It!

```bash
npm run dev
```

1. Open http://localhost:3000
2. Click "Schedule a Meeting"
3. Fill out the form
4. Check your Google Calendar for the event
5. Check your email for the confirmation

## ✅ What's Included

### Components
- **ScheduleMeetingPopup.tsx** - Main scheduling form with 3 steps
  - Step 1: Select meeting type
  - Step 2: Choose date & time
  - Step 3: Enter contact details

### API Endpoints
- **schedule-meeting.ts** - Handles meeting creation
  - Creates Google Calendar event
  - Generates Google Meet link
  - Sends confirmation emails
  - Handles timezones

### Documentation
- **GOOGLE_CALENDAR_SETUP.md** - Complete setup instructions
- **MEETING_SCHEDULER_USAGE.md** - Detailed usage guide
- **IMPLEMENTATION_EXAMPLES.md** - Multiple implementation examples
- **QUICK_START.md** - This file!

### Features
✨ Multi-step form with progress indicator
📅 Interactive calendar with date selection
⏰ Time slot selection (customizable)
🌍 Multiple timezone support
📧 Automated email notifications
🔗 Automatic Google Meet link generation
📱 Fully responsive design
♿ Accessible (WCAG AA)
🎨 Beautiful UI with Tailwind CSS
🔒 Secure with input validation

## 🎯 Common Use Cases

### 1. Hero Section CTA
```tsx
<button 
  onClick={() => setIsOpen(true)}
  className="bg-blue-600 text-white px-8 py-4 rounded-lg"
>
  📅 Schedule Free Consultation
</button>
```

### 2. Property Detail Page
```tsx
<button onClick={() => setIsOpen(true)}>
  Schedule Property Viewing
</button>
```

### 3. Floating Action Button
```tsx
<button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full">
  <Calendar />
</button>
```

## 🎨 Customization

### Change Meeting Options

Edit [ScheduleMeetingPopup.tsx](src/components/ScheduleMeetingPopup.tsx#L18):

```tsx
const meetingOptions = [
  {
    id: 'consultation',
    title: 'Investment Consultation',
    duration: 30,
    description: 'Discuss your investment goals',
    details: 'One-on-one consultation with our experts',
  },
];
```

### Change Time Slots

```tsx
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];
```

### Change Colors

Replace `blue` with your brand color:
```tsx
'bg-blue-600' → 'bg-brand-600'
'text-blue-600' → 'text-brand-600'
```

## 🐛 Troubleshooting

### Issue: "Invalid credentials" error
**Solution:** Check that your Google OAuth credentials are correct in `.env.local`

### Issue: Emails not sending
**Solution:** 
1. Verify Gmail app password is correct
2. Enable 2-Step Verification in Google Account
3. Check spam folder

### Issue: No Google Meet link
**Solution:** Ensure `conferenceDataVersion: 1` is set in the API call

### Issue: Times not showing
**Solution:** Select a date first - times only appear after date selection

## 📊 Testing Checklist

- [ ] Environment variables are set
- [ ] Development server is running
- [ ] Can open the popup
- [ ] Can select a meeting type
- [ ] Can select a date (past dates are disabled)
- [ ] Can select a time slot
- [ ] Can fill in contact details
- [ ] Form validates required fields
- [ ] Submission shows loading state
- [ ] Success message appears
- [ ] Calendar event is created
- [ ] Client receives email
- [ ] Agent receives email
- [ ] Google Meet link works
- [ ] Timezone is correct

## 🚀 Next Steps

1. **Customize the meeting options** to match your business
2. **Add analytics tracking** to measure conversions
3. **Customize email templates** with your branding
4. **Add to multiple pages** for maximum visibility
5. **Test thoroughly** before going live
6. **Monitor usage** and optimize based on data

## 📚 Additional Resources

- [Full Usage Guide](MEETING_SCHEDULER_USAGE.md)
- [Setup Instructions](GOOGLE_CALENDAR_SETUP.md)
- [Implementation Examples](IMPLEMENTATION_EXAMPLES.md)
- [Google Calendar API Docs](https://developers.google.com/calendar)
- [Nodemailer Docs](https://nodemailer.com/)

## 💡 Pro Tips

1. **Use environment-specific emails**
   - Development: Use your personal email
   - Production: Use company email

2. **Test with different timezones**
   - Ensure times convert correctly
   - Test with international clients

3. **Monitor API quotas**
   - Google Calendar API has limits
   - Add error handling for quota exceeded

4. **Set up monitoring**
   - Track successful bookings
   - Get alerted on failures
   - Monitor email deliverability

5. **Backup strategy**
   - Keep alternative contact methods visible
   - Have a fallback form if API fails
   - Provide phone number for urgent requests

## 🎉 You're Ready!

Your meeting scheduler is now ready to use. Start accepting bookings and grow your business!

Need help? Check the documentation files or review the troubleshooting section above.

**Happy Scheduling! 📅**
