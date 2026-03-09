
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { BookingDialog } from "@/components/booking-dialog";
import { 
  Car, 
  Fuel, 
  Users, 
  Zap, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Send,
  ArrowRight,
  Shield,
  Clock,
  Wallet,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CARS = [
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    pricePerDay: 3500,
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatic",
    image: PlaceHolderImages.find(img => img.id === "hyundai-creta")?.imageUrl || "https://picsum.photos/seed/creta/600/400",
    frontImage: "https://picsum.photos/seed/creta-front/600/400",
    leftImage: "https://picsum.photos/seed/creta-side/600/400"
  },
  {
    id: "swift-dzire",
    name: "Swift Dzire",
    pricePerDay: 2500,
    fuel: "Petrol/CNG",
    seats: 5,
    transmission: "Manual",
    image: "data:image/webp;base64,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",
    frontImage: "https://picsum.photos/seed/swift-front/600/400",
    leftImage: "https://picsum.photos/seed/swift-side/600/400"
  },
  {
    id: "maruti-ertiga",
    name: "Maruti Ertiga",
    pricePerDay: 3800,
    fuel: "Petrol/CNG",
    seats: 7,
    transmission: "Manual",
    image: PlaceHolderImages.find(img => img.id === "maruti-ertiga")?.imageUrl || "https://picsum.photos/seed/ertiga/600/400",
    frontImage: "https://picsum.photos/seed/ertiga-front/600/400",
    leftImage: "https://picsum.photos/seed/ertiga-side/600/400"
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    pricePerDay: 4500,
    fuel: "Diesel",
    seats: 7,
    transmission: "Automatic",
    image: PlaceHolderImages.find(img => img.id === "innova-crysta")?.imageUrl || "https://picsum.photos/seed/innova/600/400",
    frontImage: "https://picsum.photos/seed/innova-front/600/400",
    leftImage: "https://picsum.photos/seed/innova-side/600/400"
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar",
    pricePerDay: 4000,
    fuel: "Diesel/Petrol",
    seats: 4,
    transmission: "Manual/Auto",
    image: PlaceHolderImages.find(img => img.id === "mahindra-thar")?.imageUrl || "https://picsum.photos/seed/thar/600/400",
    frontImage: "https://picsum.photos/seed/thar-front/600/400",
    leftImage: "https://picsum.photos/seed/thar-side/600/400"
  },
  {
    id: "maruti-baleno",
    name: "Maruti Baleno",
    pricePerDay: 2200,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: PlaceHolderImages.find(img => img.id === "maruti-baleno")?.imageUrl || "https://picsum.photos/seed/baleno/600/400",
    frontImage: "https://picsum.photos/seed/baleno-front/600/400",
    leftImage: "https://picsum.photos/seed/baleno-side/600/400"
  }
];

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState<typeof CARS[0] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = (car: typeof CARS[0]) => {
    setSelectedCar(car);
    setIsBookingOpen(true);
  };

  const heroImage = PlaceHolderImages.find(img => img.id === "hero-car");

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/800"}
            alt="Hero Fleet"
            fill
            className="object-cover opacity-50"
            priority
            data-ai-hint="luxury cars"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary text-primary-foreground font-bold px-4 py-1 animate-in slide-in-from-left duration-500 uppercase">PREMIUM CAR RENTALS</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground mb-6 leading-tight uppercase animate-in slide-in-from-left duration-700 delay-100">
              Arun Car <span className="text-primary yellow-glow">Rentals</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 max-w-lg leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
              Drive Your Dream Car Today. Experience premium comfort and reliability at unbeatable prices in Sircilla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-left duration-700 delay-300">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full w-full sm:w-auto" asChild>
                <Link href="#cars">Explore Fleet <ChevronRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-primary/50 hover:bg-primary/10 w-full sm:w-auto" asChild>
                <Link href="#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Insured</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Full peace of mind</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">24/7 Support</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Always available</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Payments</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Easy options</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Fleet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Well maintained</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <section id="cars" className="py-20 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black mb-4 uppercase">
              Our <span className="text-primary">Fleet</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Select your vehicle and choose your preferred rental plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CARS.map((car) => (
              <div key={car.id} className="premium-card rounded-3xl overflow-hidden flex flex-col h-full group border-border shadow-2xl bg-card">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <Image 
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized={car.image.startsWith('data:')}
                    data-ai-hint="car model"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-black px-3 py-1 text-xs">₹{car.pricePerDay}/day</Badge>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{car.name}</h3>
                    <div className="flex items-center gap-1 text-primary">
                      <Zap className="w-4 h-4 fill-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 mb-8 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary" /> {car.fuel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> {car.seats} Seats
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Car className="w-4 h-4 text-primary" /> {car.transmission}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      className="w-full h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/10 rounded-xl"
                      onClick={() => openBooking(car)}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View & Book
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black mb-6 uppercase">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10">
                Our team is available 24/7 to assist you. Visit us at our Sircilla office.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 sm:p-4 rounded-full">
                    <Phone className="w-5 h-5 sm:w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Call Us</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 sm:p-4 rounded-full">
                    <MessageCircle className="w-5 h-5 sm:w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">WhatsApp</h4>
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm sm:text-base" asChild>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        Chat with us now <ArrowRight className="ml-1 w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 sm:p-4 rounded-full">
                    <MapPin className="w-5 h-5 sm:w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Our Office</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">Opposite New Bus Stand, Sircilla, Telangana</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 aspect-video w-full rounded-2xl overflow-hidden border border-border bg-background relative shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d473.7441589139265!2d78.8241477!3d18.390463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc9568770807b3%3A0x863339031c034604!2sNew%20Bus%20Stand%20Sircilla!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&z=19" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
            </div>

            <div className="bg-background p-6 sm:p-8 rounded-3xl border border-border shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your full name" className="bg-secondary/30 border-border h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email / Phone</label>
                  <Input placeholder="How can we reach you?" className="bg-secondary/30 border-border h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Tell us about your requirements" className="min-h-[120px] bg-secondary/30 border-border" />
                </div>
                <Button className="w-full h-12 font-bold uppercase tracking-widest">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight text-white uppercase">
                Arun <span className="text-primary">Rentals</span>
              </span>
            </Link>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} Arun Car Rentals.
            </p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <BookingDialog 
        car={selectedCar} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </main>
  );
}
