
"use client";

import Link from "next/link";
import { Car, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight text-foreground uppercase">
                Arun <span className="text-primary">Rentals</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#home" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link href="#cars" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Available Cars</Link>
              <Link href="#contact" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Contact</Link>
              <Link href="/admin/login" className="flex items-center gap-1 text-foreground/60 hover:text-primary px-3 py-2 text-xs font-medium transition-colors border-l border-border ml-4">
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#home" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">Home</Link>
            <Link href="#cars" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">Available Cars</Link>
            <Link href="#contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">Contact</Link>
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-primary hover:bg-secondary rounded-md">Admin Portal</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
