import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const typeClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function Alert({ type, title, message, className = '' }: AlertProps) {
  return (
    <div className={`flex items-start p-4 rounded-lg border ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3">
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}