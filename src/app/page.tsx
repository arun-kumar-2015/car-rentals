
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
  Timer,
  Calendar
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
    transmission: "Manual/Auto",
    image: PlaceHolderImages.find(img => img.id === "hyundai-creta")?.imageUrl || "https://picsum.photos/seed/1/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "hyundai-creta-front")?.imageUrl || "https://picsum.photos/seed/11/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "hyundai-creta-left")?.imageUrl || "https://picsum.photos/seed/12/600/400"
  },
  {
    id: "swift-dzire",
    name: "Swift Dzire",
    pricePerDay: 1800,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: PlaceHolderImages.find(img => img.id === "swift-dzire")?.imageUrl || "https://picsum.photos/seed/2/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "swift-dzire-front")?.imageUrl || "https://picsum.photos/seed/21/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "swift-dzire-left")?.imageUrl || "https://picsum.photos/seed/22/600/400"
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar",
    pricePerDay: 4500,
    fuel: "Diesel",
    seats: 4,
    transmission: "Manual (4x4)",
    image: PlaceHolderImages.find(img => img.id === "mahindra-thar")?.imageUrl || "https://picsum.photos/seed/3/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "mahindra-thar-front")?.imageUrl || "https://picsum.photos/seed/31/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "mahindra-thar-left")?.imageUrl || "https://picsum.photos/seed/32/600/400"
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova Crysta",
    pricePerDay: 5000,
    fuel: "Diesel",
    seats: 7,
    transmission: "Automatic",
    image: PlaceHolderImages.find(img => img.id === "toyota-innova")?.imageUrl || "https://picsum.photos/seed/4/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "toyota-innova-front")?.imageUrl || "https://picsum.photos/seed/41/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "toyota-innova-left")?.imageUrl || "https://picsum.photos/seed/42/600/400"
  },
  {
    id: "maruti-ertiga",
    name: "Maruti Suzuki Ertiga",
    pricePerDay: 2800,
    fuel: "Petrol/CNG",
    seats: 7,
    transmission: "Manual",
    image: PlaceHolderImages.find(img => img.id === "maruti-ertiga")?.imageUrl || "https://picsum.photos/seed/5/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "maruti-ertiga-front")?.imageUrl || "https://picsum.photos/seed/51/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "maruti-ertiga-left")?.imageUrl || "https://picsum.photos/seed/52/600/400"
  },
  {
    id: "maruti-baleno",
    name: "Maruti Suzuki Baleno",
    pricePerDay: 2200,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual/AMT",
    image: PlaceHolderImages.find(img => img.id === "maruti-baleno")?.imageUrl || "https://picsum.photos/seed/6/600/400",
    frontImage: PlaceHolderImages.find(img => img.id === "maruti-baleno-front")?.imageUrl || "https://picsum.photos/seed/61/600/400",
    leftImage: PlaceHolderImages.find(img => img.id === "maruti-baleno-left")?.imageUrl || "https://picsum.photos/seed/62/600/400"
  }
];

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState<typeof CARS[0] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialRentalType, setInitialRentalType] = useState<"daily" | "hourly">("daily");
  const [initialHourlyDuration, setInitialHourlyDuration] = useState<"6" | "12">("6");

  const openBooking = (car: typeof CARS[0], type: "daily" | "hourly" = "daily", duration: "6" | "12" = "6") => {
    setSelectedCar(car);
    setInitialRentalType(type);
    setInitialHourlyDuration(duration);
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
            src={heroImage?.imageUrl || "https://picsum.photos/seed/99/1200/600"}
            alt="Hero Car"
            fill
            className="object-cover opacity-40"
            priority
            data-ai-hint="luxury car"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary text-primary-foreground font-bold px-4 py-1 animate-in slide-in-from-left duration-500">PREMIUM CAR RENTALS</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-black text-foreground mb-6 leading-tight uppercase animate-in slide-in-from-left duration-700 delay-100">
              Arun Car <span className="text-primary yellow-glow">Rentals</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 max-w-lg leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
              Drive Your Dream Car Today. Experience premium comfort and reliability at unbeatable prices in Sircilla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-left duration-700 delay-300">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full w-full sm:w-auto" asChild>
                <Link href="#cars">Book Now <ChevronRight className="ml-2 w-5 h-5" /></Link>
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
              Select your car and rental duration to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CARS.map((car) => (
              <div key={car.id} className="premium-card rounded-3xl overflow-hidden flex flex-col h-full group border-border shadow-2xl">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <Image 
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    data-ai-hint="car model"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-black px-3 py-1 text-xs">₹{car.pricePerDay}/day</Badge>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{car.name}</h3>
                    <div className="flex items-center gap-1 text-primary">
                      <Zap className="w-4 h-4 fill-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 mb-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary" /> {car.fuel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> {car.seats} Seats
                    </div>
                  </div>

                  <div className="space-y-3 mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Choose Rental Duration</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="h-12 border-border hover:border-primary hover:bg-primary/5 font-bold text-xs uppercase transition-all"
                        onClick={() => openBooking(car, "hourly", "6")}
                      >
                        <Timer className="w-4 h-4 mr-2 text-primary" /> 6 Hours
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-12 border-border hover:border-primary hover:bg-primary/5 font-bold text-xs uppercase transition-all"
                        onClick={() => openBooking(car, "hourly", "12")}
                      >
                        <Timer className="w-4 h-4 mr-2 text-primary" /> 12 Hours
                      </Button>
                    </div>
                    <Button 
                      className="w-full h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/10"
                      onClick={() => openBooking(car, "daily")}
                    >
                      <Calendar className="w-4 h-4 mr-2" /> Book Full Day(s)
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
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Call Us</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 sm:p-4 rounded-full">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">WhatsApp</h4>
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm sm:text-base">
                      Chat with us now <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 sm:p-4 rounded-full">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Our Office</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">Opposite New Bus Stand, Sircilla, Telangana</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 aspect-video sm:h-80 w-full rounded-2xl overflow-hidden border border-border bg-background relative shadow-2xl">
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
        initialRentalType={initialRentalType}
        initialHourlyDuration={initialHourlyDuration}
      />
    </main>
  );
}
