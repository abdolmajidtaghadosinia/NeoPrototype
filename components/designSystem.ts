import clsx from 'clsx';

/** Base classes for a standard page container. */
export const pageShell =
  'neo-page-shell neo-animate-stack space-y-8 pb-16 text-[rgb(var(--neo-text-primary))] text-[0.95rem] sm:text-base';
/** Base classes for a narrower page container. */
export const pageShellNarrow =
  'neo-page-shell neo-animate-stack space-y-6 pb-12 text-[rgb(var(--neo-text-primary))] text-[0.95rem] sm:text-base';
/** Styling for a standard section title. */
export const sectionTitle =
  'flex items-center justify-between gap-3 text-right text-lg font-bold sm:text-xl';
/** Styling for a standard section subtitle. */
export const sectionSubtitle =
  'text-sm leading-relaxed text-[rgb(var(--neo-text-secondary))] sm:text-[0.95rem]';
/** Styling for a metric title within a card or widget. */
export const metricTitle = 'text-base font-semibold text-[rgb(var(--neo-text-strong))]';
/** Styling for a metric description. */
export const metricDescription = 'text-sm text-[rgb(var(--neo-text-secondary))]';
/** Styling for a neutral-toned chip element. */
export const chipNeutral =
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold text-[rgb(var(--neo-chip-color))] border-[var(--neo-chip-border)] bg-[var(--neo-chip-bg)]';
/** Styling for a muted horizontal divider. */
export const dividerMuted = 'border-t border-[color:var(--neo-divider-color)]';
/** Styling for a soft divider that matches the unified frame color. */
export const dividerSubtle = 'border-t neo-divider';
/** Styling for a stronger divider line. */
export const dividerStrong = 'border-t neo-divider-strong';
/** Base styling for input fields aligned with the design system. */
export const fieldBase = 'neo-field text-[rgb(var(--neo-text-strong))]';
/** Smaller field styling for compact controls. */
export const fieldSm = 'neo-field neo-field--sm text-[rgb(var(--neo-text-strong))]';
/** Larger field styling for prominent inputs. */
export const fieldLg = 'neo-field neo-field--lg text-[rgb(var(--neo-text-strong))]';
/** Pill-shaped field styling, typically for chat or search inputs. */
export const fieldPill = 'neo-field neo-field--pill text-[rgb(var(--neo-text-strong))]';
/** Textarea styling aligned with the new field tokens. */
export const fieldTextarea = 'neo-field neo-field--textarea text-[rgb(var(--neo-text-strong))]';

const toneClasses: Record<string, string> = {
  base: 'neo-surface',
  muted: 'neo-surface neo-surface--muted',
  elevated: 'neo-surface neo-surface--elevated',
  positive: 'neo-surface neo-surface--positive',
  warning: 'neo-surface neo-surface--warning',
  info: 'neo-surface neo-surface--info',
  danger: 'neo-surface neo-surface--danger',
  ghost: 'neo-surface neo-surface--ghost',
};

const paddingMap: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

/** Defines the available visual tones for a surface. */
export type SurfaceTone = keyof typeof toneClasses;
/** Defines the available padding sizes for a surface. */
export type SurfacePadding = keyof typeof paddingMap;

/**
 * Composes a string of CSS classes for a surface element.
 * @param {SurfaceTone} [tone='base'] - The visual tone of the surface.
 * @param {SurfacePadding} [padding='md'] - The padding size of the surface.
 * @param {string} [className] - Additional CSS classes to merge.
 * @returns {string} The combined CSS class string.
 */
export const composeSurfaceClasses = (
  tone: SurfaceTone = 'base',
  padding: SurfacePadding = 'md',
  className?: string,
) =>
  clsx(
    'text-right neo-animate-surface',
    toneClasses[tone] ?? toneClasses.base,
    paddingMap[padding],
    className,
  );

/**
 * Composes a string of CSS classes for a page shell container.
 * @param {string} [className] - Additional CSS classes to merge.
 * @param {'default' | 'narrow'} [variant='default'] - The width variant of the shell.
 * @returns {string} The combined CSS class string.
 */
export const composePageShell = (className?: string, variant: 'default' | 'narrow' = 'default') =>
  clsx(variant === 'narrow' ? pageShellNarrow : pageShell, className);

const navBaseClasses =
  'neo-nav-item flex w-full font-medium tracking-tight transition-all duration-200 ease-[var(--neo-motion-ease-soft)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--neo-nav-focus-ring)]';

const navOrientationClasses: Record<'stacked' | 'inline', string> = {
  stacked:
    'flex-col items-center justify-center gap-2 rounded-[var(--neo-radius-lg)] px-3 py-5 text-sm text-center',
  inline:
    'flex-row items-center justify-start gap-3 rounded-[var(--neo-radius-md)] px-4 py-4 text-sm text-right',
};

const navActiveClasses =
  'text-[rgb(var(--neo-nav-active-text))] bg-[color:var(--neo-nav-active-bg)] border border-[color:var(--neo-nav-active-border)] shadow-[var(--neo-nav-active-shadow)]';

const navInactiveClasses =
  'text-[rgb(var(--neo-nav-inactive))] border border-transparent hover:text-[rgb(var(--neo-nav-hover-text))] hover:bg-[color:var(--neo-nav-hover-bg)]';

/**
 * Returns button classes for vertical or horizontal navigation items.
 * @param {'stacked' | 'inline'} [orientation='inline'] - Layout orientation of the nav item.
 * @param {boolean} isActive - Whether the nav item represents the active route.
 * @param {string} [className] - Additional classes to merge with the defaults.
 * @returns {string} Combined class names for the nav item.
 */
export const composeNavItemClasses = (
  orientation: 'stacked' | 'inline' = 'inline',
  isActive: boolean,
  className?: string,
) =>
  clsx(
    navBaseClasses,
    navOrientationClasses[orientation],
    isActive ? navActiveClasses : navInactiveClasses,
    className,
  );

const homeCardToneClasses = {
  default: 'home-card home-card--default',
  muted: 'home-card home-card--muted',
  positive: 'home-card home-card--positive',
  negative: 'home-card home-card--negative',
  info: 'home-card home-card--info',
  alert: 'home-card home-card--alert',
} as const;

const homeCardPaddingMap: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

/** Defines the available visual tones for a home card, which has distinct styling from a standard surface. */
export type HomeCardTone = keyof typeof homeCardToneClasses;
/** Defines the available padding sizes for a home card. */
export type HomeCardPadding = keyof typeof homeCardPaddingMap;

/**
 * Composes a string of CSS classes for a home card element.
 * These cards have specific styles used on the home page dashboard.
 * @param {HomeCardTone} [tone='default'] - The visual tone of the home card.
 * @param {HomeCardPadding} [padding='md'] - The padding size of the home card.
 * @param {string} [className] - Additional CSS classes to merge.
 * @returns {string} The combined CSS class string for the home card.
 */
export const composeHomeCardClasses = (
  tone: HomeCardTone = 'default',
  padding: HomeCardPadding = 'md',
  className?: string,
) =>
  clsx(
    'text-right neo-animate-home-card',
    homeCardToneClasses[tone] ?? homeCardToneClasses.default,
    homeCardPaddingMap[padding],
    className,
  );
