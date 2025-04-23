import request from '@/utils/request-be-app.js'

export function getProducts(data) {
    return request({
        url: 'menu',
        method: 'get',
    })
}