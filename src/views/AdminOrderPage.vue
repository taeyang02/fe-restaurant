<template>
  <div class="container my-4">
    <h1 class="text-primary">📦 Danh sách đơn hàng mới</h1>
    <div id="orders">
      <div
          v-for="group in orderGroups"
          :key="group.no"
          class="card border-primary mb-3"
      >
        <div class="card-header">🧾 Order số {{ group.no }}</div>
        <div class="card-body">
          <div
              v-for="item in group.data"
              :key="item.orderCode"
              class="border-start border-secondary ps-3 mb-3"
          >
            🍽 Mã đơn: <strong>{{ item.orderCode }}</strong><br />
            🔢 Tên món: <strong>{{ item.dishName }}</strong><br />
            💰 Giá: <strong>{{ item.price }}</strong><br />
            🔢 SL: <strong>{{ item.quantity }}</strong><br />
            🧮 Tổng: <strong>{{ item.totalPrice }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getAllOrders } from "@/api/order.js"

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
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  methods: {
    connectSocket() {
      const socketUrl = import.meta.env.VITE_WS_URL;
      const socket = new SockJS(socketUrl);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
          {},
          (frame) => {
            console.log("✅ WebSocket đã kết nối:", frame);

            if (this.isFirstConnect || this.isReconnect) {
              getAllOrders().then(response => {
                this.orderGroups = response.data;
              })
            }

            this.stompClient.subscribe("/topic/orders", (message) => {
              const groups = JSON.parse(message.body);

              if (this.isReconnect) {
                this.orderGroups = [];
                this.isReconnect = false;
              }

              this.orderGroups.push(...groups);
            });

            this.isFirstConnect = false;
          },
          (error) => {
            console.error("❌ Không thể kết nối WebSocket:", error);
          }
      );
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
