<template>
  <div class="home">

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Vertex from '@/shader/test/Vertex.glsl';
console.log('Vertex', Vertex);
export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
