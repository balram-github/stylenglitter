import { INSTAGRAM_URL, TRACK_ORDER_URL } from "@/constants";
import { InstagramIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-rose-200">
      <div className="container mx-auto pt-8 md:pt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4 pb-6 md:pb-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-base mb-4 md:mb-6">
              About Style Glitter
            </p>
            <p className="mb-6 text-sm">
              Discover trendy fashion accessories and glitter products at Style
              Glitter. Shop our curated collection of stylish items.
            </p>
            <Link href={INSTAGRAM_URL} className="text-rose-500">
              <InstagramIcon />
            </Link>
          </div>
          <div>
            <p className="font-bold text-base mb-4 md:mb-6">Quick Links</p>
            <div className="flex flex-col gap-4 text-sm">
              <Link href="/about-us">About Us</Link>
              <Link href="/contact-us">Contact Us</Link>
              <Link href={TRACK_ORDER_URL} target="_blank">
                Track Order
              </Link>
            </div>
          </div>
          <div>
            <p className="font-bold text-base mb-4 md:mb-6">Store Policies</p>
            <div className="flex flex-col gap-4 text-sm">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/refund-return-policy">Refund & Return Policy</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              <Link href="/terms-of-service">Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <p className="text-center text-xs md:text-base md:text-right py-4 md:py-6 border-t-2 border-black">
          &copy; {new Date().getFullYear()} Style Glitter. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
