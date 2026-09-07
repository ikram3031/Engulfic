import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initTrackingPixels } from '@/lib/metaPixel';

// Scrolls window to top, initializes tracking pixels, and fires PageView on route transition
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    initTrackingPixels();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;

