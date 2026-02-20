
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, User, Phone, IdCard, MapPin, Clock } from "lucide-react";

interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
  frontImage: string;
  leftImage: string;
}

interface BookingDialogProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDialog({ car, isOpen, onClose }: BookingDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    licenseNumber: "",
    pickupLocation: "",
    rentalType: "daily" as "daily" | "hourly",
    hourlyDuration: "6" as "6" | "12",
    pickupDate: format(new Date(), "yyyy-MM-dd"),
    returnDate: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
  });

  const totalDays = useMemo(() => {
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const days = differenceInDays(end, start);
    return days > 0 ? days : 1;
  }, [formData.pickupDate, formData.returnDate]);

  const totalAmount = useMemo(() => {
    if (!car) return 0;
    if (formData.rentalType === "daily") {
      return car.pricePerDay * totalDays;
    } else {
      const factor = formData.hourlyDuration === "6" ? 0.4 : 0.7;
      return Math.round(car.pricePerDay * factor);
    }
  }, [car, totalDays, formData.rentalType, formData.hourlyDuration]);

  const carImages = useMemo(() => {
    if (!car) return [];
    return [
      { label: "Exterior", url: car.image },
      { label: "Front View", url: car.frontImage },
      { label: "Side View", url: car.leftImage },
    ];
  }, [car]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...formData,
        carName: car.name,
        totalAmount,
        status: "Pending",
        timestamp: serverTimestamp(),
        durationLabel: formData.rentalType === "daily" ? `${totalDays} Day(s)` : `${formData.hourlyDuration} Hours`,
      });
      
      toast({
        title: "Booking Successful!",
        description: "We will contact you shortly to confirm your booking.",
      });
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-card text-foreground border-border max-h-[95vh] overflow-y-auto p-0 gap-0">
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {carImages.map((img, idx) => (
                <CarouselItem key={idx} className="relative aspect-video">
                  <Image 
                    src={img.url} 
                    alt={`${car?.name} ${img.label}`} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-black/60 text-white border-none">{img.label}</Badge>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline flex items-center justify-between">
              <div>Book <span className="text-primary">{car?.name}</span></div>
              <div className="text-xl text-primary font-bold">₹{car?.pricePerDay}<span className="text-sm text-muted-foreground">/day</span></div>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              Complete the form below to reserve your vehicle from our premium fleet.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBooking} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rental Plan</Label>
              <RadioGroup 
                value={formData.rentalType} 
                onValueChange={(val) => setFormData(p => ({ ...p, rentalType: val as any }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" className="border-primary text-primary" />
                  <Label htmlFor="daily" className="cursor-pointer font-semibold">Daily Rental</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" className="border-primary text-primary" />
                  <Label htmlFor="hourly" className="cursor-pointer font-semibold">Hourly Rental</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {formData.rentalType === "daily" ? "Pickup Date" : "Booking Date"}
                </Label>
                <Input 
                  type="date" 
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  required
                  className="bg-background border-border h-11 focus:ring-primary"
                />
              </div>
              
              {formData.rentalType === "daily" ? (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Return Date
                  </Label>
                  <Input 
                    type="date" 
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    required
                    className="bg-background border-border h-11 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Duration
                  </Label>
                  <RadioGroup 
                    value={formData.hourlyDuration} 
                    onValueChange={(val) => setFormData(p => ({ ...p, hourlyDuration: val as any }))}
                    className="flex gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6" id="6hrs" />
                      <Label htmlFor="6hrs" className="cursor-pointer">6 Hrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12" id="12hrs" />
                      <Label htmlFor="12hrs" className="cursor-pointer">12 Hrs</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <User className="w-3.5 h-3.5 text-primary" /> Full Name
                </Label>
                <Input 
                  placeholder="Enter your name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="bg-background border-border h-11 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                  </Label>
                  <Input 
                    placeholder="+91 00000 00000"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-background border-border h-11 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <IdCard className="w-3.5 h-3.5 text-primary" /> License Number
                  </Label>
                  <Input 
                    placeholder="DL-XXXXXXXXXXXX"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    className="bg-background border-border h-11 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Pickup Location
                </Label>
                <Input 
                  placeholder="Area/City for pickup"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  className="bg-background border-border h-11 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-secondary/40 p-5 rounded-2xl border border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Selected Plan:</span>
                <span className="font-bold capitalize">{formData.rentalType} Rental</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Booking Duration:</span>
                <span className="font-bold">
                  {formData.rentalType === "daily" ? `${totalDays} Day(s)` : `${formData.hourlyDuration} Hours`}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Price:</span>
                <span className="text-3xl font-black text-primary">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-xl font-headline font-black uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Confirm Reservation"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
