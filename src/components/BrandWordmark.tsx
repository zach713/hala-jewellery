interface BrandWordmarkProps {
  variant?: 'dark' | 'light';
  size?: 'header' | 'footer' | 'card';
}

export function BrandWordmark({
  variant = 'dark',
  size = 'header',
}: BrandWordmarkProps) {
  const primaryColorClass =
    variant === 'light' ? 'text-white' : 'text-[#2B2019]';
  const subColorClass =
    variant === 'light' ? 'text-white/90' : 'text-[#5C4534]';

  const titleSizeClass =
    size === 'footer'
      ? 'text-[44px] md:text-[50px]'
      : size === 'card'
        ? 'text-[38px] sm:text-[42px]'
        : 'text-[38px] sm:text-[48px] md:text-[56px]';

  const subSizeClass =
    size === 'footer'
      ? 'text-[8.5px] tracking-[0.42em] pl-[0.42em]'
      : size === 'card'
        ? 'text-[8px] tracking-[0.38em] pl-[0.38em]'
        : 'text-[8px] sm:text-[9px] tracking-[0.42em] pl-[0.42em]';

  return (
    <span
      className={`inline-flex flex-col items-center leading-none select-none whitespace-nowrap shrink-0 transition-colors duration-200 ${primaryColorClass}`}
    >
      <span
        className={`font-script font-normal leading-[0.82] tracking-[0.01em] ${titleSizeClass}`}
      >
        Hala
      </span>
      <span
        className={`font-sans font-normal uppercase mt-[4px] leading-none transition-colors duration-200 ${subSizeClass} ${subColorClass}`}
      >
        JEWELLERY
      </span>
    </span>
  );
}
