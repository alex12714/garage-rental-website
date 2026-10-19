export interface PricingOption {
  duration: string;
  days?: number;
  hours?: number;
  price: number;
  pricePerHour?: number;
  pricePerDay?: number;
  popular?: boolean;
}

export const pricingOptions: PricingOption[] = [
  {
    duration: '1hour',
    hours: 1,
    price: 10,
    pricePerHour: 10,
  },
  {
    duration: '3hours',
    hours: 3,
    price: 25,
    pricePerHour: 8.33,
  },
  {
    duration: '1day',
    days: 1,
    price: 35,
    pricePerDay: 35,
  },
  {
    duration: '3days',
    days: 3,
    price: 50,
    pricePerDay: 16.67,
    popular: true,
  },
  {
    duration: '1week',
    days: 7,
    price: 70,
    pricePerDay: 10,
  },
  {
    duration: '1month',
    days: 30,
    price: 150,
    pricePerDay: 5,
  },
];

export function calculatePrice(
  startDate: Date,
  endDate: Date,
  locationId: string = 'riga'
): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) return 0;

  let basePrice = 0;

  // Check for hourly bookings (less than 24 hours)
  if (diffHours <= 24) {
    if (diffHours <= 1) {
      basePrice = 10; // 1 hour
    } else if (diffHours <= 3) {
      basePrice = 25; // 3 hours
    } else if (diffHours <= 6) {
      basePrice = 30; // up to 6 hours
    } else {
      basePrice = 35; // full day
    }
  } else {
    // Daily bookings
    if (days === 1) basePrice = 35;
    else if (days <= 3) basePrice = 50;
    else if (days <= 7) basePrice = 70;
    else if (days <= 30) basePrice = 150;
    else {
      // For very long durations, calculate based on monthly rate
      const months = Math.ceil(days / 30);
      basePrice = months * 150;
    }
  }

  // Location 3 (Pinki) is premium - double the price
  const multiplier = locationId === 'pinki' ? 2 : 1;

  return basePrice * multiplier;
}

export function calculateDuration(startDate: Date, endDate: Date): {
  days: number;
  hours: number;
  displayText: string;
} {
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalHours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(totalHours / 24);
  const hours = Math.round(totalHours % 24);

  let displayText = '';
  
  if (totalHours < 24) {
    // Show only hours for bookings less than a day
    const roundedHours = Math.round(totalHours);
    if (roundedHours === 1) {
      displayText = '1 hour';
    } else {
      displayText = `${roundedHours} hours`;
    }
  } else if (days === 1 && hours === 0) {
    displayText = '1 day';
  } else if (days === 7 && hours === 0) {
    displayText = '1 week';
  } else if (days === 30 && hours === 0) {
    displayText = '1 month';
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    displayText = `${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
  } else if (hours > 0) {
    displayText = `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    displayText = `${days} day${days > 1 ? 's' : ''}`;
  }

  return {
    days: Math.ceil(totalHours / 24),
    hours: Math.round(totalHours),
    displayText,
  };
}
