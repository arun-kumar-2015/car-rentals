
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  licenseNumber: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed";
  timestamp: any;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
    });

    const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Fetch error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBookings();
    };
  }, [router]);

  const updateStatus = async (id: string, newStatus: Booking["status"]) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      toast({ title: "Status Updated", description: `Booking is now ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast({ title: "Booking Deleted", description: "The record has been removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete booking." });
    }
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-headline font-bold uppercase tracking-tight flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md"><CarIcon className="w-5 h-5 text-black" /></div>
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <Wallet className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === "Pending").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === "Confirmed").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[200px]">Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-border group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1"><User className="w-3 h-3" /> {booking.customerName}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium flex items-center gap-1 w-fit bg-secondary/30">
                          <CarIcon className="w-3 h-3" /> {booking.carName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-0.5">
                          <div className="flex items-center gap-1"><span className="text-primary">Pick:</span> {booking.pickupDate}</div>
                          <div className="flex items-center gap-1"><span className="text-primary">Ret:</span> {booking.returnDate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">₹{booking.totalAmount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Confirmed")}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Confirm Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Completed")}>
                              <CarIcon className="w-4 h-4 mr-2 text-blue-500" /> Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, "Pending")}>
                              <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Set to Pending
                            </DropdownMenuItem>
                            <div className="h-px bg-border my-1" />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteBooking(booking.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
