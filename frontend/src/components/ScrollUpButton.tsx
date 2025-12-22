'use client';

import { useEffect, useState } from 'react';

type ScrollUpButtonProps = {
  threshold?: number;
};

export default function ScrollUpButton({ threshold = 300 }: ScrollUpButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-[999999] flex items-center"
      aria-label="Scroll to top"
      type="button"
    >
      <span className="text-sm font-bold">↑ Scroll Up</span>
    </button>
  );
}
