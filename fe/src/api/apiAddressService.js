import apiHelper from '../api/apiHelper';

const apiAddressService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`client/address/getList?${paramsSearch.toString()}`);
    },
    add: (petData) => {
        return apiHelper.post('client/address/create', petData);
    },
    update: (id, petData) => {
        petData = {
            ...petData,
            id
        }
        return apiHelper.put(`client/address/update`, petData);
    },

    delete: (id) => {
        return apiHelper.put(`client/address/deleteById/${id}`);
    },
};

export default apiAddressService;
