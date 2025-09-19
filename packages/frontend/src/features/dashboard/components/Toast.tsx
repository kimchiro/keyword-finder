import React from 'react';
import { useToastTimer } from './hooks/useToastTimer';
import { ToastContainer, ToastMessage, ToastIcon } from '../styles/ToastStyles';
import { ToastProps } from './types/ToastTypes';

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useToastTimer({ isVisible, onClose, duration });

  if (!isVisible) return null;

  return (
    <ToastContainer>
      <ToastIcon>✓</ToastIcon>
      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
};
