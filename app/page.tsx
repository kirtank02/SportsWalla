"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import your custom dialog components from your ui folder (Shadcn UI structure)
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

// Import the VenueDetailsModal component that will be in a separate file
import VenueDetailsModal from "@/components/venue-details-modal";

import {
  Search, ChevronDown, Heart, Menu, Info, MapPin, Clock, Users, Star, Zap, Filter, X, Car, ShowerHead,
  Ticket
} from "lucide-react";

// Define the type for a Venue for TypeScript
interface Venue {
  id: string;
  name: string;
  location: string;
  distance: string;
  hasParking: boolean;
  hasEquipment: boolean;
  hasShower: boolean;
  sport: string;
  rating: number;
  reviews: number;
  cancellation: string;
  description?: string;
  images?: string[];
  timeSlots: { time: string; endTime: string; court: string; available: boolean; price: number; popularity: string; fastFilling: boolean; }[];
  basePrice: number;
}


export default function SportsBookingSystem() {
  const [selectedDate, setSelectedDate] = useState("26");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedVenueName, setSelectedVenueName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");

  // State for modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVenueForDetails, setSelectedVenueForDetails] = useState<Venue | null>(null);


  const dates = [
    { day: "SUN", date: "25", month: "MAY" },
    { day: "MON", date: "26", month: "MAY" },
    { day: "TUE", date: "27", month: "MAY" },
    { day: "WED", date: "28", month: "MAY" },
    { day: "THU", date: "29", month: "MAY" },
    { day: "FRI", date: "30", month: "MAY" },
    { day: "SAT", date: "31", month: "MAY" },
  ];

  // Dummy Data for Sports Venues
  const sportsVenues: Venue[] = [
    {
      id: "elite-sports-complex",
      name: "Elite Sports Complex",
      location: "Vastrapur, Ahmedabad",
      distance: "2.1 km",
      hasParking: true,
      hasEquipment: true,
      hasShower: true,
      sport: "Badminton",
      rating: 4.8,
      reviews: 324,
      cancellation: "Free cancellation up to 2 hours before",
      description: "A premier indoor badminton facility with professional courts and lighting.",
      images: [
        "https://via.placeholder.com/800x450?text=Elite+Sports+Badminton+Court",
        "https://via.placeholder.com/800x450?text=Elite+Sports+Lobby",
        "https://via.placeholder.com/800x450?text=Elite+Sports+Exterior",
      ],
      timeSlots: [
        { time: "06:00", endTime: "07:00", court: "Court 1", available: true, price: 600, popularity: "high", fastFilling: false },
        { time: "07:00", endTime: "08:00", court: "Court 2", available: true, price: 600, popularity: "medium", fastFilling: true },
        { time: "08:00", endTime: "09:00", court: "Court 1", available: false, price: 800, popularity: "high", fastFilling: false },
        { time: "09:00", endTime: "10:00", court: "Court 3", available: true, price: 800, popularity: "low", fastFilling: false },
        { time: "17:00", endTime: "18:00", court: "Court 1", available: true, price: 1000, popularity: "high", fastFilling: true },
        { time: "18:00", endTime: "19:00", court: "Court 2", available: false, price: 1000, popularity: "high", fastFilling: false },
        { time: "19:00", endTime: "20:00", court: "Court 3", available: true, price: 1200, popularity: "high", fastFilling: true },
      ],
      basePrice: 600,
    },
    {
      id: "sports-arena",
      name: "Sports Arena",
      location: "Satellite, Ahmedabad",
      distance: "3.2 km",
      hasParking: true,
      hasEquipment: false,
      hasShower: true,
      sport: "Football",
      rating: 4.6,
      reviews: 189,
      cancellation: "Non-refundable",
      description: "Well-maintained turf football ground suitable for 5-a-side and 7-a-side matches.",
      images: [
        "https://via.placeholder.com/800x450?text=Sports+Arena+Football+Turf",
        "https://via.placeholder.com/800x450?text=Sports+Arena+Changing+Rooms",
      ],
      timeSlots: [
        { time: "06:00", endTime: "07:00", court: "Turf 1", available: true, price: 1500, popularity: "medium", fastFilling: false },
        { time: "07:00", endTime: "08:00", court: "Turf 2", available: true, price: 1500, popularity: "low", fastFilling: false },
        { time: "18:00", endTime: "19:00", court: "Turf 1", available: true, price: 2500, popularity: "high", fastFilling: true },
        { time: "19:00", endTime: "20:00", court: "Turf 2", available: false, price: 3000, popularity: "high", fastFilling: false },
      ],
      basePrice: 1500,
    },
    {
      id: "champions-court",
      name: "Champions Court",
      location: "SG Highway, Ahmedabad",
      distance: "5.0 km",
      hasParking: true,
      hasEquipment: true,
      hasShower: false,
      sport: "Basketball",
      rating: 4.5,
      reviews: 95,
      cancellation: "Free cancellation up to 1 hour before",
      description: "Indoor basketball court with standard dimensions, ideal for practice and friendly games.",
      images: [
        "https://via.placeholder.com/800x450?text=Champions+Court+Basketball",
        "https://via.placeholder.com/800x450?text=Champions+Court+Entrance",
      ],
      timeSlots: [
        { time: "07:00", endTime: "08:00", court: "Main Court", available: true, price: 700, popularity: "low", fastFilling: false },
        { time: "18:00", endTime: "19:00", court: "Main Court", available: true, price: 1200, popularity: "high", fastFilling: true },
        { time: "19:00", endTime: "20:00", court: "Main Court", available: false, price: 1200, popularity: "high", fastFilling: false },
      ],
      basePrice: 700,
    },
  ];

  const groupTimeSlotsByPeriod = (slots: Venue['timeSlots']) => {
    const morning = slots.filter((slot) => Number.parseInt(slot.time) >= 6 && Number.parseInt(slot.time) < 12);
    const afternoon = slots.filter((slot) => Number.parseInt(slot.time) >= 12 && Number.parseInt(slot.time) < 17);
    const evening = slots.filter((slot) => Number.parseInt(slot.time) >= 17 && Number.parseInt(slot.time) < 22);
    const night = slots.filter((slot) => Number.parseInt(slot.time) >= 22 || Number.parseInt(slot.time) < 6);
    return { morning, afternoon, evening, night };
  };

  const formatTime = (time: string) => {
    const hour = Number.parseInt(time);
    const ampm = hour >= 12 && hour !== 24 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour === 24 ? 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
  };

  const getSlotButtonClass = (slot: Venue['timeSlots'][0], slotId: string) => {
    if (!slot.available) {
      return "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through";
    }
    if (selectedTimeSlot === slotId) {
      return "bg-green-500 text-white border-green-500 ring-2 ring-green-500 ring-offset-2";
    }
    return "bg-white border-gray-300 text-green-700 hover:bg-green-50 hover:border-green-400";
  };

  const handleTimeSlotSelect = (venue: Venue, slot: Venue['timeSlots'][0]) => {
    if (slot.available) {
      const slotId = `${venue.id}-${slot.time}-${slot.court.replace(/\s/g, "-").toLowerCase()}`;
      setSelectedTimeSlot(slotId);
      setSelectedVenueName(venue.name);
    }
  };

  const handleVenueNameClick = (venue: Venue) => {
    setSelectedVenueForDetails(venue);
    setIsDetailsModalOpen(true);
  };

  const filteredVenues = useMemo(() => {
    return sportsVenues.filter((venue) => {
      if (sportFilter !== "all" && venue.sport.toLowerCase() !== sportFilter) return false;
      if (priceFilter !== "all") {
        if (priceFilter === "low" && venue.basePrice > 800) return false;
        if (priceFilter === "medium" && (venue.basePrice <= 800 || venue.basePrice > 1500)) return false;
        if (priceFilter === "high" && venue.basePrice <= 1500) return false;
      }
      if (timeFilter !== "all") {
        const hasMatchingSlot = venue.timeSlots.some(slot => {
          const hour = Number.parseInt(slot.time);
          if (timeFilter === "morning" && (hour >= 6 && hour < 12)) return true;
          if (timeFilter === "afternoon" && (hour >= 12 && hour < 17)) return true;
          if (timeFilter === "evening" && (hour >= 17 && hour < 22)) return true;
          if (timeFilter === "night" && (hour >= 22 || hour < 6)) return true;
          return false;
        });
        if (!hasMatchingSlot) return false;
      }
      return true;
    });
  }, [sportFilter, priceFilter, timeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center flex-shrink-0">
              Sportswallah
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 mx-4 hidden md:flex max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for Sports, Venues, Courts and Activities"
                className="pl-10 bg-gray-100 border-0 rounded-lg text-sm h-10 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Right side icons/buttons */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Search className="w-5 h-5 text-gray-600" />
              </Button>

              <div className="hidden xs:flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Ahmedabad</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </div>

              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white text-xs lg:text-sm px-4 lg:px-6 rounded-lg shadow-sm"
              >
                Sign in
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="px-4 pb-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for Sports, Venues, Courts and Activities"
                className="pl-10 bg-gray-100 border-0 rounded-lg text-sm h-10"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col pt-4 pb-6 shadow-lg animate-slide-in-right">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
              <div className="text-xl font-bold text-gray-800">Sportswallah</div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 px-4 py-4 overflow-y-auto">
              <a href="#" className="text-gray-800 hover:text-red-500 font-medium text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Sports</a>
              <a href="#" className="text-gray-800 hover:text-red-500 text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Venues</a>
              <a href="#" className="text-gray-800 hover:text-red-500 text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Events</a>
              <a href="#" className="text-gray-800 hover:text-red-500 text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Tournaments</a>
              <a href="#" className="text-gray-800 hover:text-red-500 text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Coaching</a>
              <a href="#" className="text-gray-800 hover:text-red-500 text-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Equipment</a>
              <hr className="my-2 border-gray-100" />
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-base" onClick={() => setMobileMenuOpen(false)}>List Your Venue</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-base" onClick={() => setMobileMenuOpen(false)}>Corporates</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-base" onClick={() => setMobileMenuOpen(false)}>Offers</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-base" onClick={() => setMobileMenuOpen(false)}>Gift Cards</a>
            </nav>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="border-t border-gray-100 hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-red-500 font-medium text-sm transition-colors">Sports</a>
              <a href="#" className="text-gray-700 hover:text-red-500 text-sm transition-colors">Venues</a>
              <a href="#" className="text-gray-700 hover:text-red-500 text-sm transition-colors">Events</a>
              <a href="#" className="text-gray-700 hover:text-red-500 text-sm transition-colors">Tournaments</a>
              <a href="#" className="text-gray-700 hover:text-red-500 text-sm transition-colors">Coaching</a>
              <a href="#" className="text-gray-700 hover:text-red-500 text-sm transition-colors">Equipment</a>
            </nav>
            <nav className="flex space-x-6 text-xs">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">List Your Venue</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Corporates</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Offers</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Gift Cards</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Sports Title Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Sports Venues in Ahmedabad</h1>
              <div className="flex flex-wrap gap-2">
                {[...new Set(sportsVenues.map(venue => venue.sport))].map(sport => (
                  <Badge
                    key={sport}
                    variant="outline"
                    className="text-xs border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 cursor-pointer transition-colors"
                    onClick={() => setSportFilter(sport.toLowerCase())}
                  >
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-4 lg:mt-0">
              <span className="font-medium">{filteredVenues.length}</span> venues found
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector with Filters - STICKY */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Date Selector */}
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide flex-shrink-0 pb-2 -mb-2">
              {dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`flex flex-col items-center flex-shrink-0 min-w-[60px] lg:min-w-[70px] py-3 px-3 lg:px-4 rounded-lg transition-all duration-200
                    ${date.selected || selectedDate === date.date
                      ? "bg-red-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:shadow-md"
                    }`}
                >
                  <span className="text-xs font-medium">{date.day}</span>
                  <span className="text-lg lg:text-xl font-bold">{date.date}</span>
                  <span className="text-xs">{date.month}</span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 lg:gap-3 mt-3 lg:mt-0 w-full">
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors w-full sm:w-auto"
              >
                <option value="all">All Sports</option>
                <option value="badminton">Badminton</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors w-full sm:w-auto"
              >
                <option value="all">Price Range</option>
                <option value="low">₹ - ₹800</option>
                <option value="medium">₹800 - ₹1500</option>
                <option value="high">₹1500+</option>
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors w-full sm:w-auto"
              >
                <option value="all">Preferred Time</option>
                <option value="morning">Morning (6AM-12PM)</option>
                <option value="afternoon">Afternoon (12PM-5PM)</option>
                <option value="evening">Evening (5PM-10PM)</option>
                <option value="night">Night (10PM-6AM)</option>
              </select>

              <Button
                variant="outline"
                className="flex items-center space-x-2 text-sm border-gray-300 hover:border-red-500 hover:text-red-500 transition-colors w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                <span className="inline">Amenities</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Time Slot Display */}
      {selectedTimeSlot && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Slot Selected!</div>
                  <div className="text-green-100 text-sm">
                    {selectedVenueName} - {selectedTimeSlot.split("-").slice(2).join(" ").replace(/(^\w|\s\w)/g, m => m.toUpperCase())} ({formatTime(selectedTimeSlot.split("-")[1])} - {formatTime(Number.parseInt(selectedTimeSlot.split("-")[1]) + 1)})
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTimeSlot("")}
                  className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:text-green-600 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 shadow-lg">
                  Proceed to Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Venue Listings */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid gap-6">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Venue Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          {/* Make the h2 clickable to open modal */}
                          <h2
                            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => handleVenueNameClick(venue)}
                          >
                            {venue.name}
                          </h2>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                            {venue.location} • {venue.distance}
                          </p>
                          <Badge className="mt-2 text-xs bg-red-100 text-red-700 capitalize">{venue.sport}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                          <Heart className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center text-sm text-gray-700 mt-3">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span className="font-semibold">{venue.rating}</span>
                        <span className="text-gray-500 ml-1">({venue.reviews} reviews)</span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 mt-4">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-1 text-gray-500" /> Parking
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-500" /> Equipment
                        </div>
                        <div className="flex items-center">
                          <ShowerHead className="w-4 h-4 mr-1 text-gray-500" /> Shower
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <Zap className="w-4 h-4 mr-1 text-orange-500" /> Instant Booking
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mt-4">
                        <Info className="w-3 h-3 inline-block mr-1 text-gray-400" />
                        {venue.cancellation}
                      </p>
                    </div>

                    {/* Time Slots */}
                    <div className="lg:w-2/3 mt-4 lg:mt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Time Slots</h3>

                      {Object.entries(groupTimeSlotsByPeriod(venue.timeSlots)).map(([period, slots]) => (
                        slots.length > 0 && (
                          <div key={period} className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                              {period}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot, index) => {
                                const slotId = `${venue.id}-${slot.time}-${slot.court.replace(/\s/g, "-").toLowerCase()}`;
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleTimeSlotSelect(venue, slot)}
                                    disabled={!slot.available}
                                    className={`
                                      px-3 py-1.5 rounded-full border text-center text-sm font-medium
                                      transition-all duration-150 ease-in-out whitespace-nowrap
                                      ${getSlotButtonClass(slot, slotId)}
                                    `}
                                  >
                                    {formatTime(slot.time).replace(':00', '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600 text-lg">
              No venues found matching your criteria. Try adjusting your filters!
            </div>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-black-100 to-gray-300 text-gray-900 py-12 mt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 tracking-wide">Ready to Play?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-lg">
            Book your favorite sports venue instantly and enjoy a hassle-free gaming experience with top-rated facilities.
          </p>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-200 font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            Explore More Venues
          </Button>
        </div>
      </div>

      {/* Venue Details Modal - Rendered at the top level */}
      <VenueDetailsModal
        venue={selectedVenueForDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}