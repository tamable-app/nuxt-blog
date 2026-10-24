<script setup lang="ts">
import site from '~~/site.config'
</script>

<template>
  <footer class="site-footer">
    <div class="container inner">
      <span>© {{ new Date().getFullYear() }} {{ site.author }}</span>
      <span class="links">
        <a href="/rss.xml">RSS</a>
        <a v-if="site.links.x" :href="`https://x.com/${site.links.x}`">X</a>
        <a v-if="site.links.github" :href="`https://github.com/${site.links.github}`">GitHub</a>
        <a v-if="site.links.email" :href="`mailto:${site.links.email}`">Email</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding-block: 28px 40px;
  font-size: 14px;
  color: var(--muted);
}

.links {
  display: flex;
  gap: 20px;
}
</style>
