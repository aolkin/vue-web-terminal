<script setup lang="ts">
import {PropType} from "vue";
import {Message} from "~/types";

defineProps({
  message: Object as PropType<Message>
})

</script>

<template>
  <div class="t-code t-code-default">
    <pre style="padding: 1em;margin: 0"><code style="font-size: 15px">{{ message.content }}</code></pre>
  </div>
</template>

<style scoped>

</style>
