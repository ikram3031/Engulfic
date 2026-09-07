import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initTrackingPixels, trackPageView } from '@/lib/tracking';

// Automatically initializes dynamic pixels and tracks PageView on every route change
export const PixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initTrackingPixels();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

export default PixelTracker;
