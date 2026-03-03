
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { format, differenceInDays, addDays, parseISO } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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
import { 
  Loader2, 
  Calendar, 
  User, 
  Phone, 
  IdCard, 
  MapPin, 
  Clock, 
  Timer, 
  Check, 
  Plus, 
  Minus, 
  MessageSquare, 
  PartyPopper,
  Camera,
  X
} from "lucide-react";
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
}

export function BookingDialog({ 
  car, 
  isOpen, 
  onClose, 
  initialRentalType = "daily"
}: BookingDialogProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    licenseNumber: "",
    pickupLocation: "",
    rentalType: initialRentalType,
    hourlyDuration: "6" as "6" | "12",
    pickupDate: format(new Date(), "yyyy-MM-dd"),
    returnDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setLicensePhoto(null);
      setFormData(prev => ({
        ...prev,
        rentalType: initialRentalType,
        pickupDate: format(new Date(), "yyyy-MM-dd"),
        returnDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      }));
    }
  }, [isOpen, initialRentalType]);

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

  const durationLabel = useMemo(() => {
    return formData.rentalType === "daily" ? `${totalDays} Day(s)` : `${formData.hourlyDuration} Hours`;
  }, [formData.rentalType, totalDays, formData.hourlyDuration]);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !db) return;

    if (!licensePhoto) {
      toast({
        variant: "destructive",
        title: "Photo Required",
        description: "Please upload a photo of your driving license.",
      });
      return;
    }

    setLoading(true);
    try {
      addDocumentNonBlocking(collection(db, "bookings"), {
        ...formData,
        carId: car.id,
        carName: car.name,
        totalAmount,
        status: "Pending",
        timestamp: serverTimestamp(),
        durationLabel,
        licensePhotoUrl: licensePhoto,
      });
      
      toast({
        title: "Booking Submitted",
        description: "Your request has been recorded.",
      });
      setIsSuccess(true);
    } catch (error) {
      // Handled by non-blocking error emitter
    } finally {
      setLoading(false);
    }
  };

  const notifyViaWhatsApp = () => {
    const ownerNumber = "919876543210";
    const message = `*NEW CAR BOOKING*%0A------------------%0A*Car:* ${car?.name}%0A*Customer:* ${formData.customerName}%0A*Phone:* ${formData.phoneNumber}%0A*Plan:* ${durationLabel}%0A*Pickup:* ${formData.pickupDate}%0A*Amount:* ₹${totalAmount}%0A*Location:* ${formData.pickupLocation}%0A*License Photo:* Attached in portal%0A------------------%0APlease confirm the booking.`;
    window.open(`https://wa.me/${ownerNumber}?text=${message}`, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
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
        {!isSuccess ? (
          <>
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
                        <Badge variant="secondary" className="bg-black/60 text-white border-none font-bold uppercase tracking-widest text-[10px]">{img.label}</Badge>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Carousel>
            </div>

            <div className="p-6">
              <DialogHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl sm:text-3xl font-headline uppercase font-black tracking-tight">
                    {car?.name}
                  </DialogTitle>
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl text-primary font-black yellow-glow">₹{totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Est. Total</div>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs 
                value={formData.rentalType} 
                className="w-full"
                onValueChange={(val) => setFormData(p => ({ ...p, rentalType: val as any }))}
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-secondary/50 p-1.5 rounded-xl border border-border">
                  <TabsTrigger 
                    value="daily" 
                    className="font-black uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Full Day(s)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hourly" 
                    className="font-black uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-black rounded-lg transition-all gap-2"
                  >
                    <Clock className="w-4 h-4" /> Hourly
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleBooking} className="space-y-8">
                  <TabsContent value="daily" className="mt-0 space-y-6">
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">How many Days?</Label>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Use +/- to set duration</p>
                      </div>
                      <div className="flex items-center gap-6 bg-background p-3 rounded-xl border border-border self-end sm:self-auto shadow-sm">
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
                          <Calendar className="w-3 h-3 text-primary" /> Pickup Date
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
                          <Calendar className="w-3 h-3 text-primary" /> Return Date
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
                  </TabsContent>

                  <TabsContent value="hourly" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        <Timer className="w-4 h-4" /> Select Plan (6 or 12 Hours)
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {["6", "12"].map((hrs) => (
                          <button
                            key={hrs}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, hourlyDuration: hrs as any }))}
                            className={cn(
                              "relative h-20 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1",
                              formData.hourlyDuration === hrs 
                                ? "bg-primary/10 border-primary text-primary shadow-[0_0_25px_rgba(255,234,0,0.2)] scale-[1.02]" 
                                : "bg-secondary/20 text-muted-foreground border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-2xl leading-none">{hrs}</span>
                            <span className="text-[10px] uppercase tracking-widest">Hours</span>
                            {formData.hourlyDuration === hrs && (
                              <div className="absolute -top-2 -right-2 bg-primary text-black rounded-full p-1 shadow-lg">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Calendar className="w-3 h-3 text-primary" /> Pickup Date
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
                  </TabsContent>

                  <div className="space-y-5 pt-4 border-t border-border">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <User className="w-3 h-3 text-primary" /> Your Full Name
                      </Label>
                      <Input 
                        placeholder="Enter your name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                          <Phone className="w-3 h-3 text-primary" /> Contact Number
                        </Label>
                        <Input 
                          placeholder="+91 00000 00000"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                          <IdCard className="w-3 h-3 text-primary" /> Driving License Number
                        </Label>
                        <Input 
                          placeholder="DL-XXXXXXXXXXXX"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          required
                          className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Driving License Photo moved here, above Pickup Location */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <Camera className="w-3 h-3 text-primary" /> Driving License Photo
                      </Label>
                      <div className="relative group/photo">
                        {licensePhoto ? (
                          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/30 group">
                            <Image src={licensePhoto} alt="License Preview" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => setLicensePhoto(null)}
                              className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border bg-secondary/20 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all">
                            <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs font-bold uppercase text-muted-foreground">Upload License Photo</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePhotoUpload} 
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                        <MapPin className="w-3 h-3 text-primary" /> Pickup Location
                      </Label>
                      <Input 
                        placeholder="E.g. Sircilla Bus Stand"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                        className="bg-background border-border h-12 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex justify-between items-center shadow-inner">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Booking Plan</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary text-black font-black text-[11px] px-3 py-1">
                          {durationLabel}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary yellow-glow">₹{totalAmount.toLocaleString()}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Estimate</div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-16 text-xl font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all" disabled={loading}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Confirm My Ride"}
                  </Button>
                </form>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="p-10 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="bg-primary/20 p-6 rounded-full">
              <PartyPopper className="w-16 h-16 text-primary animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Booking Successful!</h2>
              <p className="text-muted-foreground text-sm font-medium">
                Your request for the <strong>{car?.name}</strong> has been received. 
                Please notify the owner via WhatsApp to confirm instantly.
              </p>
            </div>
            
            <div className="w-full space-y-4">
              <Button 
                onClick={notifyViaWhatsApp} 
                className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-600/20 flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-6 h-6" /> Notify Owner on WhatsApp
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full h-12 font-bold uppercase tracking-widest rounded-xl border-border">
                Close & Return
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
