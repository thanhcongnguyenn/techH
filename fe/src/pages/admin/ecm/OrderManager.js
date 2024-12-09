import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Pagination, Dropdown } from 'react-bootstrap';
import { useSearchParams } from "react-router-dom";
import OrderBreadcrumbs from '../components/order/OrderBreadcrumbs';
import apiOrderService from "../../../api/apiOrderService";
import {FaEdit, FaHandshake, FaPlusCircle, FaTrash} from "react-icons/fa";
import OrderDetailsModal from '../components/order/OrderDetailsModal';
import ModelConfirmDeleteData from "../../components/model-delete/ModelConfirmDeleteData";
import NewOrderModal from '../components/order/NewOrderModal';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState({ total: 0, total_page: 1, page: 1, page_size: 10 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null); // State quản lý đơn hàng để cập nhật
    const [searchParams, setSearchParams] = useSearchParams();
    const [orderDetails , setOrderDetails] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Hàm để gọi lại API và tải danh sách đơn hàng mới nhất
    const refreshOrders = async () => {
        const params = Object.fromEntries([...searchParams]);
        await fetchOrdersWithParams({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
    };

    const fetchOrdersWithParams = async (params) => {
        try {
            const response = await apiOrderService.getListsAdmin(params);
            setOrders(response.data.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        refreshOrders();
    }, [searchParams]);

    const handleOrderClick = async (order) => {
        const response = await apiOrderService.showDetail(order.id);
        setOrderDetails(response.data);
        setSelectedOrder(order);

        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setSearchParams({ ...Object.fromEntries([...searchParams]), status, page: 0 }); // Reset về trang 1
    };
    
    const handleDeleteData = async () => {
        try {
            await apiOrderService.delete(orderToDelete.id);
            await refreshOrders();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleConfirmData = async (order) => {
        try {
            await apiOrderService.handleConfirmData(order.id);
            await refreshOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };
    const handleShipperOrderData = async (order) => {
        try {
            await apiOrderService.handleShipperOrderData(order.id);
            await refreshOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    const handleUpdateOrderClick = (order) => {
        if (order.status !== 'completed') {
            setOrderToUpdate(order); // Mở modal ở chế độ cập nhật với order được chọn
        } else {
            alert("Không thể chỉnh sửa đơn hàng đã hoàn tất.");
        }
    };

    const getVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'primary';
            case 'completed':
                return 'success';
            case 'canceled':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (
        <Container>
            <Row className="gutters mt-3">
                <Col xl={12}>
                    <OrderBreadcrumbs />
                </Col>
            </Row>
            <Row className="gutters">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Quản lý đơn hàng</h2>
                        {/*<Button size="sm" variant="primary" onClick={() => setOrderToUpdate({})}>*/}
                        {/*    Thêm mới <FaPlusCircle className="mx-1" />*/}
                        {/*</Button>*/}
                        <Dropdown onSelect={handleStatusChange}>
                            <Dropdown.Toggle variant="secondary" id="status-dropdown">
                                {selectedStatus || "Lọc theo trạng thái"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="PENDING">Pending</Dropdown.Item>
                                <Dropdown.Item eventKey="CONFIRMED">Confirmed</Dropdown.Item>
                                <Dropdown.Item eventKey="SHIPPED">Shipper</Dropdown.Item>
                                <Dropdown.Item eventKey="DELIVERED">Delivered</Dropdown.Item>
                                <Dropdown.Item eventKey="CANCELLED">Cancelled</Dropdown.Item>
                                <Dropdown.Item eventKey="PAY_LATER">Pay later</Dropdown.Item>
                                <Dropdown.Item eventKey="">Tất cả</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, idx) => (
                            <tr key={order.id} style={{cursor: 'pointer'}}>
                                <td onClick={() => handleOrderClick(order)}>{order.id}</td>
                                <td onClick={() => handleOrderClick(order)}>{order.deliveryInfo}</td>
                                <td onClick={() => handleOrderClick(order)}>{formatCurrency(order.totalAmount)}</td>
                                <td onClick={() => handleOrderClick(order)}>
                                    <span className={`text-${getVariant(order.status)}`}>{order.status}</span>
                                </td>
                                <td>
                                    {order.status === "PENDING" && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="ms-2"
                                                variant="danger"
                                                onClick={() => handleDeleteData(order)}
                                                title="Huỷ đơn"
                                                style={{padding: '2px', fontSize: '10px'}}
                                            >
                                                <FaTrash/> Huỷ đơn
                                            </Button>
                                            <Button
                                                style={{padding: '2px', fontSize: '10px'}}
                                                size="sm"
                                                className="ms-2"
                                                variant="success"
                                                onClick={() => handleConfirmData(order)}
                                                title="Xác nhận đơn"
                                            >
                                                <FaHandshake/> Xác nhận đơn
                                            </Button>
                                        </>
                                    )}
                                    {order.status === "CONFIRMED" && (
                                        <>
                                            <Button
                                                style={{padding: '2px', fontSize: '10px'}}
                                                size="sm"
                                                className="ms-2"
                                                variant="success"
                                                onClick={() => handleShipperOrderData(order)}
                                                title="Giao Shipper"
                                            >
                                                <FaHandshake/> Giao Shipper
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={meta.page === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                        />
                        {Array.from({length: meta.totalPage}, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === meta.page}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(meta.page + 1)}
                            disabled={meta.page === meta.totalPage}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(meta.totalPage)}
                            disabled={meta.page === meta.totalPage}
                        />
                    </Pagination>
                </Col>
            </Row>

            <OrderDetailsModal
                show={showOrderModal}
                orderDetails={orderDetails}
                onHide={() => setShowOrderModal(false)}
                order={selectedOrder}
            />

            <NewOrderModal
                show={!!orderToUpdate}
                onHide={() => setOrderToUpdate(null)}
                orderToUpdate={orderToUpdate}
                refreshOrders={refreshOrders} // Truyền hàm callback để làm mới danh sách đơn hàng
            />

            <ModelConfirmDeleteData
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteData={handleDeleteData}
            />
        </Container>
    );
};

export default OrderManager;
