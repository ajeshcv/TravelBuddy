export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animated = true,
}) {
  const baseClasses = `
    ${animated ? 'skeleton' : ''}
    ${variant === 'circular' ? 'rounded-full' : 'rounded-md'}
    ${className}
  `;

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '20px'),
  };

  return <div className={baseClasses} style={style} />;
}

// Pre-defined skeleton components
export function SkeletonCard() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={12} width="60%" />
        </div>
      </div>
      <Skeleton variant="text" height={14} />
      <Skeleton variant="text" height={14} width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height={32} width={80} />
        <Skeleton variant="rectangular" height={32} width={80} />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={14}
          width={i === lines - 1 ? '60%' : undefined}
        />
      ))}
    </div>
  );
}