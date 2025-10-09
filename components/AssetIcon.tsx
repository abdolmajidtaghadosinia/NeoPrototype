import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

type AssetIconVariant = 'default' | 'stock' | 'fund' | 'commodity' | 'currency' | 'index';

type AssetIconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AssetIconProps {
  icon?: string | React.ReactNode;
  name: string;
  symbol?: string;
  variant?: AssetIconVariant;
  size?: AssetIconSize;
  className?: string;
}

const isImageSource = (value: string) => /^(https?:\/\/|data:image\/|blob:|\/)/i.test(value);

const normaliseSymbol = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length <= 3) {
    return trimmed;
  }

  return trimmed.slice(0, 3);
};

const sanitizeLabel = (value: string) =>
  value
    .replace(/\(.+?\)/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildFallbackText = (name: string, symbol?: string) => {
  const fromSymbol = normaliseSymbol(symbol);
  if (fromSymbol) {
    return fromSymbol;
  }

  const sanitized = sanitizeLabel(name);
  if (!sanitized) {
    return '؟';
  }

  const parts = sanitized.split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2);
  }

  const [first, second] = parts;
  const initials = `${first?.[0] ?? ''}${second?.[0] ?? ''}`.trim();
  return initials || sanitized.slice(0, 2);
};

const sizeMap: Record<AssetIconSize, string> = {
  xs: 'neo-asset-icon--xs',
  sm: 'neo-asset-icon--sm',
  md: 'neo-asset-icon--md',
  lg: 'neo-asset-icon--lg',
};

const variantMap: Record<AssetIconVariant, string> = {
  default: 'neo-asset-icon--default',
  stock: 'neo-asset-icon--stock',
  fund: 'neo-asset-icon--fund',
  commodity: 'neo-asset-icon--commodity',
  currency: 'neo-asset-icon--currency',
  index: 'neo-asset-icon--index',
};

const emojiRegex = /[\p{Emoji}\p{Extended_Pictographic}]/u;

const shouldTreatAsEmoji = (icon: string) => {
  if (!icon.trim()) {
    return false;
  }

  if (icon.length > 6) {
    return false;
  }

  return emojiRegex.test(icon);
};

export const AssetIcon: React.FC<AssetIconProps> = ({
  icon,
  name,
  symbol,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const fallbackText = useMemo(() => buildFallbackText(name, symbol), [name, symbol]);

  const wrapperClass = clsx('neo-asset-icon', sizeMap[size], variantMap[variant], className);

  if (!icon || hasError) {
    return (
      <span className={wrapperClass} aria-hidden>
        <span className="neo-asset-icon__text">{fallbackText}</span>
      </span>
    );
  }

  if (React.isValidElement(icon)) {
    return (
      <span className={wrapperClass}>
        <span className="neo-asset-icon__node">{icon}</span>
      </span>
    );
  }

  const trimmed = icon.trim();
  if (!trimmed) {
    return (
      <span className={wrapperClass} aria-hidden>
        <span className="neo-asset-icon__text">{fallbackText}</span>
      </span>
    );
  }

  if (isImageSource(trimmed)) {
    return (
      <span className={clsx(wrapperClass, 'neo-asset-icon--image')}>
        <img
          src={trimmed}
          alt={name}
          className="neo-asset-icon__image"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </span>
    );
  }

  if (shouldTreatAsEmoji(trimmed)) {
    return (
      <span className={wrapperClass} aria-hidden>
        <span className="neo-asset-icon__text">{fallbackText}</span>
      </span>
    );
  }

  const text = normaliseSymbol(trimmed) ?? fallbackText;

  return (
    <span className={wrapperClass} aria-hidden>
      <span className="neo-asset-icon__text">{text}</span>
    </span>
  );
};

export const deriveAssetSymbol = (name: string) => {
  const match = name.match(/\(([^)]+)\)/);
  if (match?.[1]) {
    return match[1].trim();
  }
  return undefined;
};

export default AssetIcon;
