// components/Footer.tsx
import React from 'react';
import { APP_NAME_BN } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 bg-lightBg text-center text-textLight text-sm shadow-inner mt-8 rounded-t-3xl">
      <p>&copy; {currentYear} {APP_NAME_BN}. সর্বস্বত্ব সংরক্ষিত।</p>
    </footer>
  );
};

export default Footer;