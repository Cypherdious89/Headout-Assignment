// /components/StylizedButton.js
import React from "react";

const StylizedButton = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
}) => {
  // Base styles
  const baseStyles =
    "font-semibold relative overflow-hidden rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size variations
  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "accent-gradient-btn text-white focus:ring-purple-500 hover:transform hover:-translate-y-1",
    secondary:
      "bg-white border-2 border-accent text-accent hover:bg-accent-light focus:ring-purple-300 hover:transform hover:-translate-y-1",
    outline:
      "bg-transparent border-2 border-accent text-accent hover:bg-accent-light focus:ring-purple-300 hover:transform hover:-translate-y-1",
    rounded:
      "accent-gradient-btn text-white rounded-full focus:ring-purple-500 hover:transform hover:-translate-y-1",
  };

  // Disabled styles
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`;

  // Handle click with optional disable
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/25 to-white/0 shine-effect"></span>
      </span>
    </button>
  );
};

export default StylizedButton;
