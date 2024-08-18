type ButtonProps = {
  onClick: () => void;
  text: string;
  className?: string;
  variant?: 'outlined' | 'text' | 'contained';
};

export default function Button({
  onClick,
  text,
  className = '',
  variant = 'outlined',
}: ButtonProps) {
  switch (variant) {
    case 'outlined':
      return (
        <button
          className={`${className} border border-neutral-700 text-neutral-900 py-2 px-4 rounded-md bg-transparent hover:bg-neutral-100 active:bg-neutral-200 focus:outline-none transition-colors`}
          onClick={onClick}
        >
          {text}
        </button>
      );
    case 'text':
      return (
        <button
          className={`${className} text-blue-600 py-2 px-2 rounded-md bg-transparent hover:underline focus:outline-none active:text-blue-700 transition-colors`}
          onClick={onClick}
        >
          {text}
        </button>
      );
    // contained
    default:
      return (
        <button
          className={`${className} bg-neutral-900 text-neutral-100 py-2 px-4 rounded-md border border-transparent hover:bg-neutral-800 active:bg-neutral-700 focus:outline-none transition-colors`}
          onClick={onClick}
        >
          {text}
        </button>
      );
  }
}
