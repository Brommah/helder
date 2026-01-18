interface ProgressProps {
  value: number
  max?: number
  className?: string
  variant?: 'default' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function Progress({
  value,
  max = 100,
  className = '',
  variant = 'default',
  size = 'md',
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variants = {
    default: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Voortgang</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
