import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import UserDashboard from '../pages/user/Dashboard';
import Profile from '../pages/user/Profile';
import { useSelector } from 'react-redux';
import PostManager from "../pages/user/PostManager";
import BoardingManager from "../pages/user/BoardingManager";
import OrderManager from "../pages/user/OrderManager";
import ProductManager from "../pages/user/ProductManager";
import AddressManager from "../pages/user/AddressManager";
import UpdatePassword from "../pages/user/UpdatePassword";

const UserRoutes = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // if (user?.role !== 'customer') {
    //     return null; // Trả về null nếu không phải là customer
    // }

    return (
        <Routes>
            <Route element={<UserLayout isAuthenticated={isAuthenticated} user={user} />}>
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="address" element={<AddressManager />} />
                <Route path="posts" element={<PostManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="boarding" element={<BoardingManager />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="update-password" element={<UpdatePassword />} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
