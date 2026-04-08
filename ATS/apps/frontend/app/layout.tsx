import type { ReactNode } from "react";

export const metadata = {
  title: "LTI ATS",
  description: "Applicant Tracking System"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
