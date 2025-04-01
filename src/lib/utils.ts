import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number, decimals: number = 6): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) return '0.00'
  
  // For very small numbers, show more decimals
  if (Math.abs(num) < 0.01 && num !== 0) {
    return num.toFixed(decimals)
  }
  
  // For regular numbers, format with 2-4 decimals based on size
  if (Math.abs(num) >= 1000) {
    return num.toFixed(2)
  } else if (Math.abs(num) >= 1) {
    return num.toFixed(4)
  } else {
    return num.toFixed(6)
  }
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2) return address
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
