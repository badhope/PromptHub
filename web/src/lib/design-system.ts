export const BORDER_RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
  card: 'rounded-2xl',
  button: 'rounded-xl',
  badge: 'rounded-full',
  input: 'rounded-xl',
} as const;

export const SPACING = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  xl: 'p-6',
  card: 'p-5',
  section: 'py-8',
} as const;

export const GAP = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
  xl: 'gap-6',
} as const;

export const SHADOW = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  button: 'shadow-lg shadow-indigo-500/20',
  card: 'shadow-sm',
} as const;

export const TRANSITION = {
  fast: 'transition-all duration-150',
  base: 'transition-all duration-200',
  slow: 'transition-all duration-300',
} as const;

export const COLORS = {
  primary: {
    from: 'from-indigo-500',
    to: 'to-purple-500',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-500/20',
    shadow: 'shadow-lg shadow-indigo-500/20',
  },
  secondary: {
    from: 'from-amber-500',
    to: 'to-orange-500',
    gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  danger: {
    from: 'from-rose-500',
    to: 'to-pink-500',
    gradient: 'bg-gradient-to-r from-rose-500 to-pink-500',
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  neutral: {
    card: 'bg-white dark:bg-gray-800',
    surface: 'bg-gray-50 dark:bg-gray-800/50',
    border: 'border-gray-200/50 dark:border-gray-700/50',
    text: 'text-gray-600 dark:text-gray-300',
    textMuted: 'text-gray-400 dark:text-gray-500',
  },
} as const;

export const HOVER = {
  base: 'hover:scale-105 active:scale-95 transition-transform duration-200',
  button: 'hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200',
  card: 'hover:border-indigo-500/30 hover:shadow-md transition-all duration-200',
} as const;

export const FONT = {
  h1: 'text-2xl sm:text-3xl lg:text-4xl font-black',
  h2: 'text-xl sm:text-2xl font-bold',
  h3: 'text-lg sm:text-xl font-bold',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  button: 'font-bold text-sm',
  badge: 'font-medium text-xs',
} as const;

export const LAYOUT = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto px-4 sm:px-6',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
} as const;
