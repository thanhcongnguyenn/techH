import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSave, FaTimes } from "react-icons/fa";

const AddressFormModal = ({ showMenuModal, setShowMenuModal, editingMenu, handleAddEditMenu }) => {
    const [formValues, setFormValues] = useState({
        toName: '',
        phoneNumber: '',
        address: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingMenu) {
            setFormValues({
                toName: editingMenu.toName,
                phoneNumber: editingMenu.phoneNumber,
                address: editingMenu.address,
            });
        } else {
            setFormValues({ toName: '', phoneNumber: '', address : ''});
        }
    }, [editingMenu]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng nhập lại giá trị
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.toName.trim()) {
            newErrors.toName = 'Tên là bắt buộc.';
        }
        if (!formValues.phoneNumber.trim()) {
            newErrors.phoneNumber = 'SĐT là bắt buộc.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            handleAddEditMenu(formValues);
            setShowMenuModal(false);  // Đóng modal khi submit thành công
        }
    };

    return (
        <Modal show={showMenuModal} onHide={() => setShowMenuModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{editingMenu ? 'Cập nhật' : 'Thêm mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="menuName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="toName"
                            value={formValues.toName}
                            onChange={handleChange}
                            placeholder="Tên "
                            isInvalid={!!errors.toName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.toName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="menuDescription" className="mt-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="phoneNumber"
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                            rows={1}
                            placeholder="SĐT"
                            isInvalid={!!errors.phoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phoneNumber}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="address" className="mt-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formValues.address}
                            onChange={handleChange}
                            placeholder="Address"
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="d-flex justify-content-between align-items-center" size="sm" variant="danger" onClick={() => setShowMenuModal(false)}>
                    Huỷ bỏ <FaTimes />
                </Button>
                <Button className="d-flex justify-content-between align-items-center" size="sm" variant="primary" onClick={handleSubmit}>
                    {editingMenu ? 'Cập nhật' : 'Thêm mới'} <FaSave className="ms-2" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddressFormModal;
