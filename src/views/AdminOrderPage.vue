<template>
  <div class="container my-4">
    <h1 class="text-primary">📦 Danh sách đơn hàng mới</h1>
    <div id="orders">
      <template v-if="orderGroups.length === 0">
        <p class="text-muted fst-italic">Hiện tại chưa có order nào</p>
      </template>
      <template v-else>
        <div
            v-for="group in orderGroups"
            :key="group.no"
            class="card border-primary mb-3 shadow-sm"
        >
          <div class="card-header d-flex justify-content-between align-items-center">
            🧾 Order số {{ String(group.no).slice(8) }}
            <button
                class="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                @click="markOrderDone(group.no)"
            >
              <i class="bi bi-check-circle"></i> Hoàn tất Order
            </button>
          </div>
          <div class="card-body">
            <div
                v-for="item in group.data"
                :key="item.id"
                class="border-start border-secondary ps-3 mb-3 d-flex justify-content-between align-items-center"
            >
              <div>
                🔢 Tên món: <strong>{{ item.dishName }}</strong><br />
                💰 Giá: <strong>{{ item.price }}</strong><br />
                🔢 SL: <strong>{{ item.quantity }}</strong><br />
                🧮 Tổng: <strong>{{ item.totalPrice }}</strong>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getAllOrders, updateDoneOrder } from "@/api/order.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      stompClient: null,
      orderGroups: [],
      isReconnect: false,
      isFirstConnect: true,
    };
  },
  mounted() {
    this.connectSocket();
    this.loadInitialOrders();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  methods: {
    async loadInitialOrders() {
      try {
        const response = await getAllOrders();
        this.orderGroups = response.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "❌ Lỗi khi tải danh sách đơn hàng",
        });
      }
    },
    connectSocket() {
      const socketUrl = import.meta.env.VITE_WS_URL;
      const socket = new SockJS(socketUrl);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
          {},
          (frame) => {
            console.log("✅ WebSocket đã kết nối:", frame);

            this.stompClient.subscribe("/topic/orders", (message) => {
              const groups = JSON.parse(message.body);

              // Nếu reconnect thì clear để tránh lặp đơn (giống logic cũ)
              if (this.isReconnect) {
                this.orderGroups = [];
                this.loadInitialOrders(); // gọi lại API khi reconnect
                this.isReconnect = false;
                return;
              }

              // Push đơn mới nhưng check trùng tránh bị duplicate
              for (const newGroup of groups) {
                if (!this.orderGroups.some(g => g.no === newGroup.no)) {
                  this.orderGroups.push(newGroup);
                }
              }
            });

            this.isFirstConnect = false;
          },
          (error) => {
            console.error("❌ Không thể kết nối WebSocket:", error);
          }
      );
    },

    markOrderDone(groupNo) {
      updateDoneOrder(groupNo).then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Good Job!!!',
            timer: 2000,
            showConfirmButton: false
          })
          this.orderGroups = this.orderGroups.filter(group => group.no !== groupNo);
        } else {
          Swal.fire({icon: 'error', title: 'Lỗi!', text: res.data.errors, timer: 2000, showConfirmButton: false})
        }
      }).catch((err) => {
        Swal.fire({icon: 'error', title: 'Lỗi!', text: err.errors, timer: 2000, showConfirmButton: false})
      })
    },

    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        console.log("🔄 Quay lại tab, reconnect WebSocket nếu cần...");

        if (this.stompClient?.connected) {
          this.stompClient.disconnect(() => {
            console.log("⛔ Socket cũ ngắt, reconnect...");
            this.isReconnect = true;
            this.connectSocket();
          });
        } else {
          this.isReconnect = true;
          this.connectSocket();
        }
      }
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
