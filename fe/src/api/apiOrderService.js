import apiHelper from '../api/apiHelper';

const apiOrderService = {
    add: (data) => {
        return apiHelper.post('client/order/create', data);
    },
    createOrder: (data) => {
        return apiHelper.post(`admin/order`,data);
    },
    updateOrder: (id, data) => {
        return apiHelper.put(`admin/order/${id}`,data);
    },
    getListsAdmin: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/order/listOrder?${paramsSearch.toString()}`);
    },
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`client/order/listOrder?${paramsSearch.toString()}`);
    },
    deleteOrder: (id) => {
        return apiHelper.delete(`user/order/${id}`);
    },
    delete: (id) => {
        return apiHelper.delete(`admin/order/${id}`);
    },
    handleConfirmData: (id) => {
        return apiHelper.get(`admin/order/confirmedOrder/${id}`);
    },
    handleShipperOrderData: (id) => {
        return apiHelper.get(`admin/order/shipperOrder/${id}`);
    },
    updateOrderStatus: (id) => {
        return apiHelper.get(`client/order/cancelOrder/${id}`);
    },
    handleFaHandshakeData: (id) => {
        return apiHelper.get(`client/order/deliverdOrder/${id}`);
    },
    showDetail: (id) => {
        return apiHelper.get(`client/order/orderDetail/${id}`);
    },
    addCartItem: (data) => {
        return apiHelper.post(`client/cartItem/addToCart`,data);
    },
    updateCartItem: (data) => {
        return apiHelper.post(`client/cartItem/update`,data);
    },
    getListsCartItem: (data) => {
        return apiHelper.get(`client/cartItem/getList`);
    },
    removeCartItem: (id) => {
        return apiHelper.post(`client/cartItem/deletedById/${id}`);
    },
    addPayLater: (id) => {
        return apiHelper.post(`client/order/payLater/${id}`);
    }
};

export default apiOrderService;
