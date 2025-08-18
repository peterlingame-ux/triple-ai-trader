import React from 'react';
import { ComprehensiveManagement } from '@/components/ComprehensiveManagement';
import { useNavigate } from 'react-router-dom';

export const Management = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <ComprehensiveManagement 
      onClose={handleClose}
    />
  );
};

export default Management;