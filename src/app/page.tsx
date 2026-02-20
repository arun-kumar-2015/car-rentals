
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
  Wallet
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
    image: PlaceHolderImages.find(img => img.id === "hyundai-creta")?.imageUrl || "https://picsum.photos/seed/1/600/400"
  },
  {
    id: "swift-dzire",
    name: "Swift Dzire",
    pricePerDay: 1800,
    fuel: "Petrol",
    seats: 5,
    transmission: "Manual",
    image: PlaceHolderImages.find(img => img.id === "swift-dzire")?.imageUrl || "https://picsum.photos/seed/2/600/400"
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar",
    pricePerDay: 4500,
    fuel: "Diesel",
    seats: 4,
    transmission: "Manual (4x4)",
    image: PlaceHolderImages.find(img => img.id === "mahindra-thar")?.imageUrl || "https://picsum.photos/seed/3/600/400"
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova Crysta",
    pricePerDay: 5000,
    fuel: "Diesel",
    seats: 7,
    transmission: "Automatic",
    image: PlaceHolderImages.find(img => img.id === "toyota-innova")?.imageUrl || "https://picsum.photos/seed/4/600/400"
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
      <section id="home" className="relative h-screen flex items-center overflow-hidden bg-black">
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
            <h1 className="text-5xl md:text-7xl font-headline font-black text-foreground mb-6 leading-tight uppercase animate-in slide-in-from-left duration-700 delay-100">
              Arun Car <span className="text-primary yellow-glow">Rentals</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-lg leading-relaxed animate-in slide-in-from-left duration-700 delay-200">
              Drive Your Dream Car Today. Experience premium comfort and reliability at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-left duration-700 delay-300">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full" asChild>
                <Link href="#cars">Book Now <ChevronRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-primary/50 hover:bg-primary/10" asChild>
                <Link href="#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Why Us Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Insured Cars</h3>
                <p className="text-sm text-muted-foreground">Full peace of mind</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Always here for you</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Easy Payments</h3>
                <p className="text-sm text-muted-foreground">Multiple options</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Modern Fleet</h3>
                <p className="text-sm text-muted-foreground">Well maintained</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cars Section */}
      <section id="cars" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-black mb-4 uppercase">
              Our <span className="text-primary">Fleet</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our selection of premium, well-maintained vehicles tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CARS.map((car) => (
              <div key={car.id} className="premium-card rounded-2xl overflow-hidden flex flex-col h-full group">
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint="car model"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground font-bold">₹{car.pricePerDay}/day</Badge>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-y-3 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary" /> {car.fuel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> {car.seats} Seats
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> {car.transmission}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-auto font-bold uppercase tracking-wider"
                    onClick={() => openBooking(car)}
                  >
                    Book This Car
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-headline font-black mb-6 uppercase">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Have questions? Our team is available 24/7 to assist you with your rental needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp</h4>
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                      Chat with us now <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-4 rounded-full">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Our Office</h4>
                    <p className="text-muted-foreground">123 Luxury Lane, High Street, Mumbai - 400001</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-10 h-64 w-full rounded-2xl overflow-hidden border border-border bg-background relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <p className="flex flex-col items-center gap-2">
                    <MapPin className="w-8 h-8" />
                    Google Maps Integration Here
                  </p>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.597330545934!2d72.825833!3d18.948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU2JzUyLjgiTiA3MsKwNDknMzMuMCJF!5e0!3m2!1sen!2sin!4v1614123456789!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="bg-background p-8 rounded-3xl border border-border">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your full name" className="bg-secondary/30 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email / Phone</label>
                  <Input placeholder="How can we reach you?" className="bg-secondary/30 border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Tell us about your requirements" className="min-h-[150px] bg-secondary/30 border-border" />
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
            
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Arun Car Rentals. All rights reserved.
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
