import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <body>
            { children }
        </body>
    </ClerkProvider>
  );
}
