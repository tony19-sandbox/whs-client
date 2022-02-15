<template>
  <div class="viewport"></div>
</template>


<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'BaseModel',
  components: {

  },

  data() {
    return {
      height: 0
    };
  },
  methods: {
    ...mapMutations('main_three', ["RESIZE"]),
    ...mapActions('main_three', ["INIT", "ANIMATE"])
  },

  // mounted() {
  //   this.INIT({
  //     width: this.$el.offsetWidth, // pobieramy width i height bieżacego elementu html (class='viewport'). OffsetWidth/Height podaje szer./wys. elementu, odnosząca się do układu strony (łącznie z obramowaniem, paskiem przewijania, margianesem, CSSem etc.)
  //     width: this.$el.offsetHeight,
  //     el: this.$el // this.$el odnosi się do bieżącego elementu html czyli tu do viewport, w którym będzie nasza scena
  //   }).then(() => {
  //     this.ANIMATE();
  //     window.addEventListener("resize", () => {
  //       this.RESIZE({
  //         width: this.$el.offsetWidth,
  //         height: this.$el.offsetHeight
  //       });
  //     }, true);

  //   });
  // }
}
</script>

<style scoped>
  .viewport {
    height: 100%;
    width: 100%;
  }
</style>
