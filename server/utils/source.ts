import { createContentSource, createTamableClient, type ContentSource, type Post, type PostPage, type PostSummary, type Series, type SeriesSummary, type TamableClient } from '@tamable/blog-kit'
import type { H3Event } from 'h3'

let client: TamableClient | undefined
let source: ContentSource | undefined

export function tamable(event: H3Event): TamableClient {
  if (!client) {
    const config = useRuntimeConfig(event)
    client = createTamableClient({ apiUrl: config.tamableApiUrl, readKey: config.tamableReadKey })
  }
  return client
}

/** During a build every page asks for the same data, so it is read once. Development always reads fresh. */
function content(event: H3Event): ContentSource {
  source ??= createContentSource(tamable(event), { cache: !import.meta.dev })
  return source
}

/** Content routes serve the build and local development, never visitors of the live site. */
export function assertBuildTime(): void {
  if (!import.meta.dev && !import.meta.prerender) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
}

export const allPosts = (event: H3Event): Promise<Post[]> => content(event).allPosts()
export const postSummaries = (event: H3Event): Promise<PostSummary[]> => content(event).postSummaries()
export const seriesSummaries = (event: H3Event): Promise<SeriesSummary[]> => content(event).seriesSummaries()
export const seriesDetail = (event: H3Event, slug: string): Promise<Series | null> => content(event).seriesDetail(slug)
export const postPage = (event: H3Event, slug: string): Promise<PostPage | null> => content(event).postPage(slug)
export const previewPage = (event: H3Event, token: string): Promise<PostPage | null> => content(event).previewPage(token)
