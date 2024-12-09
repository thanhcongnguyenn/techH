import apiHelper from '../api/apiHelper';

const apiVoucherService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/voucher/getList?${paramsSearch.toString()}`);
    },
    getListsGuest: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`client/voucher/getList`);
    },

    add: (petData) => {
        return apiHelper.post('admin/voucher/create', petData);
    },

    update: (id, petData) => {
        delete petData.voucherNo;
        delete petData.createdDate;
        return apiHelper.post(`admin/voucher/update`, petData);
    },

    delete: (id) => {
        return apiHelper.get(`admin/voucher/deleteById/${id}`);
    },
};

export default apiVoucherService;
