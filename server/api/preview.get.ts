// The one content route that runs on the live server: a preview link holds a token only Tamable can check.
export default defineEventHandler(async (event) => {
  const token = getQuery(event).token
  if (typeof token !== 'string' || !token) {
    throw createError({ statusCode: 404, statusMessage: 'This preview link has expired' })
  }

  const post = await previewPage(event, token)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'This preview link has expired' })
  }

  return post
})
