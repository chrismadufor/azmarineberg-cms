import { AppProvider } from "@/redux/provider";
import "./globals.css";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import Toast from "@/components/Toast";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"], // Customize as needed
});

export const metadata = {
  title: "Azmarineberg CRM Portal",
  description: "Create and manage your requests for Azmarineberg easily.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${poppins.variable} antialiased`}
    >
      <body>
        <AppProvider>
          {children}
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
