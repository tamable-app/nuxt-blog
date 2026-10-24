// Built from the site address, so the sitemap line is right on any domain.
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  return `User-agent: *\nDisallow: /preview/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
