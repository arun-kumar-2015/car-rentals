
"use client";

import { useState, useMemo, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, User, Phone, IdCard, MapPin } from "lucide-react";

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
    return (car?.pricePerDay || 0) * totalDays;
  }, [car, totalDays]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Calendar className="w-3 h-3" /> Pickup Date
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
              <span className="text-sm text-muted-foreground">Rate:</span>
              <span className="font-semibold">₹{car?.pricePerDay} / day</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="font-semibold">{totalDays} Day(s)</span>
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
