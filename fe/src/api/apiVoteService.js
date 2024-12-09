import apiHelper from '../api/apiHelper';

const apiVoteService = {
    add: (data) => {
        return apiHelper.post('user/vote', data);
    },
    getListsAdmin: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/vote?${paramsSearch.toString()}`);
    },
    getLists: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`user/vote?${paramsSearch.toString()}`);
    },
    getListsVoteProducts: (id, params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`client/vote/getByProduct/${id}?${paramsSearch.toString()}`);
    },
    delete: (id) => {
        return apiHelper.delete(`admin/vote/${id}`);
    },
    /**
     * Gửi đánh giá sản phẩm
     * @param {Object} voteData - Dữ liệu đánh giá
     * @param {number} voteData.productId - ID sản phẩm
     * @param {number} voteData.rating - Đánh giá số sao (1-5)
     * @param {string} voteData.description - Nội dung đánh giá
     * @param {string} [voteData.image] - Ảnh kèm đánh giá (nếu có)
     * @returns {Promise} - Kết quả từ API
     */
    createVote: (voteData) => {
        return apiHelper.post(`client/vote/create`, voteData);
    },
};

export default apiVoteService;
