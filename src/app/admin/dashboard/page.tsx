
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { 
  useAuth, 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from "@/firebase";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Loader2, 
  MoreVertical, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Calendar, 
  User, 
  Phone, 
  Car as CarIcon, 
  Wallet,
  Timer,
  Bell,
  Camera,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  licenseNumber: string;
  licensePhotoUrl?: string;
  carName: string;
  pickupDate: string;
  returnDate?: string;
  rentalType: "daily" | "hourly";
  durationLabel: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed";
  timestamp: any;
}

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const prevBookingsCount = useRef<number>(0);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "bookings"), orderBy("timestamp", "desc"));
  }, [db, user]);

  const { data: bookingsData, isLoading: isBookingsLoading } = useCollection<Booking>(bookingsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (bookingsData && bookingsData.length > prevBookingsCount.current) {
      if (prevBookingsCount.current !== 0) {
        const latest = bookingsData[0];
        toast({
          title: "New Booking Received!",
          description: `${latest.customerName} just booked ${latest.carName}.`,
          duration: 10000,
        });
      }
      prevBookingsCount.current = bookingsData.length;
    }
  }, [bookingsData, toast]);

  const updateStatus = (id: string, newStatus: Booking["status"]) => {
    const docRef = doc(db, "bookings", id);
    updateDocumentNonBlocking(docRef, { status: newStatus });
    toast({ title: "Status Updated", description: `Booking is now ${newStatus}.` });
  };

  const deleteBooking = (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const docRef = doc(db, "bookings", id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Booking Deleted", description: "The record has been removed." });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Completed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  if (isUserLoading || (user && isBookingsLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const bookings = bookingsData || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-headline font-bold uppercase tracking-tight flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md shrink-0"><CarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black" /></div>
            <span className="hidden sm:inline">Admin</span> Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20">
              <Bell className="w-3 h-3" /> Live Notifications On
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive h-9">
              <LogOut className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Bookings</CardTitle>
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <Wallet className="w-3.5 h-3.5 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold text-primary">₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold">{bookings.filter(b => b.status === "Pending").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 space-y-0 px-4 pt-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold">{bookings.filter(b => b.status === "Confirmed").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto touch-pan-x">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="min-w-[150px]">Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead className="hidden sm:table-cell">Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-border group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1 text-sm"><User className="w-3 h-3" /> {booking.customerName}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium flex items-center gap-1 w-fit bg-secondary/30 text-[10px] px-1.5 py-0">
                          {booking.carName}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {booking.rentalType === "hourly" ? (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                              <Timer className="w-3 h-3 mr-1" /> {booking.durationLabel}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" /> {booking.durationLabel}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-[10px] sm:text-xs space-y-0.5">
                          <div className="flex items-center gap-1"><span className="text-primary hidden sm:inline">Date:</span> {booking.pickupDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium text-muted-foreground">{booking.licenseNumber}</span>
                          {booking.licensePhotoUrl && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider gap-1.5">
                                  <Camera className="w-3 h-3" /> View Photo
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] bg-card border-border">
                                <DialogHeader>
                                  <DialogTitle className="uppercase font-black text-lg">{booking.customerName}'s License</DialogTitle>
                                </DialogHeader>
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border mt-4">
                                  <Image 
                                    src={booking.licensePhotoUrl} 
                                    alt="Driving License" 
                                    fill 
                                    className="object-contain" 
                                  />
                                </div>
                                <div className="flex justify-end mt-4">
                                  <Button asChild variant="secondary" size="sm">
                                    <a href={booking.licensePhotoUrl} download={`license_${booking.customerName}.png`} className="flex items-center gap-2">
                                      <Download className="w-4 h-4" /> Download Photo
                                    </a>
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(booking.status)} text-[10px] px-1.5 py-0`}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Confirmed")}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Completed")}>
                              <CarIcon className="w-4 h-4 mr-2 text-blue-500" /> Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Pending")}>
                              <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Pending
                            </DropdownMenuItem>
                            <div className="h-px bg-border my-1" />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteBooking(booking.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
