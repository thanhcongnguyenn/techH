import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Nav, Row, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import './style/Profile.css';
import userService from "../../api/userService";
import { toast } from "react-toastify";

const UpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.oldPassword) {
            newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
        }
        if (!formData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
        }
        if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = "Xác nhận mật khẩu không khớp.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) {
            return;
        }

        const updatedData = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        };

        try {
            setLoading(true);
            await userService.updatePassword(updatedData); // API đổi mật khẩu
            toast.success("Cập nhật mật khẩu thành công!");
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Cập nhật mật khẩu thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Row className="gutters mt-3">
                <Col xl={12}>
                    <Breadcrumb>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/user/profile">Tài khoản</Nav.Link>
                        </Nav.Item>
                        <Breadcrumb.Item active>Cập nhật mật khẩu</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={6}>
                    <h3>Cập nhật mật khẩu</h3>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu cũ</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="oldPassword"
                                        value={formData.oldPassword}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.oldPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.oldPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.newPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.confirmPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleSaveChanges} disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdatePassword;
