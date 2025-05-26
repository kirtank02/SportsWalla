"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

import { MapPin, Star, Zap, Info, Car, ShowerHead, Users, X, Ticket } from "lucide-react";

// Define the type for a Venue (optional but good practice for TypeScript)
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

interface VenueDetailsModalProps {
   venue: Venue | null;
   isOpen: boolean;
   onClose: () => void;
}

export default function VenueDetailsModal({ venue, isOpen, onClose }: VenueDetailsModalProps) {
   if (!isOpen || !venue) return null;

   const images = venue.images || [
      "https://via.placeholder.com/800x450?text=Sports+Complex+Image+1",
      "https://via.placeholder.com/800x450?text=Sports+Complex+Image+2",
      "https://via.placeholder.com/800x450?text=Sports+Complex+Image+3",
   ];

   return (
      <Dialog isOpen={isOpen} onClose={onClose}>
         <DialogHeader>
            <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
            <p className="text-sm text-gray-600 flex items-center mt-1">
               <MapPin className="w-3 h-3 mr-1 text-gray-500" />
               {venue.location} • {venue.distance}
            </p>
         </DialogHeader>
         <DialogContent className="max-h-[70vh] overflow-y-auto">
            {/* Image Carousel/Gallery (simplified) */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {images.map((imgSrc, index) => (
                  <img
                     key={index}
                     src={imgSrc}
                     alt={`${venue.name} image ${index + 1}`}
                     className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
               ))}
            </div>

            {/* Venue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
               <div>
                  <h3 className="font-semibold text-lg mb-2">About This Venue</h3>
                  <p className="text-sm">
                     This is a state-of-the-art sports complex offering excellent facilities for {venue.sport}.
                     It's well-maintained and perfect for both casual games and competitive matches.
                     {venue.description && ` ${venue.description}`}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mt-3">
                     <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                     <span className="font-semibold">{venue.rating}</span>
                     <span className="text-gray-500 ml-1">({venue.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                     <Ticket className="w-3 h-3 inline-block mr-1 text-gray-400" />
                     {venue.cancellation}
                  </p>
               </div>

               <div>
                  <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                     <div className="flex items-center">
                        <Car className="w-4 h-4 mr-2 text-gray-500" /> {venue.hasParking ? "Ample Parking" : "No Parking"}
                     </div>
                     <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" /> {venue.hasEquipment ? "Equipment Available" : "Bring Your Own Equipment"}
                     </div>
                     <div className="flex items-center">
                        <ShowerHead className="w-4 h-4 mr-2 text-gray-500" /> {venue.hasShower ? "Showers Available" : "No Showers"}
                     </div>
                     <div className="flex items-center text-green-600 font-medium">
                        <Zap className="w-4 h-4 mr-2 text-orange-500" /> Instant Booking
                     </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 mt-4">Court Information</h3>
                  <ul className="list-disc list-inside text-sm">
                     {venue.timeSlots && [...new Set(venue.timeSlots.map(slot => slot.court))].map(court => (
                        <li key={court}>{court}</li>
                     ))}
                     {venue.timeSlots.length === 0 && <li>No specific court details available.</li>}
                  </ul>
               </div>
            </div>
         </DialogContent>
         <DialogFooter>
            <Button onClick={onClose} variant="outline">Close</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">Book Now</Button>
         </DialogFooter>
      </Dialog>
   );
}