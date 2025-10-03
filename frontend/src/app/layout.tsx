import { ThemeProvider } from '@/components/providers/ThemeProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email AI System',
  description: 'Unified AI-Powered Email Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
