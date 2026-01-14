# Product Requirements Document (PRD)
## Garage Rental Website - Hourly Booking Platform

**Version:** 1.0
**Last Updated:** January 14, 2026
**Status:** Development Ready

---

## 1. Executive Summary

### 1.1 Product Overview
A single-page web application for hourly garage rental services in Riga, Latvia. The platform enables users to book garage space by the hour with instant online payment, similar to Airbnb's booking experience.

### 1.2 Business Objectives
- Provide 24/7 online booking capability
- Automate rental process from booking to payment
- Support international and local customers (LV/EN/RU)
- Minimize administrative overhead through automation
- Maximize garage utilization through flexible hourly pricing

### 1.3 Target Audience
- Car enthusiasts and mechanics
- Professional service providers (detailing, repairs)
- Vehicle owners needing temporary workspace
- International residents in Latvia
- Local and Russian-speaking communities

---

## 2. Product Specifications

### 2.1 Core Features

#### Feature 1: Multi-Language Support
- **Languages:** Latvian (LV), English (EN), Russian (RU)
- **Implementation:** i18next with language switcher
- **Scope:** All text content, error messages, emails
- **Priority:** P0 (Must Have)

#### Feature 2: Hourly Booking System
- **Booking Calendar:** Embedded iframe calendar widget
- **Time Selection:** Start time and end time picker
- **Duration Options:**
  - 1 hour: €25
  - 3 hours: €35
  - Full day (8 hours): €60
  - 3 days: €150
  - 1 week: €300
  - 2 weeks: €500
  - 1 month: €800
- **Custom Duration:** Calculate price for any time range
- **Priority:** P0 (Must Have)

#### Feature 3: Stripe Payment Integration
- **Payment Methods:** Card, Apple Pay, Google Pay
- **Currency:** EUR
- **API Key:** [REDACTED]
- **Checkout Flow:** Stripe Checkout (hosted)
- **Priority:** P0 (Must Have)

#### Feature 4: Location & Access Information
- **Address:** Krustpils 31, Plavnieki, Riga, Latvia
- **Google Maps:** Embedded map with API key
- **Access Details:** Sent via email after payment
- **Priority:** P0 (Must Have)

#### Feature 5: Webhook Integration
- **Endpoint:** [REDACTED]
- **Trigger:** All new bookings
- **Data:** Contact info, booking details, payment status
- **Priority:** P0 (Must Have)

---

## 3. Technical Specifications

### 3.1 Technology Stack
- **Frontend:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **i18n:** i18next, react-i18next
- **Payment:** Stripe API
- **Maps:** Google Maps JavaScript API
- **Calendar:** Embedded iframe widget

### 3.2 API Keys & Credentials
```plaintext
Stripe API Key: [REDACTED]
Google Maps API Key: [REDACTED]
Webhook URL: [REDACTED]
```

### 3.3 Calendar Embed Code
```html
<iframe src="https://api.leadconnectorhq.com/widget/booking/gr4HovtFVrqmDY65IULM"
  style="width: 100%;border:none;overflow: hidden;"
  scrolling="no"
  id="gr4HovtFVrqmDY65IULM_1768386280323">
</iframe>
<script src="https://api.leadconnectorhq.com/js/form_embed.js" type="text/javascript"></script>
```

---

## 4. User Experience Design

### 4.1 Page Structure (Single Page)

#### Section 1: Navigation Bar (Sticky)
- **Left:** Logo/Brand name
- **Right:** Language switcher (LV | EN | RU)
- **CTA:** "Book Now" button (scrolls to calendar)

#### Section 2: Hero Section
- **Headline (dynamic):**
  - LV: "Garāžas noma pa stundām Rīgā"
  - EN: "Hourly Garage Rental in Riga"
  - RU: "Почасовая аренда гаража в Риге"
- **Subheadline:** "Rent a secure, heated garage with electricity by the hour — simple online booking"
- **Key Highlights:**
  - 📍 Plavnieki, Riga
  - 🕒 Hourly pricing from €25
  - 🔒 Secure access
  - ⚡ 3A electricity available
  - 🌡️ Heated space
  - 💳 Online payment (Stripe)
- **CTA:** "Check Availability" (scroll to calendar)

#### Section 3: How It Works (3 Steps)
1. Choose date & time in calendar
2. Enter contact details
3. Pay securely & receive confirmation

#### Section 4: Garage Details
- **Photos:** 2 garage images (interior/entrance)
- **Specifications:**
  - Size: 3m × 6m (18 m²)
  - Gate Height: 2m
  - Electricity: 3A available
  - Heating: Yes
  - Location: Krustpils 31, Plavnieki, Riga
  - Max Vehicle Size: Suitable for standard cars
  - Security: Secure access
  - Access Hours: 24/7 (after booking confirmation)

