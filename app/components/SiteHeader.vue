<script setup lang="ts">
import site from '~~/site.config'

const route = useRoute()

const links = [
  { label: 'Blog', to: '/blog', sections: ['/blog', '/tags'] },
  { label: 'Series', to: '/series', sections: ['/series'] },
  { label: 'About', to: '/about', sections: ['/about'] },
]

function isCurrent(sections: string[]) {
  return sections.some(section => route.path === section || route.path.startsWith(`${section}/`))
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
        :class="{ current: isCurrent(link.sections) }"
        :aria-current="isCurrent(link.sections) ? 'page' : undefined"
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
