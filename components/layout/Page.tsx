import React from 'react';
import clsx from 'clsx';
import { composePageShell } from '../designSystem';

type PageElement = 'div' | 'main' | 'section';

type PageSpacing = 'none' | 'sm' | 'md' | 'lg';

const spacingClassMap: Record<PageSpacing, string> = {
  none: 'space-y-0',
  sm: 'space-y-4',
  md: 'space-y-6',
  lg: 'space-y-8',
};

/**
 * Props for the Page layout component.
 * Extends standard HTML attributes for the given element type.
 */
export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The HTML tag to render for the page container. Defaults to 'section'. */
  as?: PageElement;
  /** An optional title to display in the page header. */
  title?: string;
  /** An optional description to display below the title. */
  description?: string;
  /** Optional action elements (e.g., buttons) to display in the header. */
  actions?: React.ReactNode;
  /** The vertical spacing between direct children of the page container. */
  spacing?: PageSpacing;
  /** Additional CSS classes for the header element. */
  headerClassName?: string;
  /** The width variant of the page shell, controlling max-width and padding. */
  shellVariant?: 'default' | 'narrow';
}

/**
 * A flexible layout component that serves as a container for page content.
 * It provides a consistent structure with an optional header (including title,
 * description, and actions) and controllable vertical spacing for its children.
 *
 * @param {PageProps} props - The component props.
 * @returns {JSX.Element} A structured page container element.
 */
const Page: React.FC<PageProps> = ({
  as: Component = 'section',
  title,
  description,
  actions,
  spacing = 'lg',
  className,
  children,
  headerClassName,
  shellVariant = 'default',
  ...rest
}) => {
  const shell = composePageShell(undefined, shellVariant);
  const spacingClass = spacingClassMap[spacing] ?? spacingClassMap.lg;
  const componentProps = rest as React.HTMLAttributes<HTMLElement>;

  return (
    <Component
      {...componentProps}
      className={clsx(shell, spacingClass, className)}
    >
      {(title || description || actions) && (
        <header
          className={clsx(
            'flex flex-col items-end gap-3 text-right md:flex-row md:items-center md:justify-between',
            headerClassName,
          )}
        >
          <div className="space-y-1 text-right">
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--neo-text-strong))] md:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm leading-relaxed text-[rgb(var(--neo-text-secondary))] md:text-base">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </Component>
  );
};

export default Page;
