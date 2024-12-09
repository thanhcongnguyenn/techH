import apiHelper from '../api/apiHelper';

const userService = {
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/users?${paramsSearch.toString()}`);
    },

    add: (petData) => {
        return apiHelper.post('admin/users', petData);
    },

    update: (id, petData) => {
        return apiHelper.put(`admin/users/${id}`, petData);
    },

    delete: (id) => {
        return apiHelper.delete(`admin/users/${id}`);
    },
    getProfile: (id) => {
        return apiHelper.get(`myInfo`);
    },
    updateProfile: (data) => {
        return apiHelper.put(`me`,data);
    },
    activeAccount: (data) => {
        return apiHelper.post(`auth/active`,data);
    },
    forgotPassword: (data) => {
        return apiHelper.post(`forgotPassword`,data);
    },
    updatePassword: (data) => {
        return apiHelper.post(`user/changePassword`,data);
    },
    resetPassword: (data) => {
        return apiHelper.post(`resetPassword`,data);
    },
};

export default userService;
