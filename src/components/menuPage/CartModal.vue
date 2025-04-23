<template>
  <!-- Modal Danh sách đặt -->
  <div class="modal fade" id="cartModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title-container">
            <h5 class="modal-title mb-0">Danh sách đặt</h5>
            <span class="text-danger d-block fst-italic small" v-if="cart.length > 0">Nhấn vào món nếu cần chỉnh sửa!</span>
          </div>
          <button id="closeCartModal" type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body scrollable-body">
          <template v-if="cart.length === 0">
            <p>Chưa chọn món nào.</p>
          </template>
          <template v-else>
            <div
                v-for="item in cart"
                :key="item.id"
                class="d-flex justify-content-between align-items-center mb-2"
                data-bs-toggle="modal" data-bs-target="#quantityModal"
                @click="openQuantityModal(item)"
            >
              <div class="flex-grow-1">
                <strong>{{ item.dishName }}</strong><br/>
                <span>{{ item.quantity }} x {{ item.price }} đ</span>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success w-100 btn-lg" @click="$emit('submitOrder')">
            Xác nhận đặt
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Cập nhật số lượng -->
  <div class="modal fade" id="quantityModal" tabindex="-1" ref="quantityModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cập nhật số lượng</h5>
          <button id="quantityModalClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  @click="closeQuantityCart()"></button>
        </div>
        <div class="modal-body text-center">
          <h6>{{ selectedItem?.dishName }}</h6>
          <div class="d-flex justify-content-center align-items-center my-3">
            <button class="btn btn-outline-secondary me-3" @click="decreaseQuantity">−</button>
            <input
                type="number"
                class="form-control text-center fs-4"
                style="width: 80px"
                v-model.number="quantityToUpdate"
                min="1"
            />
            <button class="btn btn-outline-secondary ms-3" @click="increaseQuantity">+</button>
          </div>
        </div>
        <div class="modal-footer d-flex w-100 gap-2">
          <button class="btn btn-danger" @click="removeItem">Xoá món</button>
          <button class="btn btn-success" @click="confirmUpdate">Xác nhận</button>
        </div>

      </div>
    </div>
  </div>

</template>

<script setup>
import {ref} from 'vue'

const emit = defineEmits(['updateQuantity', 'removeItem', 'submitOrder'])

defineProps({
  cart: {
    type: Array,
    default: () => []
  }
})

const selectedItem = ref(null)
const quantityToUpdate = ref(1)

function openQuantityModal(item) {
  // Set selected item and update quantity
  selectedItem.value = item
  quantityToUpdate.value = item.quantity
}

function increaseQuantity() {
  quantityToUpdate.value++
}

function decreaseQuantity() {
  if (quantityToUpdate.value > 1) quantityToUpdate.value--
}

function removeItem() {
  emit('removeItem', selectedItem.value.id,)
  closeQuantityCart()
}

function confirmUpdate() {
  document.getElementById('quantityModalClose').click();
  emit('updateQuantity', {
    id: selectedItem.value.id,
    quantity: quantityToUpdate.value
  })
}

function closeQuantityCart() {
  document.getElementById('menu-button').click();
}
</script>

<style scoped>

.modal-footer {
  justify-content: space-between;
}

.modal-footer {
  gap: 0px;
}

.modal-footer .btn { /* Assuming both buttons have the class btn */
  flex-grow: 1;
}

.modal-footer .btn-danger,
.modal-footer .btn-success {
  flex-grow: 1;
}

.scrollable-body {
  max-height: 300px;
  overflow-y: auto;
}

</style>
