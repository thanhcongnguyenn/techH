import apiHelper from '../api/apiHelper';

const dashboardService = {
    getDashboard: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/dashboard?${paramsSearch.toString()}`);
    },
    getFetchMonthlyRevenue: (params) => {
        // const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/order/getMonthlyRevenue/${params}`);
    },
    getFetchDailyRevenue: (data) => {
        return apiHelper.post(`admin/order/getDailyRevenue`,data);
    },
    getFetchNewOrder: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/dashboard/fetch-order-news?${paramsSearch.toString()}`);
    },
    getFetchNewUser: (params) => {
        const paramsSearch = new URLSearchParams(params);
        return apiHelper.get(`admin/dashboard/fetch-user-news?${paramsSearch.toString()}`);
    },
    getStatistics: () => {
        return apiHelper.get(`admin/statistic`);
    }
};

export default dashboardService;
