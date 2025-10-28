import { Poppins, Oswald } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"; // ✅ correct import path

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata = {
  title: "OnClick PDF - Convert PDF to DOCX Instantly",
  description:
    "Transform your PDF documents to DOCX format in seconds. Fast, secure, and reliable conversion with professional results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${oswald.variable} antialiased font-poppins`}
      >
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
          <Navigation />
          <main className="flex-1 p-4 md:p-3 lg:p-0">{children}</main>

          <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-12">
            <div className="max-w-6xl mx-auto text-center">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    OnClick PDF
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Professional PDF to DOCX conversion made simple and secure.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    Features
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• Instant Conversion</li>
                    <li>• Secure Processing</li>
                    <li>• High Quality Output</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    Support
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• 24/7 Available</li>
                    <li>• No Registration</li>
                    <li>• Free to Use</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-8">
                <p className="text-slate-400 text-sm">
                  © 2024 OnClick PDF. Powered by ConvertAPI • Secure and Fast
                  Conversion
                </p>
              </div>
            </div>
          </footer>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              fontFamily: "var(--font-poppins)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
              },
            },
          }}
        />

        {/* ✅ Place Analytics here */}
        <Analytics />
      </body>
    </html>
  );
}