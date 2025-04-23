<!-- src/components/menuPage/QuantityModal.vue -->
<template>
  <div class="modal fade" id="staticBackdrop"
       data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="quantityModalLabel">Món: {{ selectedDish?.dishName || 'Chưa chọn món' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeModal"
                  aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div class="d-flex justify-content-center align-items-center gap-3">
            <button class="btn btn-outline-secondary btn-lg px-3" @click="changeQty(-1)">-</button>
            <input
                type="number"
                class="form-control form-control-lg text-center"
                v-model.number="quantity"
                min="1"
                style="width: 80px;"
            />
            <button class="btn btn-outline-secondary btn-lg px-3" @click="changeQty(1)">+</button>
          </div>
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-success w-100 btn-lg"
              @click="addToCart"
              :disabled="quantity <= 0"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuantityModal',
  props: {
    selectedDish: Object
  },
  emits: ['close', 'add'],
  data() {
    return {
      quantity: 1
    }
  },
  watch: {
    selectedDish(newVal) {
      if (newVal) {
        this.quantity = 1
      }
    }
  },
  methods: {
    changeQty(delta) {
      this.quantity = Math.max(1, this.quantity + delta)
    },
    closeModal() {
      const cartModal = document.getElementById('cartModal')
      cartModal?.addEventListener('hidden.bs.modal', () => {
        document.getElementById('openCartModalBtn')?.focus()
      })
      this.$emit('close')
    },
    addToCart() {
      this.$emit('add', { ...this.selectedDish, quantity: this.quantity })
      document.querySelector('[data-bs-dismiss="modal"]').click()
    }
  }
}
</script>

<style scoped>
/* Ẩn nút tăng/giảm trên Chrome, Safari, Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Ẩn trên Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>