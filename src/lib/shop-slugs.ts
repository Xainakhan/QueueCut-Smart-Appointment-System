export const reservedShopSlugs = new Set(["admin", "api", "login", "logout", "s", "t", "assets", "favicon.ico", "robots.txt", "sitemap.xml", "_next"]);
export function isAllowedShopSlug(value: string) { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !reservedShopSlugs.has(value); }
