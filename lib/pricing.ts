export interface PricingOption {
  duration: string;
  hours: number;
  price: number;
  savings?: number;
  popular?: boolean;
}

export const pricingOptions: PricingOption[] = [
  {
    duration: '1hour',
    hours: 1,
    price: 25,
  },
  {
    duration: '3hours',
    hours: 3,
    price: 35,
    savings: 40,
    popular: true,
  },
  {
    duration: 'fullDay',
    hours: 8,
    price: 60,
    savings: 140,
  },
  {
    duration: '3days',
    hours: 72,
    price: 150,
    savings: 210,
  },
  {
    duration: '1week',
    hours: 168,
    price: 300,
    savings: 540,
  },
  {
    duration: '2weeks',
    hours: 336,
    price: 500,
    savings: 1180,
  },
  {
    duration: '1month',
    hours: 720,
    price: 800,
    savings: 2800,
  },
];

export function calculatePrice(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  // Find matching pricing option
  const matchingOption = pricingOptions.find(
    option => Math.abs(option.hours - hours) < 0.5
  );

  if (matchingOption) {
    return matchingOption.price;
  }

  // Custom calculation for non-standard durations
  if (hours <= 1) return 25;
  if (hours <= 3) return 35;
  if (hours <= 8) return 60;
  if (hours <= 72) return 150;
  if (hours <= 168) return 300;
  if (hours <= 336) return 500;
  if (hours <= 720) return 800;

  // For very long durations, calculate based on hourly rate
  return Math.ceil(hours * 5);
}

export function calculateDuration(startTime: Date, endTime: Date): {
  hours: number;
  days: number;
  displayText: string;
} {
  const diffMs = endTime.getTime() - startTime.getTime();
  const hours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  const days = Math.floor(hours / 24);

  let displayText = '';
  if (days > 0) {
    displayText = `${days} day${days > 1 ? 's' : ''} ${hours % 24 > 0 ? `${hours % 24} hours` : ''}`.trim();
  } else {
    displayText = `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return {
    hours,
    days,
    displayText,
  };
}
