import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const MotionButton = motion(forwardRef(({ as, ...props }, ref) => {
  const Component = as || 'button';
  return <Component ref={ref} {...props} />;
}));

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark shadow-md',
  outline: 'bg-transparent border-2 border-border text-text hover:bg-border-light dark:hover:bg-white/5',
  ghost: 'bg-transparent text-text-secondary hover:bg-border-light dark:hover:bg-white/5 hover:text-text',
  danger: 'bg-danger text-white hover:bg-danger-dark shadow-md',
  success: 'bg-success text-white hover:bg-green-600 shadow-md',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) {
  return (
    <MotionButton
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/30
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!loading && rightIcon && rightIcon}
    </MotionButton>
  );
}