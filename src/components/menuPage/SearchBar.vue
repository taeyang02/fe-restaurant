<template>
  <div
      id="searchContainer"
      class="position-fixed top-0 start-0 end-0 p-3 bg-white shadow"
      style="z-index: 1050;"
      v-show="show"
  >
    <div class="input-group">
      <input
          ref="inputRef"
          type="text"
          class="form-control form-control-lg"
          placeholder="Tìm món ăn..."
          v-model="keyword"
          @input="onSearch"
      />
      <button
          class="btn btn-outline-secondary btn-lg"
          @click="onClose"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

defineProps({
  show: Boolean
})
const emit = defineEmits(['filter-menu', 'close-search'])

const keyword = ref('')
const inputRef = ref(null)

function onSearch() {
  emit('filter-menu', keyword.value)
}

function onClose() {
  keyword.value = ''
  emit('filter-menu', '')
  emit('close-search')
}

// expose hàm focus ra ngoài component
defineExpose({
  focus: () => {
    // đợi input render rồi mới focus
    nextTick(() => inputRef.value?.focus())
  }
})
</script>
