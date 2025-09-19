'use client';

import { useEffect } from 'react';

interface UseToastTimerProps {
  isVisible: boolean;
  onClose: () => void;
  duration: number;
}

export const useToastTimer = ({ isVisible, onClose, duration }: UseToastTimerProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
};
