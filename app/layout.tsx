import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import { Footer } from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExchangGo24 - Real-time Currency Exchange Rate Comparison",
  description:
    "ExchangGo24 is a real-time currency exchange rate comparison platform with an additional bidding system for exchange offices. Compare rates, receive WhatsApp alerts, and find the best exchange deals in your area.",
  keywords: [
    "currency exchange",
    "exchange rates",
    "real-time comparison",
    "exchange offices",
    "currency converter",
    "money exchange",
    "exchange rate alerts",
    "bidding system",
    "local exchange rates",
  ],
  openGraph: {
    title: "ExchangGo24 - Real-time Currency Exchange Rate Comparison",
    description:
      "Compare real-time exchange rates, receive rate alerts, and find the best currency exchange deals in your area. Connect with local exchange offices for competitive rates.",
    type: "website",
    locale: "en_US",
    siteName: "ExchangGo24",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExchangGo24 - Real-time Currency Exchange Rate Comparison",
    description:
      "Compare real-time exchange rates, receive rate alerts, and find the best currency exchange deals in your area. Connect with local exchange offices for competitive rates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${plusJakarta.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* <Navbar /> */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
