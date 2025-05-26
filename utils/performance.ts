"use client"

import type React from "react"

import { useMemo, useCallback, useRef } from "react"

// Debounce hook for expensive operations
export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  ) as T
}

// Memoized array operations
export function useMemoizedFilter<T>(array: T[], predicate: (item: T) => boolean, deps: React.DependencyList): T[] {
  return useMemo(() => array.filter(predicate), [array, ...deps])
}

export function useMemoizedSort<T>(array: T[], compareFn: (a: T, b: T) => number, deps: React.DependencyList): T[] {
  return useMemo(() => [...array].sort(compareFn), [array, ...deps])
}

// Stable callback hook
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}
