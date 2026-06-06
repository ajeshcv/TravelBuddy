import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick,
  ...props
}) {
  const baseClasses = `
    bg-surface border border-border
    rounded-xl shadow-sm
    transition-all duration-200
    ${padding ? 'p-5' : ''}
    ${hover ? 'card-hover cursor-pointer' : ''}
    ${className}
  `;

  if (onClick) {
    return (
      <MotionDiv
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}