# Garage Rental Website - Riga, Latvia

A modern, single-page web application for hourly garage rental services with multi-language support (LV/EN/RU), Stripe payment integration, and Google Maps location display.

## 🚀 Features

- **Multi-Language Support**: Latvian, English, and Russian
- **Hourly Booking System**: Flexible booking from 1 hour to 1 month
- **Benefits Section**: Highlights key advantages (no contracts, 24/7 access, instant booking)
- **Stripe Payment Integration**: Secure online payments
- **Embedded Calendar**: Real-time availability checking
- **Google Maps Integration**: Interactive location display
- **Webhook Integration**: Automated booking notifications
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Built with Tailwind CSS

## 📋 Requirements

- Node.js 18+ and npm
- Stripe account (live API keys)
- Google Maps API key
- Make.com webhook endpoint (or similar)

## 🛠️ Installation

1. **Clone or navigate to the project directory**:
```bash
cd garage-website
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment variables are already set in `.env.local`**:
   - Stripe API keys
   - Google Maps API key
   - Webhook URL

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
garage-website/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts       # Stripe checkout endpoint
│   │   └── webhook/route.ts        # Stripe webhook handler
│   ├── success/page.tsx            # Payment success page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── Navigation.tsx              # Top navigation bar
│   ├── Hero.tsx                    # Hero section
│   ├── HowItWorks.tsx             # 3-step process
│   ├── Benefits.tsx               # Why choose us section
│   ├── GarageDetails.tsx          # Garage specifications
│   ├── Pricing.tsx                # Pricing options
│   ├── BookingCalendar.tsx        # Booking system
│   ├── LocationMap.tsx            # Google Maps
│   ├── Testimonials.tsx           # Customer reviews
│   ├── Trust.tsx                  # Trust badges
│   ├── FAQ.tsx                    # FAQ accordion
│   ├── Footer.tsx                 # Footer
│   └── LanguageSwitcher.tsx       # Language selector
├── lib/
│   ├── i18n.ts                    # i18n configuration
│   ├── pricing.ts                 # Pricing calculation logic
│   └── stripe.ts                  # Stripe integration
├── locales/
│   ├── en.json                    # English translations
│   ├── lv.json                    # Latvian translations
│   └── ru.json                    # Russian translations
├── public/
│   └── images/                    # Image assets
├── styles/
│   └── globals.css                # Global styles
├── .env.local                     # Environment variables
├── PRD.md                         # Product Requirements Document
└── README.md                      # This file
```

## 🎨 Adding Garage Images

To add real garage images:

1. Place your images in `public/images/`:
   - `garage-1.jpg` - Interior/main view
   - `garage-2.jpg` - Entrance/secondary view

2. Images will automatically be displayed in the Garage Details section

## 💳 Stripe Configuration

### Testing Payments

Use Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

### Webhook Setup

For Stripe webhooks to work in production:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret
5. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## 🌍 Language Support

The website automatically detects the browser language and defaults to:
- Latvian (LV) - default
- English (EN) - fallback
- Russian (RU)

Users can switch languages using the language switcher in the navigation.

## 📊 Pricing Structure

Current pricing (configured in `lib/pricing.ts`):

| Duration | Hours | Price | Savings |
|----------|-------|-------|---------|
| 1 hour   | 1     | €25   | -       |
| 3 hours  | 3     | €35   | €40     |
| Full day | 8     | €60   | €140    |
| 3 days   | 72    | €150  | €210    |
| 1 week   | 168   | €300  | €540    |
| 2 weeks  | 336   | €500  | €1,180  |
| 1 month  | 720   | €800  | €2,800  |

Custom durations are calculated dynamically.

## 🔗 Webhook Integration

All bookings are sent to the configured webhook URL with the following data:

```json
{
  "booking_id": "session_id",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+371 20000000",
  "special_requests": "Need extension cord",
  "start_time": "2026-01-15T10:00:00.000Z",
  "end_time": "2026-01-15T18:00:00.000Z",
  "duration_hours": 8,
  "total_price": 60,
  "payment_status": "succeeded",
  "language": "lv",
  "created_at": "2026-01-14T12:00:00.000Z",
  "stripe_session_id": "cs_..."
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 📱 Mobile Optimization

The website is fully responsive:
- Mobile-first design approach
- Touch-friendly navigation
- Optimized calendar display
- Fast loading times

## 🔒 Security Features

- HTTPS only (configured in production)
- Stripe PCI compliance
- No credit card data stored
- Environment variables for sensitive data
- CSRF protection (built-in Next.js)

## 📈 Analytics Integration

To add Google Analytics:

1. Add GA tracking code to `app/layout.tsx`
2. Track booking events in `components/BookingCalendar.tsx`

## 🐛 Troubleshooting

### Calendar not loading
- Check iframe embed code is correct
- Verify network connectivity
- Check browser console for errors

### Stripe payments failing
- Verify API keys are correct (live keys start with `pk_live_` and `sk_live_`)
- Check Stripe Dashboard for errors
- Ensure test mode is disabled in production

### Map not displaying
- Verify Google Maps API key is active
- Check API key has Maps JavaScript API enabled
- Check browser console for errors

## 📝 To-Do / Future Enhancements

- [ ] Add email confirmation system
- [ ] Implement SMS notifications
- [ ] Add user accounts and booking history
- [ ] Support for multiple garages
- [ ] Dynamic pricing based on demand
- [ ] Review system
- [ ] Admin dashboard

## 📞 Support

For support or questions:
- Email: info@garagerental.lv
- Phone: +371 2000 0000

## 📄 License

Private project - All rights reserved

---

**Built with**: Next.js 14, React, TypeScript, Tailwind CSS, Stripe, Google Maps API

**Last Updated**: January 14, 2026
