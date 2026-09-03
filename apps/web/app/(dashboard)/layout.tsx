'use client';

import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import AuthGuard from '@/components/auth/AuthGuard';
import { AuthStoreProvider } from '@/lib/providers/auth-store-provider';
import ModalProvider from '@/lib/providers/modal-provider';

import '@/app/globals.css';

const AppLayout = dynamic(() => import('@/layouts/AppLayout'), { ssr: false });

const inter = Inter();

interface DashboardLayoutProps extends PropsWithChildren {}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <title>Taskify</title>
      <meta
        name="description"
        content="A simple and powerful task management app to organize your work, track progress, and boost productivity every day."
      />
    </head>
    <body className={inter.className}>
      <AuthStoreProvider>
        <ModalProvider>
          <AuthGuard mode="auth">
            <AppLayout>{children}</AppLayout>
          </AuthGuard>
        </ModalProvider>
      </AuthStoreProvider>

      {/* decoupled elements for rendering modals and backdrops through portal */}
      <div id="modal"></div>
      <div id="backdrop"></div>
    </body>
  </html>
);

export default DashboardLayout;
