import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}