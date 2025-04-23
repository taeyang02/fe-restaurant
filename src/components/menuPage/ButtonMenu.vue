<template>
  <button id="menu-button" data-bs-toggle="modal" data-bs-target="#cartModal" class="btn btn-primary position-fixed bottom-0 end-0 m-3 shadow rounded-circle
   d-flex justify-content-center align-items-center position-relative z-1"
          style="width: 70px; height: 70px; font-size: 1.6rem;">
    <i class="bi bi-cart-fill text-white"></i>
    <span class="position-absolute bg-danger text-white rounded-pill d-flex justify-content-center align-items-center" style="top: -5px; right: -5px; width: 22px; height: 22px; font-size: 0.75rem; box-shadow: 0 0 0 2px white;">
      {{ count }}
    </span>
  </button>

  <button
      class="btn btn-secondary position-fixed bottom-0 start-0 m-3
        shadow rounded-circle d-flex justify-content-center align-items-center position-relative z-1"
      style="width: 70px; height: 70px; font-size: 1.6rem;"
      @click="onToggleSearchBar()"
  >
    <i class="bi bi-search text-white"></i>
  </button>
</template>

<script setup>
defineProps({
  count: Number
});
const emit = defineEmits(['toggle-searchBar']);
function onToggleSearchBar() {
  emit('toggle-searchBar');
}

</script>