import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskData(value: string, role?: string) {
  if (role === 'COMPANY') {
    return '*** PROTEGIDO ***';
  }
  return value;
}
