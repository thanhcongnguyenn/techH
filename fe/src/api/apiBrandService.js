import apiHelper from '../api/apiHelper';

const apiBrandService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/brands?${paramsSearch.toString()}`);
    },
    getListsGuest: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`brands?${paramsSearch.toString()}`);
    },

    add: (petData) => {
        return apiHelper.post('admin/brand/create', petData);
    },

    update: (id, petData) => {
        return apiHelper.put(`admin/brand/update`, petData);
    },

    delete: (id) => {
        return apiHelper.get(`admin/brand/DeleteById/${id}`);
    }
};

export default apiBrandService;