#### Section 5: Pricing Section
```
⏱️ 1 hour      →  €25
⏱️ 3 hours     →  €35  (Save €10)
⏱️ Full day    →  €60  (8 hours)
⏱️ 3 days      →  €150
⏱️ 1 week      →  €300
⏱️ 2 weeks     →  €500
⏱️ 1 month     →  €800

Custom duration: Calculate based on hours
Prices include VAT
```

#### Section 6: Booking Calendar (Core Section)
- **Calendar Widget:** Embedded iframe
- **Custom Booking Form:**
  - Date picker
  - Start time
  - End time
  - Price auto-calculation
  - Contact details (name, email, phone)
- **CTA:** "Book & Pay with Stripe"

#### Section 7: Stripe Checkout
- Hosted checkout page
- Payment confirmation
- Email confirmation (multi-language)
- Booking details sent to webhook

#### Section 8: Location & Access
- **Google Maps Embed**
- **Address:** Krustpils 31, Plavnieki, Riga, Latvia
- **Access Instructions:** "Gate code and detailed access instructions will be sent to your email after payment confirmation"

#### Section 9: Testimonials
- 3-5 customer testimonials
- Name, rating (5 stars), review text
- Mix of languages (LV/EN/RU)

#### Section 10: Trust & Safety
- ✅ Secure payment by Stripe
- ✅ No hidden fees
- ✅ Flexible cancellation policy
- ✅ 24/7 customer support
- ✅ Used by professionals & car enthusiasts

#### Section 11: FAQ (Accordion)
- Can I cancel my booking?
- What if I'm late?
- Can I extend my time?
- What vehicles fit in the garage?
- Is electricity included?
- Is the space heated?
- How do I access the garage?
- Are tools available?

#### Section 12: Footer
- Company name
- Contact email
- Phone number
- Terms & Conditions
- Privacy Policy
- Language switcher (repeat)

---

## 5. Functional Requirements

### 5.1 Booking Flow
```
User Action                     System Response
────────────────────────────────────────────────────
1. Select date                → Show available times
2. Select start/end time      → Calculate price
3. Enter contact details      → Validate form
4. Click "Book & Pay"         → Redirect to Stripe
5. Complete payment           → Process payment
6. Payment success            → Send webhook
                              → Send confirmation email
                              → Lock calendar slot
                              → Display success page
```

### 5.2 Price Calculation Logic
```javascript
function calculatePrice(startTime, endTime) {
  const hours = (endTime - startTime) / (1000 * 60 * 60);

  if (hours <= 1) return 25;
  if (hours <= 3) return 35;
  if (hours <= 8) return 60;
  if (hours <= 72) return 150;       // 3 days
  if (hours <= 168) return 300;      // 1 week
  if (hours <= 336) return 500;      // 2 weeks
  if (hours <= 720) return 800;      // 1 month

  // Custom calculation: €5/hour after optimized brackets
  return Math.ceil(hours * 5);
}
```

### 5.3 Webhook Payload
```json
{
  "booking_id": "unique_id",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "start_time": "ISO8601",
  "end_time": "ISO8601",
  "duration_hours": "number",
  "total_price": "number",
  "payment_status": "succeeded",
  "language": "lv|en|ru",
  "created_at": "ISO8601"
}
```

### 5.4 Email Confirmation
- **Trigger:** Stripe payment success
- **Language:** Based on user selection
- **Content:**
  - Booking confirmation number
  - Date and time
  - Duration and price
  - Access code/instructions
  - Contact information
  - Cancellation policy link

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: < 3 seconds
- Mobile responsive: All screen sizes
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

### 6.2 Security
- HTTPS only
- Stripe PCI compliance
- No credit card data stored locally
- Environment variables for API keys
- CSRF protection

### 6.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatible
- High contrast mode support

### 6.4 SEO & Analytics
- Meta tags for each language
- Open Graph tags
- Structured data (schema.org)
- Google Analytics integration (future)

---

## 7. Content Requirements

### 7.1 Images
- 2 high-quality garage photos (interior and entrance)
- Optimized for web (WebP format, < 500KB each)
- Alt text in all 3 languages

### 7.2 Copy Tone
- Professional yet friendly
- Clear and concise
- Benefit-focused
- Trust-building

### 7.3 Testimonials (Sample)
```
Testimonial 1 (EN):
"Perfect space for detailing work. Clean, heated, and easy access. Booked for 6 hours, extended by 2 — seamless process!"
— Martins K., Car Detailer

Testimonial 2 (RU):
"Отличный гараж для ремонта. Удобная оплата онлайн, все как обещали. Буду бронировать еще!"
— Dmitrijs P., Mechanic

Testimonial 3 (LV):
"Ideāla vieta auto remontam. Silta, ar elektrību, pieejama 24/7. Ieteicu!"
— Anita R., Car Owner
```

