'use client';
import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000); 

    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-[#EB2302] animate-pulse">اسم المشروع</h1>
    </div>
  );
};

export default SplashScreen;
