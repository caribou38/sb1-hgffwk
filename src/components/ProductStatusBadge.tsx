import React from 'react';
import { Baby, AlertTriangle, X } from 'lucide-react';
import { Product } from '../types/Product';

type PregnancyStatus = NonNullable<Product['pregnancy_status']>;

interface ProductStatusBadgeProps {
  status: PregnancyStatus;
}

const statusConfig = {
  authorized: {
    icon: Baby,
    color: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'Autorisé pendant la grossesse'
  },
  not_recommended: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    text: 'Déconseillé pendant la grossesse'
  },
  forbidden: {
    icon: X,
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'Interdit pendant la grossesse'
  }
} as const;

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg ${config.bg} ${config.color} ${config.border} border shadow-sm`}>
      <StatusIcon size={20} className="mr-2" />
      <span className="font-semibold">{config.text}</span>
    </div>
  );
};