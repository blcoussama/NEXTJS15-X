import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode; // Note: modal isn’t used here, but kept for compatibility
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}