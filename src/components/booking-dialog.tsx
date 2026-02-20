
"use client";

import { useState, useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
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
      // 6 hours = 40% of daily rate, 12 hours = 70% of daily rate
      const factor = formData.hourlyDuration === "6" ? 0.4 : 0.7;
      return Math.round(car.pricePerDay * factor);
    }
  }, [car, totalDays, formData.rentalType, formData.hourlyDuration]);

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
      <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            Book <span className="text-primary">{car?.name}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete the form below to reserve your vehicle.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleBooking} className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Rental Plan</Label>
            <RadioGroup 
              value={formData.rentalType} 
              onValueChange={(val) => setFormData(p => ({ ...p, rentalType: val as any }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily Rental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly">Hourly Rental</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Calendar className="w-3 h-3" /> {formData.rentalType === "daily" ? "Pickup Date" : "Booking Date"}
              </Label>
              <Input 
                type="date" 
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
                className="bg-background border-border focus:ring-primary"
              />
            </div>
            
            {formData.rentalType === "daily" ? (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Calendar className="w-3 h-3" /> Return Date
                </Label>
                <Input 
                  type="date" 
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Clock className="w-3 h-3" /> Duration
                </Label>
                <RadioGroup 
                  value={formData.hourlyDuration} 
                  onValueChange={(val) => setFormData(p => ({ ...p, hourlyDuration: val as any }))}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6" id="6hrs" />
                    <Label htmlFor="6hrs">6 Hrs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="12hrs" />
                    <Label htmlFor="12hrs">12 Hrs</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <User className="w-3 h-3" /> Full Name
              </Label>
              <Input 
                placeholder="Enter your name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="bg-background border-border focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Phone className="w-3 h-3" /> Phone Number
                </Label>
                <Input 
                  placeholder="+91 00000 00000"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <IdCard className="w-3 h-3" /> License Number
                </Label>
                <Input 
                  placeholder="DL-XXXXXXXXXXXX"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <MapPin className="w-3 h-3" /> Pickup Location
              </Label>
              <Input 
                placeholder="Area/City for pickup"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                className="bg-background border-border focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Daily Base Rate:</span>
              <span className="font-semibold">₹{car?.pricePerDay} / day</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Selected Plan:</span>
              <span className="font-semibold capitalize">{formData.rentalType}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="font-semibold">
                {formData.rentalType === "daily" ? `${totalDays} Day(s)` : `${formData.hourlyDuration} Hours`}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Price:</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-headline font-bold" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
