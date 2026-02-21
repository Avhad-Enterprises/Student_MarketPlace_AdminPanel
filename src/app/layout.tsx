import { Toaster } from "sonner";
import "../styles/globals.css";

export const metadata = {
  title: "Student Marketplace",
  description: "Frontend scaffold for Student Marketplace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
