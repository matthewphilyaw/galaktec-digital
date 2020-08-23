<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style lang="scss">
:root {
  --mk-blue: #78DCE8;
  --mk-green: #a9dc76;
  --mk-purple: #AB9DF2;
  --mk-pink: #FF6188;
  --mk-yellow: #FFD866;
  --mk-orange: #FC9867;

  --primary-color: var(--mk-green);
  --secondary-color: var(--mk-purple);
  --surface-color: var(--mk-blue);
  --background-color: #212121;
  --error-color: var(--mk-orange);

  --on-primary-color: #FFFFFF;
  --on-secondary-color: #FFFFFF;
  --on-surface-color: #FFFFFF;
  --on-background-color: #FFFFFF;
  --on-error-color: #FFFFFF;
}

html {
  margin: 0;
  padding: 0;

  background: var(--background-color);
  color: var(--on-background-color);
}

body {
  margin: auto;
  padding: 0;

  width: 1920px;

  background: var(--background-color);
  color: var(--on-background-color);

  height: 100vh;
}

#app {
  height: 100%;
}

.CodeMirror {
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  height:100%;
}
</style>