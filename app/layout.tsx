import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/providers/modal-provider';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import { EdgeStoreProvider } from '@/lib/edgestore';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jottit',
  description:
    'Jottit is the perfect workspace to jott down your work better and faster!',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
              storageKey='jottit-theme'
            >
              <Toaster position='bottom-center' />
              <ModalProvider />
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
