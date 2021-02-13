<template>
  <div>
    aaaa
    <div>
      TEST
    </div>
    <div style="padding: 20px; background-color: #444; height: 100px; color: #FFF; font-family: 'Open Sans', sans-serif;"
      @mousedown="mouseDown"
      @mouseup="mouseUp">
      <p ref="af" v-overflow-resize style="max-height:100px; margin:0;"> {{ testText }}</p>
    </div>
  </div>
</template>

<script>
import faker from "faker";

const baseWords = `🎃👻🎃👻🎃👻👻👻🎃👻 spooky shit spooky sHit🎃 thats ✔ some spooky🎃🎃shit right🎃🎃th 🎃 ere🎃🎃🎃 right✔there ✔✔if i do ƽaү so my selｆ 💯 i say so 💯 thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ💯 🎃🎃 🎃НO0ОଠＯ OOＯOОଠଠOoooᵒᵒᵒ ᵒᵒᵒᵒᵒᵒ🎃 🎃 🎃 🎃 💯 🎃 👻👻 👻 🎃🎃spooky shit`;
export default {
  data () {
    return {
      now: Date.now()
    };
  },
  mounted(){
    this.now = Date.now();
    this.$options.intervalId = setInterval(() => this.now = Date.now(), 33);
  },
  computed:{
    testText() {
      // [0,1] at 0.125Hz
      const osc = (Math.sin(this.now / 1000 / 8 * Math.PI * 2) + 1) / 2;
      // [5,50]
      const words = osc * 45 + 5;
      return baseWords.split(' ').slice(0,words).join(' ');
    }
  },
  methods: {
    mouseDown() {
      clearInterval(this.$options.intervalId)
    },
    mouseUp() {
      this.$options.intervalId = setInterval(() => this.now = Date.now(), 33);
    }
  }
};
</script>
