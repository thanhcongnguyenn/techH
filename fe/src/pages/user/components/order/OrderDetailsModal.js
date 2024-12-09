import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import apiVoteService from '../../../../api/apiVoteService';
const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

const OrderDetailsModal = ({ show, orderDetails, onHide, order }) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        description: "",
        image: "",
    });

    const handleOpenReviewModal = (product) => {
        setCurrentProduct(product);
        setShowReviewModal(true);
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRatingChange = (rating) => {
        setReviewData((prevData) => ({ ...prevData, rating }));
    };

    const handleReviewSubmit = async () => {
        try {
            const payload = {
                productId: currentProduct.id,
                rating: reviewData.rating,
                description: reviewData.description,
                image: reviewData.image, // Bạn có thể tích hợp upload ảnh sau
            };

            const response = await apiVoteService.createVote(payload);
            console.info("===========[] ===========[response] : ",response);
            if (response?.status) {
                setShowReviewModal(false);
            } else {
                console.error("Lỗi đánh giá:", response);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Đã xảy ra lỗi khi gửi đánh giá!");
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Customer: {order?.guestInfo?.name}</h5>
                    <h5>Phone: {order?.guestInfo?.phone}</h5>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderDetails?.map((transaction, idx) => (
                            <tr key={transaction.id}>
                                <td>{idx + 1}</td>
                                <td>{transaction.productName}</td>
                                <td>{transaction.quantity}</td>
                                <td>{formatCurrency(transaction.price)}</td>
                                <td>{formatCurrency(transaction.price * transaction.quantity)}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => handleOpenReviewModal(transaction)}
                                    >
                                        Đánh giá
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Sản phẩm: {currentProduct?.productName}</h5>
                    <Form.Group>
                        <Form.Label>Số sao:</Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                    key={star}
                                    variant={reviewData.rating === star ? "warning" : "outline-warning"}
                                    onClick={() => handleRatingChange(star)}
                                    className="me-1"
                                >
                                    {star} ⭐
                                </Button>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Nội dung đánh giá:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={reviewData.description}
                            onChange={handleReviewChange}
                            placeholder="Nhập nội dung đánh giá..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleReviewSubmit}>
                        Gửi đánh giá
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OrderDetailsModal;
