import { useState, useCallback } from 'react';

export function useGameController() {
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [earnedCoupons, setEarnedCoupons] = useState([]);

  const openGameModal = useCallback(() => {
    setGameModalOpen(true);
  }, []);

  const closeGameModal = useCallback(() => {
    setGameModalOpen(false);
  }, []);

  const handleGameReward = useCallback((couponCode) => {
    if (couponCode && !earnedCoupons.includes(couponCode)) {
      setEarnedCoupons((prev) => [couponCode, ...prev]);
    }
  }, [earnedCoupons]);

  return {
    gameModalOpen,
    openGameModal,
    closeGameModal,
    earnedCoupons,
    handleGameReward,
  };
}
