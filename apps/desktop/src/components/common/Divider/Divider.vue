<script setup lang="ts">
defineProps<{
  direction?: 'horizontal' | 'vertical'
  dashed?: boolean
}>()
</script>

<template>
  <div
    class="divider"
    :class="[direction, { dashed }]"
  ></div>
</template>

<style scoped>
.divider {
  border-color: var(--border-color);
}

.horizontal {
  width: 100%;
  border-top: 1px solid;
  margin: 16px 0;
}

.vertical {
  display: inline-block;
  height: 1em;
  border-left: 1px solid;
  margin: 0 8px;
  vertical-align: middle;
}

.dashed.horizontal {
  border-top-style: dashed;
}

.dashed.vertical {
  border-left-style: dashed;
}
</style>
