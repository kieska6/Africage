import React from 'react';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}