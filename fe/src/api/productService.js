import apiHelper from '../api/apiHelper';

const productService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`/products?${paramsSearch.toString()}`);
    },

    getListsProducts: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`user/products?${paramsSearch.toString()}`);
    },

    add: (petData) => {
        return apiHelper.post('admin/product/create', petData);
    },

    update: (id, petData) => {
        return apiHelper.put(`admin/products/${id}`, petData);
    },

    delete: (id) => {
        return apiHelper.delete(`admin/products/${id}`);
    },
    addProduct: (petData) => {
        return apiHelper.post('user/products', petData);
    },

    updateProduct: (id, petData) => {
        return apiHelper.put(`user/products/${id}`, petData);
    },

    deleteProduct: (id) => {
        return apiHelper.delete(`user/products/${id}`);
    },
    /**
     * Import sản phẩm từ file Excel
     * @param {File} file - File Excel để import
     * @returns {Promise} - Promise từ API
     */
    importProducts: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiHelper.post('admin/import-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    /**
     * Nhập hàng cho sản phẩm
     * @param {Object} importData - Thông tin nhập hàng
     * @param {number} importData.importPrice - Giá nhập
     * @param {number} importData.quantity - Số lượng nhập
     * @param {string} importData.productCode - Mã sản phẩm
     * @returns {Promise} - Promise từ API
     */
    importProduct: (importData) => {
        return apiHelper.post('admin/importProduct', importData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
};

export default productService;
