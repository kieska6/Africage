import { X } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  title?: string;
  className?: string;
}

export function Alert({ type, message, title, className = '' }: AlertProps) {
  const baseClasses = 'p-4 rounded-lg border';
  
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconClasses = {
    error: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'error' && (
            <X className={`h-5 w-5 ${iconClasses[type]}`} />
          )}
          {type === 'success' && (
            <svg className={`h-5 w-5 ${iconClasses[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className={`h-5 w-5 ${iconClasses[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className={`h-5 w-5 ${iconClasses[type]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}