import { useState } from 'react';

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  online = false,
  className = '',
}) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const showInitials = !src || imageError;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden
        avatar-placeholder
        ${sizes[size]}
        ${className}
      `}
    >
      {showInitials ? (
        <span>{getInitials(name)}</span>
      ) : (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      {online && (
        <span
          className={`
            absolute bottom-0 right-0
            bg-success border-2 border-surface
            rounded-full
          ${size === 'xs' || size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'}
          `}
        />
      )}
    </div>
  );
}