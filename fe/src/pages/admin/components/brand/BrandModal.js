import React from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {FaSave, FaTimes} from "react-icons/fa";

const BrandModal = ({
                           showCategoryModal,
                           setShowCategoryModal,
                           editingCategory,
                           handleAddEditCategory
                       }) => {
    return (
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{editingCategory ? 'Thêm mới' : 'Cập nhật'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: editingCategory?.name || '',
                        address: editingCategory?.address || '',
                        phone: editingCategory?.phone || '',
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required('Tên không được để trống'),
                        address: Yup.string().required('Địa chỉ không được để trống'),
                        phone: Yup.string().required('SĐT không được để trống'),
                    })}
                    onSubmit={handleAddEditCategory}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên</Form.Label>
                                <Field name="name" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Field name="address" className="form-control" as="textarea" rows={1} />
                                <ErrorMessage name="address" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>SĐT</Form.Label>
                                <Field name="phone" className="form-control" as="textarea" rows={1} />
                                <ErrorMessage name="phone" component="div" className="text-danger" />
                            </Form.Group>

                            <Button type="submit" className="d-flex justify-content-between align-items-center" size="sm" variant="primary">
                                {editingCategory ? 'Cập nhật' : 'Thêm mới'} <FaSave className="ms-2" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default BrandModal;
