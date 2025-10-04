export const normalizeText = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }

  return value
    .toString()
    .toLowerCase()
    .replace(/[\u200c\u200d]/g, '')
    .replace(/\s+/g, '')
    .replace(/[()\[\]{}]/g, '')
    .replace(/[،_,.-]/g, '')
    .trim();
};
