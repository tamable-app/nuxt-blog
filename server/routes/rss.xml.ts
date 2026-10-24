import { rssXml } from '@tamable/blog-kit'
import site from '../../site.config'

export default defineEventHandler(async (event) => {
  assertBuildTime()
  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  const channel = { siteUrl: useRuntimeConfig(event).public.siteUrl, title: site.name, description: site.description, language: site.locale }
  return rssXml(await allPosts(event), channel)
})
