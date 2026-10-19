import type { Metadata } from "next";
import { Bitter, Work_Sans } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const display = Bitter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

const sans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap"
});

const hotelName = process.env.NEXT_PUBLIC_HOTEL_NAME ?? "Hotel El Tormo";

export const metadata: Metadata = {
  title: `${hotelName} | Serranía de Cuenca`,
  description:
    "Alojamiento boutique y rural en la Serranía de Cuenca. Reserva directa sin comisiones, desayuno incluido y atención por WhatsApp."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
