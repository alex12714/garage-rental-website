export interface PricingOption {
  duration: string;
  days: number;
  price: number;
  pricePerDay?: number;
  popular?: boolean;
}

export const pricingOptions: PricingOption[] = [
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
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return 0;

  // Find matching pricing option
  const matchingOption = pricingOptions.find(option => option.days === days);

  let basePrice = 0;

  if (matchingOption) {
    basePrice = matchingOption.price;
  } else {
    // Custom calculation for non-standard durations
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
  displayText: string;
} {
  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let displayText = '';
  if (days === 1) {
    displayText = '1 day';
  } else if (days === 7) {
    displayText = '1 week';
  } else if (days === 30) {
    displayText = '1 month';
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    displayText = `${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
  } else {
    displayText = `${days} day${days > 1 ? 's' : ''}`;
  }

  return {
    days,
    displayText,
  };
}
