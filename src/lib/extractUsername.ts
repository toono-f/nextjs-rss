export const extractUsername = (url: string): string => {
  return url.replace("https://x.com/", "");
};
