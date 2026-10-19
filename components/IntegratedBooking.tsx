"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { locations, Location } from "@/lib/locations";
import { calculatePrice, calculateDuration } from "@/lib/pricing";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const LocationMapSingle = dynamic(() => import("./LocationMapSingle"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />,
});

// Generate deterministic "booked" dates based on seed
function generateBookedDates(locationId: string): { start: Date; end: Date }[] {
  // Use location ID as part of seed for different bookings per location
  const seed = locationId.charCodeAt(0) + locationId.charCodeAt(locationId.length - 1);
  const bookedRanges: { start: Date; end: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate 5-8 fake bookings for the next month
  const numBookings = 5 + (seed % 4);
  
  for (let i = 0; i < numBookings; i++) {
    // Deterministic "random" day offset using seed
    const dayOffset = ((seed * (i + 1) * 7) % 25) + 2; // 2-26 days from today
    const durationDays = ((seed + i) % 3) + 1; // 1-3 days duration
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + dayOffset);
    startDate.setHours(10, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    endDate.setHours(10, 0, 0, 0);
    
    bookedRanges.push({ start: startDate, end: endDate });
  }
  
  // Sort by start date
  bookedRanges.sort((a, b) => a.start.getTime() - b.start.getTime());
  
  return bookedRanges;
}

// Check if a date falls within any booked range
function isDateBooked(date: Date, bookedRanges: { start: Date; end: Date }[]): boolean {
  const checkDate = new Date(date);
  checkDate.setHours(12, 0, 0, 0); // Normalize to midday
  
  return bookedRanges.some(range => {
    const start = new Date(range.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.end);
    end.setHours(23, 59, 59, 999);
    return checkDate >= start && checkDate <= end;
  });
}

// Check if a booking range overlaps with any booked range
function isRangeOverlapping(
  startDate: Date,
  endDate: Date,
  bookedRanges: { start: Date; end: Date }[]
): boolean {
  return bookedRanges.some(range => {
    return startDate < range.end && endDate > range.start;
  });
}

export default function IntegratedBooking() {
  const { t, i18n } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);

  // Generate booked dates for selected location
  const bookedDates = useMemo(
    () => generateBookedDates(selectedLocation.id),
    [selectedLocation.id]
  );

  // Get max date (1 month from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    return maxDate.toISOString().slice(0, 16);
  };

  // Get tomorrow at 10:00 for default start
  const getTomorrowDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

  // Get day after tomorrow at 10:00 for default end
  const getDayAfterTomorrowDateTime = () => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(10, 0, 0, 0);
    return dayAfter.toISOString().slice(0, 16);
  };

  const [startDateTime, setStartDateTime] = useState(getTomorrowDateTime());
  const [endDateTime, setEndDateTime] = useState(getDayAfterTomorrowDateTime());
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Check if current selection overlaps with booked dates
  const hasOverlap = useMemo(() => {
    if (!startDateTime || !endDateTime) return false;
    return isRangeOverlapping(new Date(startDateTime), new Date(endDateTime), bookedDates);
  }, [startDateTime, endDateTime, bookedDates]);

  const handleLocationChange = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setBookingError(null);
    }
  };

  const calculateBookingPrice = () => {
    if (!startDateTime || !endDateTime) return 0;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) return 0;

    return calculatePrice(start, end, selectedLocation.id);
  };

  const calculateBookingDuration = () => {
    if (!startDateTime || !endDateTime) return null;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) return null;

    return calculateDuration(start, end);
  };

  const handleBooking = async () => {
    setBookingError(null);
    
    // Validation
    if (!startDateTime || !endDateTime) {
      alert(t("booking.errors.selectDate"));
      return;
    }

    if (!customerName || !customerPhone) {
      alert(t("booking.errors.fillRequired"));
      return;
    }

    if (!agreeToTerms) {
      alert(t("booking.errors.agreeTerms"));
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) {
      alert(t("booking.errors.invalidDate"));
      return;
    }

    // Check for overlap with booked dates
    if (isRangeOverlapping(start, end, bookedDates)) {
      setBookingError(t("booking.errors.dateUnavailable") || "Selected dates are not available. Please choose different dates.");
      return;
    }

    setIsProcessing(true);

    try {
      const price = calculatePrice(start, end, selectedLocation.id);
      const durationInfo = calculateDuration(start, end);

      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          customerName,
          customerEmail,
          customerPhone,
          specialRequests,
          amount: price,
          durationDays: durationInfo.days,
          durationHours: durationInfo.hours,
          locationId: selectedLocation.id,
          locationName: i18n.language === "en" ? selectedLocation.nameEn : selectedLocation.name,
          language: localStorage.getItem("i18nextLng") || "en",
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(t("error.message"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick duration selection handlers
  const setDurationHours = (hours: number) => {
    const start = new Date(startDateTime);
    const end = new Date(start);
    end.setHours(end.getHours() + hours);
    setEndDateTime(end.toISOString().slice(0, 16));
  };

  const setDurationDays = (days: number) => {
    const start = new Date(startDateTime);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setEndDateTime(end.toISOString().slice(0, 16));
  };

  const price = calculateBookingPrice();
  const duration = calculateBookingDuration();

  // Generate calendar days for availability display
  const calendarDays = useMemo(() => {
    const days: { date: Date; isBooked: boolean; isToday: boolean; isPast: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Show current month and next month
    for (let i = 0; i < 35; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      days.push({
        date,
        isBooked: isDateBooked(date, bookedDates),
        isToday: i === 0,
        isPast: false,
      });
    }
    
    return days;
  }, [bookedDates]);

  return (
    <section
      id="booking"
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 min-h-[600px]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn drop-shadow-lg">
            {t("booking.title")}
          </h1>
          <p className="text-xl text-white/90 mb-4 drop-shadow-md">{t("booking.subtitle")}</p>
          <div className="flex justify-center gap-4 flex-wrap text-white/80 text-sm">
            <span>⚡ {t("hero.features.electricity")}</span>
            <span>🌡️ {t("hero.features.heated")}</span>
            <span>🔒 {t("hero.features.secure")}</span>
            <span>💳 {t("hero.features.payment")}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Location Selection */}
          <div className="space-y-6">
            {/* Location Dropdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📍 {t("booking.selectLocation")}
              </h3>
              <div className="relative">
                <select
                  value={selectedLocation.id}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full px-4 py-4 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg font-medium appearance-none bg-white cursor-pointer hover:border-primary-400"
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {i18n.language === "en" ? location.nameEn : location.name} - {location.address}
                      {location.id === "pinki" ? " ⭐ Premium" : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Selected location address display */}
              <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏠</div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {i18n.language === "en" ? selectedLocation.nameEn : selectedLocation.name}
                      {selectedLocation.id === "pinki" && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⭐ Premium</span>
                      )}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{selectedLocation.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📅 {t("booking.availability") || "Availability"}
              </h3>
              <div className="mb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-gray-600">{t("booking.available") || "Available"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-gray-600">{t("booking.booked") || "Booked"}</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Day headers */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <div key={day} className="text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {/* Calendar grid - add empty cells for alignment */}
                {(() => {
                  const firstDay = calendarDays[0]?.date;
                  if (!firstDay) return null;
                  const dayOfWeek = firstDay.getDay();
                  // Convert Sunday=0 to Monday=0 format
                  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                  const emptyCells = [];
                  for (let i = 0; i < offset; i++) {
                    emptyCells.push(<div key={`empty-${i}`} className="h-10"></div>);
                  }
                  return emptyCells;
                })()}
                {calendarDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      day.isBooked
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : day.isToday
                        ? "bg-primary-100 text-primary-700 border-2 border-primary-400"
                        : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                    }`}
                    title={day.isBooked ? (t("booking.bookedDate") || "Booked") : (t("booking.availableDate") || "Available")}
                  >
                    {day.date.getDate()}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center">
                {t("booking.calendarNote") || "Calendar shows next 5 weeks. Bookings available up to 1 month ahead."}
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  📸 {t("location.photo")}
                </h3>
              </div>
              <div className="relative h-80">
                <Image
                  src={selectedLocation.image}
                  alt={`${selectedLocation.name} garage photo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Location Specifications & Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t("location.specifications")}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">📏</div>
                  <div className="text-sm text-gray-600">{t("garageDetails.size")}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.size}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🚪</div>
                  <div className="text-sm text-gray-600">{t("garageDetails.gateHeight")}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.gateHeight}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-sm text-gray-600">{t("garageDetails.electricity")}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.electricity}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🌡️</div>
                  <div className="text-sm text-gray-600">{t("garageDetails.heating")}</div>
                  <div className="font-semibold text-gray-900">
                    {selectedLocation.specs.heated ? t("location.heatedYes") : t("location.heatedNo")}
                  </div>
                </div>
              </div>

              {/* Additional Features */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t("location.includedFeatures")}</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t("location.feature24x7")}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t("location.featureSecureCode")}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t("location.featureOnlinePayment")}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t("location.featureInstantBooking")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <LocationMapSingle location={selectedLocation} />
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t("booking.bookNow")}
            </h3>

            <div className="space-y-6">
              {/* Location Selection in Booking Form */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 {t("booking.selectLocation")} *
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation.id}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-4 py-4 pr-10 border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-base font-medium appearance-none bg-primary-50 cursor-pointer hover:border-primary-400"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {i18n.language === "en" ? location.nameEn : location.name} - {location.address}
                        {location.id === "pinki" ? " ⭐ Premium" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {/* Selected location display */}
                <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏠</span>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {i18n.language === "en" ? selectedLocation.nameEn : selectedLocation.name}
                      </span>
                      {selectedLocation.id === "pinki" && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">⭐ Premium</span>
                      )}
                      <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date/Time Range Selection */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 {t("booking.startDate")} *
                  </label>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => {
                      setStartDateTime(e.target.value);
                      setBookingError(null);
                      // Auto-adjust end date if it is before or equal to start date
                      const newStart = new Date(e.target.value);
                      const currentEnd = new Date(endDateTime);
                      if (currentEnd <= newStart) {
                        const newEnd = new Date(newStart);
                        newEnd.setDate(newEnd.getDate() + 1);
                        setEndDateTime(newEnd.toISOString().slice(0, 16));
                      }
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                    max={getMaxDate()}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg ${
                      hasOverlap ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 {t("booking.endDate")} *
                  </label>
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => {
                      setEndDateTime(e.target.value);
                      setBookingError(null);
                    }}
                    min={startDateTime || new Date().toISOString().slice(0, 16)}
                    max={getMaxDate()}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg ${
                      hasOverlap ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Overlap Warning */}
              {hasOverlap && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{t("booking.errors.dateUnavailable") || "Selected dates overlap with existing bookings"}</span>
                  </div>
                  <p className="mt-2 text-sm text-red-600">
                    {t("booking.errors.chooseDifferentDates") || "Please choose different dates or check the availability calendar."}
                  </p>
                </div>
              )}

              {/* Booking Error Display */}
              {bookingError && !hasOverlap && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{bookingError}</span>
                  </div>
                </div>
              )}

              {/* Quick Duration Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ {t("booking.quickSelect")}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {/* Hourly options */}
                  <button
                    type="button"
                    onClick={() => setDurationHours(1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200"
                  >
                    {t("pricing.1hour")}
                    <span className="block text-xs opacity-75">€10</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationHours(3)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200"
                  >
                    {t("pricing.3hours")}
                    <span className="block text-xs opacity-75">€25</span>
                  </button>
                  {/* Daily options */}
                  <button
                    type="button"
                    onClick={() => setDurationDays(1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {t("pricing.1day")}
                    <span className="block text-xs opacity-75">€35</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationDays(3)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-primary-100 text-primary-700 hover:bg-primary-200 border-2 border-primary-300"
                  >
                    {t("pricing.3days")}
                    <span className="block text-xs opacity-75">€50</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationDays(7)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {t("pricing.1week")}
                    <span className="block text-xs opacity-75">€70</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationDays(30)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {t("pricing.1month")}
                    <span className="block text-xs opacity-75">€150</span>
                  </button>
                </div>
              </div>

              {/* Duration & Price Display */}
              {duration && price > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-semibold text-lg">
                      ⏱️ {t("booking.duration")}:
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      {duration.displayText}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-primary-200">
                    <span className="text-gray-700 font-semibold text-lg">
                      💰 {t("booking.totalPrice")}:
                    </span>
                    <span className="text-xl text-gray-900 font-bold">
                      €{price}
                    </span>
                  </div>
                  {/* Deposit Information */}
                  <div className="mt-4 pt-4 border-t-2 border-primary-300 bg-white/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-semibold">
                        🔒 {t("booking.depositNow")}:
                      </span>
                      <span className="text-2xl text-green-600 font-bold">
                        €10
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {t("booking.remainingBalance")}:
                      </span>
                      <span className="text-gray-700 font-medium">
                        €{price - 10}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      ⚠️ {t("booking.depositNote")}
                    </p>
                  </div>
                  {selectedLocation.id === "pinki" && (
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <p className="text-sm text-gray-600 italic">
                        ⭐ {t("booking.premiumPricing")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              <div className="pt-6 border-t-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  👤 {t("booking.contactInfo")}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("booking.name")} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("booking.email")}
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="segarsj179@gmail.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("booking.phone")} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+371 22532304"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("booking.specialRequests")}
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      placeholder="Any special requirements?"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="pt-6 border-t-2 border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {t("booking.termsAgreement")}{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline font-semibold"
                    >
                      {t("booking.termsLink")}
                    </a>
                    {" *"}
                  </span>
                </label>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isProcessing || !price || !agreeToTerms || hasOverlap}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-5 rounded-xl text-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl"
              >
                {isProcessing
                  ? t("booking.processing")
                  : t("booking.payDeposit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
