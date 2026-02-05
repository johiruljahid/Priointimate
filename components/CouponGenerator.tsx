// components/CouponGenerator.tsx
import React, { useState, useEffect } from 'react';
import { Coupon, UserProfile } from '../types';
import { COUPON_FIXED_DISCOUNT_BDT, UI_TEXT_BN } from '../constants';
import Button from './Button';

interface CouponGeneratorProps {
  user: UserProfile;
  onCouponGenerated: (coupon: Coupon) => void;
}

const CouponGenerator: React.FC<CouponGeneratorProps> = ({ user, onCouponGenerated }) => {
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user already has a coupon, display it
    if (user.couponCode) {
      setGeneratedCoupon({
        code: user.couponCode,
        discount: COUPON_FIXED_DISCOUNT_BDT,
        generatedFor: user.id,
        isActive: true, // Assuming existing coupons are active
      });
    }
  }, [user]);

  const generateNewCoupon = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const baseName = user.name.replace(/\s/g, '').toUpperCase().substring(0, 5);
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      const newCouponCode = `${baseName}${randomNumber}`;

      const newCoupon: Coupon = {
        code: newCouponCode,
        discount: COUPON_FIXED_DISCOUNT_BDT,
        generatedFor: user.id,
        isActive: true,
      };

      setGeneratedCoupon(newCoupon);
      onCouponGenerated(newCoupon); // Pass the new coupon to parent
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-lightBg p-6 rounded-2xl shadow-3d-card text-center space-y-4">
      <h3 className="text-2xl font-semibold text-accent">{UI_TEXT_BN.yourCouponCode}</h3>
      {generatedCoupon ? (
        <div className="bg-darkBg p-4 rounded-xl shadow-inner border border-primary/30">
          <p className="text-xl font-bold text-white mb-2 tracking-wider">
            {generatedCoupon.code}
          </p>
          <p className="text-lg text-textLight">
            {UI_TEXT_BN.discount}: <span className="text-primary font-bold">{generatedCoupon.discount} {UI_TEXT_BN.taka}</span> ({UI_TEXT_BN.fixedDiscount})
          </p>
        </div>
      ) : (
        <p className="text-lg text-textLight">{UI_TEXT_BN.loading} {UI_TEXT_BN.yourCouponCode}...</p>
      )}

      {!user.couponCode && ( // Only show button if user doesn't have a coupon yet
        <Button
          onClick={generateNewCoupon}
          disabled={loading}
          className="mt-4 px-6 py-3"
        >
          {loading ? UI_TEXT_BN.loading : UI_TEXT_BN.generateCouponCode}
        </Button>
      )}
    </div>
  );
};

export default CouponGenerator;