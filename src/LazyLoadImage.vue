<template>
  <div ref="intersectionTarget" class="lazy-load">
    <img loading="lazy" v-if="isVisible" :src="cachedSrc || src" :alt="alt"/>
    <div v-else class="placeholder" :style="{ display: isVisible ? 'none' : 'flex' }">Загрузка...</div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: false,
      cachedSrc: null, // Хранение закешированного источника
    };
  },
  mounted() {
    this.initializeObserver();
  },
  methods: {
    initializeObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.99,
      };

      const observer = new IntersectionObserver(this.handleIntersection, options);
      observer.observe(this.$refs.intersectionTarget);
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.cachedSrc) {
          this.isVisible = true;
          this.cachedSrc = this.src; // Кеширование источника после первой загрузки
        }
      });
    },
  },
};
</script>

<style scoped>
.lazy-load {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0; /* Цвет заглушки */
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