---

## 8. Milestones & Timeline

### Phase 1: MVP (Week 1)
- ✅ Single garage setup
- ✅ Hourly booking system
- ✅ Stripe payment integration
- ✅ Email confirmation
- ✅ 3 languages (LV/EN/RU)

### Phase 2: Enhancement (Week 2)
- ⏳ Testimonials section
- ⏳ FAQ accordion
- ⏳ Google Maps integration
- ⏳ Mobile optimization
- ⏳ SEO optimization

### Phase 3: Future (Month 2+)
- 🔮 Multiple garages support
- 🔮 User accounts
- 🔮 Subscription packages
- 🔮 Dynamic pricing based on demand
- 🔮 SMS notifications
- 🔮 Review system

---

## 9. Success Metrics (KPIs)

### 9.1 Launch Metrics
- 95%+ uptime
- < 3s page load time
- 0 critical bugs
- All payment transactions successful

### 9.2 Business Metrics (Month 1)
- 50+ bookings
- 70%+ utilization rate
- 90%+ payment success rate
- < 5% cancellation rate

### 9.3 User Experience Metrics
- 80%+ mobile traffic
- 60%+ conversion rate (visit → booking)
- 4.5+ average rating (future reviews)

---

## 10. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Calendar widget downtime | High | Low | Fallback to manual booking form |
| Stripe payment failure | High | Low | Error handling + support contact |
| Language translation errors | Medium | Medium | Native speaker review |
| Overbooking conflicts | High | Low | Real-time calendar lock |
| Mobile UX issues | Medium | Medium | Extensive mobile testing |

---

## 11. Acceptance Criteria

### 11.1 Functional Acceptance
- [ ] User can select date and time
- [ ] Price calculates correctly for all durations
- [ ] Stripe checkout completes successfully
- [ ] Confirmation email sent in correct language
- [ ] Webhook receives booking data
- [ ] Calendar updates to show booked slot
- [ ] All 3 languages work correctly
- [ ] Google Maps displays location
- [ ] Mobile responsive on iOS and Android

### 11.2 Quality Acceptance
- [ ] No console errors
- [ ] No broken links
- [ ] All images load properly
- [ ] Forms validate correctly
- [ ] Error messages are helpful
- [ ] Loading states are clear

---

## 12. Support & Maintenance

### 12.1 Customer Support
- Email: [to be provided]
- Phone: [to be provided]
- Response time: < 24 hours
- Support hours: 9:00-18:00 EET (Mon-Fri)

### 12.2 Technical Maintenance
- Weekly: Monitor booking system
- Monthly: Review analytics and metrics
- Quarterly: Security updates and dependency upgrades
- Annually: Feature enhancements and user feedback integration

---

## 13. Legal & Compliance

### 13.1 Required Policies
- Terms & Conditions
- Privacy Policy (GDPR compliant)
- Cancellation Policy
- Cookie Policy

### 13.2 Business Registration
- Company registration in Latvia
- VAT registration (if applicable)
- Insurance coverage for rental space

---

## 14. Appendix

### 14.1 Technical Architecture
```
┌─────────────────────────────────────────┐
│         User Browser (Frontend)         │
│  Next.js 14 + React + Tailwind + i18n  │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────┐
│ Stripe  │  │ Google  │  │ Booking  │
│   API   │  │  Maps   │  │ Calendar │
└────┬────┘  └─────────┘  └──────────┘
     │
     ▼
┌──────────────┐
│   Webhook    │
│ (Make.com)   │
└──────────────┘
```

### 14.2 Environment Variables
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=rk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBuhdQHrF4713cD...
WEBHOOK_URL=https://hook.eu1.make.com/wjoytd8mobl...
```

### 14.3 Folder Structure
```
garage-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       ├── checkout/route.ts
│       └── webhook/route.ts
├── components/
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── GarageDetails.tsx
│   ├── Pricing.tsx
│   ├── BookingCalendar.tsx
│   ├── LocationMap.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── i18n.ts
│   ├── stripe.ts
│   └── pricing.ts
├── locales/
│   ├── lv.json
│   ├── en.json
│   └── ru.json
├── public/
│   └── images/
│       ├── garage-1.jpg
│       └── garage-2.jpg
└── styles/
    └── globals.css
```

---

**Document Owner:** Development Team
**Stakeholders:** Business Owner, Marketing Team
**Next Review:** Post-MVP Launch
