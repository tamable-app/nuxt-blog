<script setup lang="ts">
import { BLOG_PATH, SERIES_PATH } from '@tamable/blog-kit'
import site from '~~/site.config'

const route = useRoute()

// Every blog page lives under /blog, so Blog stays current on series and tag pages too; Series is also
// current on its own pages. aria-current says "page" only on the link's own address.
const links = [
  { label: 'Blog', to: BLOG_PATH },
  { label: 'Series', to: SERIES_PATH },
  { label: 'About', to: '/about' },
]

function isCurrent(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function ariaCurrent(to: string) {
  if (route.path === to) return 'page'
  return isCurrent(to) ? 'true' : undefined
}
</script>

<template>
  <header class="site-header container">
    <NuxtLink to="/" class="home">
      {{ site.name }}
    </NuxtLink>
    <nav aria-label="Main" class="nav">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ current: isCurrent(link.to) }"
        :aria-current="ariaCurrent(link.to)"
      >
        {{ link.label }}
      </NuxtLink>
      <ThemeToggle />
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 32px;
  border-bottom: 1px solid var(--border);
}

.home {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: var(--text-soft);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link.current {
  color: var(--link);
}

@media (max-width: 480px) {
  .nav-link {
    padding: 0 7px;
  }
}
</style>
