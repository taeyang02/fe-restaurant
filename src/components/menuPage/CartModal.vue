<template>
  <div class="modal fade" id="cartModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Danh sách đặt</h5>
          <button id="closeCartModal" type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <template v-if="cart.length === 0">
            <p>Chưa chọn món nào.</p>
          </template>
          <template v-else>
            <p v-for="item in cart" :key="item.id">
              {{ item.dishName }} - {{ item.quantity }} x {{ item.price }} đ
            </p>
          </template>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success w-100 btn-lg" @click="$emit('submitOrder')">Xác nhận đặt</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cart: {
    type: Array,
    default: () => []
  }
})
</script>
