import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'text-green-600';
    case 'offline':
      return 'text-red-600';
    case 'warning':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}

export function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'online':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'offline':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'warning':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getDeviceIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('laptop')) {
    return 'laptop';
  } else if (lowerName.includes('server')) {
    return 'server';
  } else {
    return 'desktop';
  }
}
