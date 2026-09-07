import { useState } from 'react';
import fallbackLogo from '@/assets/logo.webp';

const REMOTE_LOGO_URL = 'https://server.engulfic.com/uploads/assets/logo.webp';

// Renders brand logo image with remote CDN source and local asset fallback
export const Logo = ({ className = 'h-8 w-auto object-contain', alt = 'Engulfic' }) => {
  const [imgSrc, setImgSrc] = useState(REMOTE_LOGO_URL);

  const handleError = () => {
    if (imgSrc !== fallbackLogo) {
      setImgSrc(fallbackLogo);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="eager"
    />
  );
};

export default Logo;
