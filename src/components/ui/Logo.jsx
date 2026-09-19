import React from 'react';
import MeridianLogo from './MeridianLogo';

const Logo = ({ className = "h-8 w-auto", color = "#0A2D5A" }) => {
  const isLight = color === "white" || color === "#ffffff" || color === "#FFF";
  return (
    <MeridianLogo className={className} variant={isLight ? "light" : "dark"} />
  );
};

export default Logo;
