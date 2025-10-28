import type { Metadata } from "next";
import "./globals.css"
import { Inter, Poppins } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // body
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"], // headings
  variable: "--font-heading",
})

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
