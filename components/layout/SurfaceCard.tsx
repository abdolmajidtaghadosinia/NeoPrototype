import React from 'react';
import { composeSurfaceClasses, SurfacePadding, SurfaceTone } from '../designSystem';

/**
 * Props for the SurfaceCard component.
 * Extends standard HTML attributes for a div element.
 */
export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The HTML tag to render for the card container. Defaults to 'div'. */
  as?: 'div' | 'section';
  /** The visual tone of the card, affecting its background and border. */
  tone?: SurfaceTone;
  /** The padding size for the card's content area. */
  padding?: SurfacePadding;
  /** An optional title for the card's header. */
  title?: string;
  /** An optional description to display below the title. */
  description?: string;
  /** Optional action elements (e.g., buttons) to display in the header. */
  actions?: React.ReactNode;
  /** A custom header element to override the default title/description structure. */
  header?: React.ReactNode;
  /** An optional footer element to display at the bottom of the card. */
  footer?: React.ReactNode;
}

/**
 * A versatile card component that provides a styled surface for content.
 * It's a foundational layout primitive used throughout the application.
 * The card can include an optional header (with title, description, actions),
 * a main content area, and an optional footer.
 *
 * @param {SurfaceCardProps} props - The component props.
 * @returns {JSX.Element} A styled surface card element.
 */
const SurfaceCard: React.FC<SurfaceCardProps> = ({
  as: Component = 'div',
  tone = 'base',
  padding = 'md',
  title,
  description,
  actions,
  header,
  footer,
  className,
  children,
  ...rest
}) => {
  const mergedClassName = composeSurfaceClasses(tone, padding, className);

  return (
    <Component className={mergedClassName} {...rest}>
      {(header || title || description || actions) && (
        <div className="mb-4 flex flex-col items-end gap-3 text-right sm:flex-row sm:items-center sm:justify-between">
          {header ? (
            header
          ) : (
            <div className="space-y-1 text-right">
              {title && (
                <h3 className="text-sm font-semibold text-[rgb(var(--neo-text-strong))] md:text-base">{title}</h3>
              )}
              {description && (
                <p className="text-xs leading-relaxed text-[rgb(var(--neo-text-secondary))]">{description}</p>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="space-y-4 text-right">
        {children}
      </div>
      {footer && (
        <div className="mt-5 border-t border-[color:var(--neo-divider-color)] pt-4 text-xs leading-relaxed text-[rgb(var(--neo-text-secondary))]">
          {footer}
        </div>
      )}
    </Component>
  );
};

export default SurfaceCard;
