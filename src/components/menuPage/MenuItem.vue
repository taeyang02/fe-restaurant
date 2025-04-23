<template>
  <div id="menuContainer">
    <div v-for="category in menuData" :key="category.id">
      <h4 class="mt-4 fw-bold">{{ category.name }}</h4>
      <div class="row">
        <div
            v-for="dish in category.dish"
            :key="dish.id"
            class="col-6 col-md-4 col-lg-3 mb-3"
        >
          <div
              class="card h-100 shadow-sm hover-shadow cursor-pointer square-card"
              @click="selectDish(dish)"
              style="cursor: pointer"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
          >
            <div class="card-body d-flex flex-column justify-content-between text-center">
              <h5 class="card-title text-truncate">{{ dish.dishName }}</h5>
              <p class="card-text fw-bold">{{ formatPrice(dish.price) }} đ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({menuData: Array});
const emit = defineEmits(['selectDish']);

const selectDish = (dish) => {
  emit('selectDish', dish);
};

const formatPrice = (price) => price.toLocaleString('vi-VN');
</script>
