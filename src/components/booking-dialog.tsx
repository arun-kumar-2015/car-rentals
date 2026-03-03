
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { format, differenceInDays, addDays, parseISO } from "date-fns";
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
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  useFirestore, 
  addDocumentNonBlocking 
} from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, User, Phone, IdCard, MapPin, Clock, Timer, Check, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  initialRentalType?: "daily" | "hourly";
  initialHourlyDuration?: "6" | "12";
}

export function BookingDialog({ 
  car, 
  isOpen, 
  onClose, 
  initialRentalType = "daily", 
  initialHourlyDuration = "6" 
}: BookingDialogProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    licenseNumber: "",
    pickupLocation: "",
    rentalType: initialRentalType,
    hourlyDuration: initialHourlyDuration,
    pickupDate: format(new Date(), "yyyy-MM-dd"),
    returnDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
  });

  // Reset form data when dialog opens with initial values
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        rentalType: initialRentalType,
        hourlyDuration: initialHourlyDuration,
        pickupDate: format(new Date(), "yyyy-MM-dd"),
        returnDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      }));
    }
  }, [isOpen, initialRentalType, initialHourlyDuration]);

  const totalDays = useMemo(() => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const start = parseISO(formData.pickupDate);
    const end = parseISO(formData.returnDate);
    const diff = differenceInDays(end, start);
    return diff >= 0 ? diff + 1 : 1;
  }, [formData.pickupDate, formData.returnDate]);

  const handleDayChange = (delta: number) => {
    const newDays = Math.max(1, totalDays + delta);
    const start = parseISO(formData.pickupDate);
    const newReturnDate = addDays(start, newDays - 1);
    setFormData(prev => ({
      ...prev,
      returnDate: format(newReturnDate, "yyyy-MM-dd")
    }));
  };

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
    if (!car || !db) return;

    setLoading(true);
    try {
      addDocumentNonBlocking(collection(db, "bookings"), {
        ...formData,
        carId: car.id,
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
      // Error handling by non-blocking pattern
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // If pickup date changes, ensure return date is at least the same day
      if (name === "pickupDate") {
        const start = parseISO(value);
        const end = parseISO(prev.returnDate);
        if (differenceInDays(end, start) < 0) {
          updated.returnDate = value;
        }
      }
      return updated;
    });
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
                    unoptimized={img.url.includes('picsum.photos')}
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
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl sm:text-3xl font-headline uppercase font-black tracking-tight">
                {car?.name}
              </DialogTitle>
              <div className="text-right">
                <div className="text-lg sm:text-xl text-primary font-black">₹{totalAmount.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Estimated Total</div>
              </div>
            </div>
            <DialogDescription className="text-muted-foreground text-sm">
              Confirm your rental details for the {formData.rentalType} plan.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            value={formData.rentalType} 
            className="w-full"
            onValueChange={(val) => setFormData(p => ({ ...p, rentalType: val as any }))}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-secondary/50 p-1.5 rounded-xl">
              <TabsTrigger 
                value="daily" 
                className="font-black uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all"
              >
                <Calendar className="w-4 h-4 mr-2" /> Daily Plan
              </TabsTrigger>
              <TabsTrigger 
                value="hourly" 
                className="font-black uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all"
              >
                <Clock className="w-4 h-4 mr-2" /> Hourly Plan
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleBooking} className="space-y-8">
              {formData.rentalType === "daily" ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-black uppercase tracking-widest text-primary">Number of Days</Label>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Click + to add more days</p>
                    </div>
                    <div className="flex items-center gap-6 bg-background p-3 rounded-xl border border-border self-end sm:self-auto">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-lg border-primary/30 hover:bg-primary/10 transition-colors"
                        onClick={() => handleDayChange(-1)}
                      >
                        <Minus className="w-5 h-5 text-primary" />
                      </Button>
                      <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="font-black text-2xl leading-none">{totalDays}</span>
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Days</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-lg border-primary/30 hover:bg-primary/10 transition-colors"
                        onClick={() => handleDayChange(1)}
                      >
                        <Plus className="w-5 h-5 text-primary" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Calendar className="w-3 h-3 text-primary" /> Start Date
                      </Label>
                      <Input 
                        type="date" 
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Calendar className="w-3 h-3 text-primary" /> End Date
                      </Label>
                      <Input 
                        type="date" 
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        min={formData.pickupDate}
                        className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Calendar className="w-3 h-3 text-primary" /> Booking Date
                      </Label>
                      <Input 
                        type="date" 
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Timer className="w-3 h-3 text-primary" /> Select Hours
                      </Label>
                      <div className="flex gap-3">
                        {["6", "12"].map((hrs) => (
                          <button
                            key={hrs}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, hourlyDuration: hrs as any }))}
                            className={cn(
                              "flex-1 h-12 rounded-lg border font-black text-xs transition-all flex items-center justify-center gap-2",
                              formData.hourlyDuration === hrs 
                                ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" 
                                : "bg-secondary/30 text-muted-foreground border-border hover:border-primary/50"
                            )}
                          >
                            {hrs} HRS {formData.hourlyDuration === hrs && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5 pt-2 border-t border-border/50">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    <User className="w-3 h-3 text-primary" /> Full Name
                  </Label>
                  <Input 
                    placeholder="Enter your name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                      <Phone className="w-3 h-3 text-primary" /> Phone Number
                    </Label>
                    <Input 
                      placeholder="+91 00000 00000"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                      <IdCard className="w-3 h-3 text-primary" /> License Number
                    </Label>
                    <Input 
                      placeholder="DL-XXXXXXXXXXXX"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    <MapPin className="w-3 h-3 text-primary" /> Pickup Location
                  </Label>
                  <Input 
                    placeholder="Area/City for pickup"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                    className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rental Summary</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary uppercase font-black text-[10px]">
                      {formData.rentalType}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary text-black font-black text-[10px]">
                      {formData.rentalType === "daily" ? `${totalDays} Day(s)` : `${formData.hourlyDuration} Hours`}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  {formData.rentalType === "daily" && totalDays > 0 && (
                    <div className="text-[10px] text-muted-foreground font-bold mb-1">
                      {totalDays} Day(s) x ₹{car?.pricePerDay.toLocaleString()}
                    </div>
                  )}
                  <div className="text-2xl font-black text-primary yellow-glow">₹{totalAmount.toLocaleString()}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Final Price</div>
                </div>
              </div>

              <Button type="submit" className="w-full h-16 text-xl font-black uppercase tracking-[0.15em] rounded-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all" disabled={loading}>
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Confirm My Booking"}
              </Button>
            </form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
