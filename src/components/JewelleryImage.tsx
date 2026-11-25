import { useState } from 'react';
import { Gem } from 'lucide-react';

interface JewelleryImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function JewelleryImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: JewelleryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF8F5] via-[#F2EDE7] to-[#E9E2D8] text-[#7A6352] p-6 text-center"
        role="img"
        aria-label={alt}
      >
        <Gem className="w-7 h-7 stroke-[1.25] mb-2 opacity-70" aria-hidden="true" />
        <span className="font-serif text-sm tracking-wide text-[#5C4534] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
