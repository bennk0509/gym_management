import Navbar from "@/components/public/Navbar";
import "./globals.css"
import { Inter, Poppins, Bebas_Neue } from "next/font/google"
import Footer from "@/components/public/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // body
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"], // headings
  variable: "--font-heading",
})

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-branding",
  weight: ["400"]
});


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body
        className={`${bebas_neue.variable} ${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
