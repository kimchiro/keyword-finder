import { useState } from 'react';

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = (toastMessage: string) => {
    setMessage(toastMessage);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
    setMessage('');
  };

  return {
    isVisible,
    message,
    showToast,
    hideToast,
  };
};
