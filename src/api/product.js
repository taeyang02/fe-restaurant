import request from '../utils/request-be-app.js';

// API: Tìm kiếm sản phẩm với phân trang
export function searchProducts(data, page = 0, size = 10) {
    return request({
        url: `/products/search`,
        method: 'post',
        params: { page, size },
        data
    });
}

// API: Lấy danh sách tất cả sản phẩm
export function getAllProducts() {
    return request({
        url: `/products`,
        method: 'get',
    });
}
