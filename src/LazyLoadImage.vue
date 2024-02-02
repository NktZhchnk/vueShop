<template>
  <div ref="intersectionTarget" class="lazy-load">
    <img v-if="isVisible" :src="src" :alt="alt" />
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
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(this.handleIntersection, options);
      observer.observe(this.$refs.intersectionTarget);
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          // Если нужно, можно дополнительно обработать событие появления в зоне видимости
        } else {
          // Если нужно, можно дополнительно обработать событие выхода из зоны видимости
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
