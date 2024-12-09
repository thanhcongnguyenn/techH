import apiHelper from '../api/apiHelper';

const categoryService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/categories?${paramsSearch.toString()}`);
    },
    getListsGuest: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`categories?${paramsSearch.toString()}`);
    },

    add: (petData) => {
        return apiHelper.post('admin/category/create', petData);
    },

    update: (id, petData) => {
        return apiHelper.put(`admin/category/update`, petData);
    },

    delete: (id) => {
        console.info("===========[delete] ===========[id] : ",id);
        return apiHelper.get(`admin/category/deleteById/${id}`);
    }
};

export default categoryService;
