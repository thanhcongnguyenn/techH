import React, { useState, useEffect } from 'react';
import {Container, Row, Col, ButtonGroup, Dropdown, Table, Pagination, Button} from 'react-bootstrap';
import { useSearchParams } from "react-router-dom";
import OrderBreadcrumbs from './components/order/OrderBreadcrumbs';
import apiOrderService from "./../../api/apiOrderService";
import {FaCoins, FaHandshake, FaTrash} from "react-icons/fa";
import OrderDetailsModal from './components/order/OrderDetailsModal';
import ModelConfirmDeleteData from "../components/model-delete/ModelConfirmDeleteData";

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState({ total: 0, total_page: 1, page: 0, page_size: 10 });
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
        await fetchOrdersWithParams({
            ...params,
            page: params.page || 0,
            page_size: params.page_size || 10,
            status: selectedStatus || '',
        });
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setSearchParams({ ...Object.fromEntries([...searchParams]), status, page: 0 }); // Reset về trang 1
    };

    const fetchOrdersWithParams = async (params) => {
        try {
            const response = await apiOrderService.getLists({
                ...params,
                status: params.status || selectedStatus || '',
            });
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

        try {
            const response = await apiOrderService.showDetail(order.id);
            setOrderDetails(response.data);
            setSelectedOrder(order);
            setShowOrderModal(true);
            console.info("===========[] ===========[response] : ",response);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }

    };

    const handleDeleteData = async (order) => {
        try {
            await apiOrderService.updateOrderStatus(order.id);
            await refreshOrders();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };
     const handleFaHandshakeData = async (order) => {
            try {
                await apiOrderService.handleFaHandshakeData(order.id);
                await refreshOrders();
                setShowDeleteModal(false);
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    const handlePayLaterData = async (order) => {
        console.info("===========[] ===========[] : ",);
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await apiOrderService.addPayLater(order.id);
            if (response.status === 'success') {
                setIsLoading(false);
                window.open(response.data.urlVnpay, '_blank', 'noopener,noreferrer');
            }
            console.info("===========[] ===========[response] : ", response);
        } catch (error) {
            console.error("Error processing Pay Later:", error);
            alert("Đã xảy ra lỗi trong quá trình xử lý!");
        } finally {
            setIsLoading(false);
        }
    };

    const getVariant = (status) => {
        switch (status) {
            case 'PENDING':
                return 'primary';
            case 'CONFIRMED':
                return 'success';
            case 'SHIPPED':
                return 'info';
            case 'DELIVERED':
                return 'secondary';
            default:
                return 'danger';
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
                            <th>PT Thanh toán</th>
                            <th>Trạng thái</th>
                            <th>Trạng thái thanh toán</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, idx) => (
                            <tr key={order.id} style={{cursor: 'pointer'}}>
                                <td onClick={() => handleOrderClick(order)}>{order.id}</td>
                                <td onClick={() => handleOrderClick(order)}>{order.deliveryInfo}</td>
                                <td onClick={() => handleOrderClick(order)}>{formatCurrency(order.totalAmount)}</td>
                                <td onClick={() => handleOrderClick(order)}>{order?.paymentMethod || "COD"}</td>
                                <td onClick={() => handleOrderClick(order)}>
                                    <span className={`text-${getVariant(order.status)}`}>{order.status}</span>
                                </td>
                                <td>{order.paymentStatus === "true" ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                <td>
                                    {/*<Button*/}
                                    {/*    size="sm"*/}
                                    {/*    variant="primary"*/}
                                    {/*    onClick={() => handleUpdateOrderClick(order)}*/}
                                    {/*    title="Cập nhật"*/}
                                    {/*>*/}
                                    {/*    <FaEdit />*/}
                                    {/*</Button>*/}
                                    {order.status === "PENDING" && (
                                        <>
                                            <Button
                                                style={{padding: '2px', fontSize: '10px'}}
                                                size="sm"
                                                className="ms-2"
                                                variant="danger"
                                                onClick={() => handleDeleteData(order)}
                                                title="Huỷ đơn"
                                            >
                                                <FaTrash/> Huỷ đơn
                                            </Button>
                                            {/*<Button*/}
                                            {/*    style={{ padding: '2px', fontSize: '10px'}}*/}
                                            {/*    size="sm"*/}
                                            {/*    className="ms-2"*/}
                                            {/*    variant="success"*/}
                                            {/*    onClick={() => handleFaHandshakeData(order)}*/}
                                            {/*    title="Đã nhận hàng"*/}
                                            {/*>*/}
                                            {/*    <FaHandshake /> Đã nhận hàng*/}
                                            {/*</Button>*/}
                                        </>
                                    )}
                                    {order.status === "SHIPPED" && (
                                        <Button
                                            style={{padding: '2px', fontSize: '10px'}}
                                            size="sm"
                                            className="ms-2"
                                            variant="success"
                                            onClick={() => handleFaHandshakeData(order)}
                                            title="Đã nhận hàng"
                                        >
                                            <FaHandshake/> Đã nhận hàng
                                        </Button>
                                    )}
                                    {order.totalAmount > order.amountPaid && order.status === "DELIVERED" && order?.paymentMethod == "PAY_LATER" && (
                                        <Button
                                            style={{padding: '2px', fontSize: '10px'}}
                                            size="sm"
                                            className="ms-2"
                                            variant="primary"
                                            onClick={() => handlePayLaterData(order)}
                                            title="Trả góp"
                                        >
                                            <FaCoins/> Trả góp
                                        </Button>
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
                        {Array.from({ length: meta.totalPage }, (_, index) => (
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

            {/*<NewOrderModal*/}
            {/*    show={!!orderToUpdate}*/}
            {/*    onHide={() => setOrderToUpdate(null)}*/}
            {/*    orderToUpdate={orderToUpdate}*/}
            {/*    refreshOrders={refreshOrders} // Truyền hàm callback để làm mới danh sách đơn hàng*/}
            {/*/>*/}

            <ModelConfirmDeleteData
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteData={handleDeleteData}
            />
            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Đang xử lý...</span>
                    </div>
                </div>
            )}

        </Container>
    );
};

export default OrderManager;
