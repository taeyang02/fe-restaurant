<template>
  <div class="container-fluid">
    <h1 class="mb-4 text-center">Menu</h1>

    <SearchBar
        v-show="isSearchVisible"
        @close-search="toggleSearchBar"
        @filter-menu="filterMenu"
        ref="searchBarRef"
    />

    <QuantityModal
        :selectedDish="selectedDish"
        @close="closeModal"
        @add="handleAddToCart"
    />

    <CartModal
        :cart="cart"
        @submitOrder="submitOrder"
        @updateQuantity="handleUpdateQuantity"
        @removeItem="handleRemoveItem"
    />
    <!-- Modal -->
    <MenuItem :menuData="filteredMenu" @selectDish="openQuantityModal"/>

    <CartButton
        :count="cart.length"
        @toggle-searchBar="toggleSearchBar"
    />
  </div>
</template>

<script>
import SearchBar from '@/components/menuPage/SearchBar.vue'
import MenuItem from '@/components/menuPage/MenuItem.vue'
import ButtonMenu from '@/components/menuPage/ButtonMenu.vue'
import QuantityModal from '@/components/menuPage/QuantityModal.vue'
import CartModal from '@/components/menuPage/CartModal.vue'
import {getProducts} from '@/api/menu.js'
import {createOrder} from '@/api/order.js'
import Swal from "sweetalert2"

export default {
  name: 'MenuPage',
  components: {
    SearchBar,
    MenuItem,
    CartButton: ButtonMenu,
    QuantityModal,
    CartModal
  },
  data() {
    return {
      fullMenuData: [],
      filteredMenu: [],
      cart: [],
      quantity: 1,
      selectedDish: null,
      isSearchVisible: false,
      lastScrollY: 0,
      searchBarRef: null,
      numberTable: new URLSearchParams(window.location.search).get('numberTable')
    }
  },
  mounted() {
    this.fetchMenu()
  },
  methods: {
    handleAddToCart(dishWithQty) {
      const existing = this.cart.find(i => i.id === dishWithQty.id)
      if (existing) {
        existing.quantity += dishWithQty.quantity
      } else {
        this.cart.push(dishWithQty)
      }
    }
    ,
    fetchMenu() {
      getProducts()
          .then((res) => {
            this.fullMenuData = res.data
            this.filteredMenu = res.data
          })
          .catch((err) => {
            console.error("Lỗi khi fetch menu:", err)
          })
    },
    openQuantityModal(dish) {
      this.quantity = 1
      this.selectedDish = dish;
    },

    closeModal() {
      this.selectedDish = null
    },

    handleUpdateQuantity({id, quantity}) {
      const item = this.cart.find(i => i.id === id) // ❌ bỏ `.value`
      if (item) item.quantity = quantity
    },

    handleRemoveItem(id) {
      this.cart = this.cart.filter(item => item.id !== id)
    },

    submitOrder() {
      if (this.cart.length === 0) {
        Swal.fire({icon: 'error', title: 'Lỗi!', text: 'Giỏ hàng trống', timer: 2000, showConfirmButton: false})
        return
      }

      const payload = {
        customerName: "Null",
        tableNum: this.numberTable,
        items: this.cart.map(i => ({dishId: i.id, quantity: i.quantity}))
      }

      createOrder(payload).then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Món ăn đã được gửi tới quầy thành công. Vui lòng đợi trong giây lát!!!',
            timer: 2000,
            showConfirmButton: false
          })
          this.cart = []
        } else {
          Swal.fire({icon: 'error', title: 'Lỗi!', text: res.data.message, timer: 2000, showConfirmButton: false})
        }
      }).catch((err) => {
        Swal.fire({icon: 'error', title: 'Lỗi!', text: err.message, timer: 2000, showConfirmButton: false})
      })

      const closeBtn = document.getElementById('closeCartModal')
      if (closeBtn) closeBtn.click()
    },

    toggleSearchBar() {
      this.isSearchVisible = !this.isSearchVisible
      if (this.isSearchVisible) {
        this.lastScrollY = window.scrollY
        this.$nextTick(() => {
          if (this.$refs.searchBarRef) {
            this.$refs.searchBarRef.focus()
          }
        })
      } else {
        this.closeSearch()
        this.$nextTick(() => {
          window.scrollTo({top: this.lastScrollY, behavior: 'auto'})
        })
      }
    },
    closeSearch() {
      this.isSearchVisible = false
      this.filteredMenu = this.fullMenuData
    },
    filterMenu(keyword) {
      if (!keyword) {
        this.filteredMenu = this.fullMenuData
        return
      }

      const lowerKeywords = keyword
          .toLowerCase()
          .split(/\s+/) // Tách thành các từ
          .filter(k => k) // Bỏ từ rỗng

      const seenDishNames = new Set()

      this.filteredMenu = this.fullMenuData
          .map(cat => {
            const uniqueDishes = cat.dish.filter(d => {
              const dishNameLower = d.dishName.toLowerCase()
              const matchesAll = lowerKeywords.every(kw => dishNameLower.includes(kw))
              if (matchesAll && !seenDishNames.has(dishNameLower)) {
                seenDishNames.add(dishNameLower)
                return true
              }
              return false
            })
            return uniqueDishes.length > 0 ? {name: cat.name, dish: uniqueDishes} : null
          })
          .filter(Boolean)
    }
  }
}
</script>

<style scoped>

</style>
