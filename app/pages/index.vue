<script setup lang="ts">
import site from '~~/site.config'

const { data: posts } = await usePosts()
const { data: series } = await useSeriesList()
const latest = computed(() => posts.value.slice(0, 5))

useSeoMeta({
  title: null,
  description: site.description,
})
</script>

<template>
  <div class="container">
    <section class="hero">
      <h1 class="hello">
        {{ site.name }}
      </h1>
      <p class="intro">
        {{ site.description }}
      </p>
    </section>

    <section aria-labelledby="latest" class="latest">
      <h2 id="latest" class="section-title">
        Latest posts
      </h2>
      <PostList :posts="latest" />
      <NuxtLink to="/blog" class="all">
        All posts →
      </NuxtLink>
    </section>

    <section v-if="series.length" aria-labelledby="series" class="series">
      <h2 id="series" class="section-title">
        Series
      </h2>
      <div class="cards">
        <SeriesCard v-for="item in series" :key="item.slug" :series="item" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding-block: 96px 80px;
}

.hello {
  margin: 0 0 24px;
  font-size: clamp(40px, 8vw, 56px);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.intro {
  margin: 0;
  max-width: 640px;
  font-size: 22px;
  line-height: 1.55;
  color: var(--text-soft);
}

.latest {
  padding-bottom: 96px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.series {
  padding-bottom: 96px;
}

.series .section-title {
  margin-bottom: 20px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.all {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  font-size: 14px;
}
</style>
