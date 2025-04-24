import request from '@/utils/request-be-app.js'

// Function to create an order
export function createOrder(data) {
    return request({
        url: '/orders/create',
        method: 'post',
        data
    })
}

export function getAllOrders() {
    return request({
        url: '/orders',
        method: 'get',
    })
}
