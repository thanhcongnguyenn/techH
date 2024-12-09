import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaThumbsUp, FaHeart } from "react-icons/fa";
import apiVoteService from "../../../api/apiVoteService";

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API khi component được mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await apiVoteService.getListsVoteProducts(productId);
                console.info("===========[] ===========[response] : ", response);
                setReviews(response.data || []); // Set danh sách đánh giá
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= rating ? "gold" : "#ddd",
                        fontSize: "18px",
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h3 className="mb-4">Product Reviews</h3>
            {reviews.length > 0 ? (
                <div className="mt-4">
                    {reviews.map((review, index) => (
                        <Card key={index} className="mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <h6 className="d-flex align-items-center">
                                            <strong>{review.createdBy || "Anonymous"}</strong>
                                            <Badge
                                                bg="success"
                                                className="ms-2"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Đã mua sản phẩm
                                            </Badge>
                                        </h6>
                                        <div className="d-flex align-items-center">
                                            {renderStars(review.rating || 0)}
                                            {review.recommend && (
                                                <span className="ms-3 text-danger">
                                                    <FaHeart /> Sẽ giới thiệu cho bạn bè, người thân
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2">{review.description || "No comment provided."}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No reviews available for this product.</p>
            )}
        </div>
    );
};

export default ProductReviews;
