import request from '../utils/request-be-app.js';

// API: Lấy danh sách tất cả các loại đơn vị
export function getAllUnitTypes() {
    return request({
        url: `/unit-types`,
        method: 'get',
    });
}
