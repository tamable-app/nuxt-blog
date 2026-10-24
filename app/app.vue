<script setup lang="ts">
import site from '~~/site.config'

const siteUrl = useRuntimeConfig().public.siteUrl
const route = useRoute()

useHead({
  titleTemplate: title => (title ? `${title} · ${site.name}` : site.name),
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: site.name, href: `${siteUrl}/rss.xml` },
  ],
})

// A draft has no canonical address; every other page is its own.
useHead({
  link: () => route.path.startsWith('/preview')
    ? []
    : [{ rel: 'canonical', href: `${siteUrl}${route.path === '/' ? '' : route.path}` }],
})

useSeoMeta({
  ogSiteName: site.name,
  ogType: 'website',
  ogUrl: () => `${siteUrl}${route.path === '/' ? '' : route.path}`,
  twitterSite: site.links.x ? `@${site.links.x}` : undefined,
  twitterCreator: site.links.x ? `@${site.links.x}` : undefined,
  twitterCard: 'summary',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
