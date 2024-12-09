import React, {useEffect, useState} from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {FaSave, FaTimes} from "react-icons/fa";
import apiBrandService from "../../../../api/apiBrandService";

const CategoryModal = ({
                           showCategoryModal,
                           setShowCategoryModal,
                           editingCategory,
                           handleAddEditCategory
                       }) => {

    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandRes, labelsRes] = await Promise.all([
                    apiBrandService.getLists({ page: 1, page_size: 1000 }),
                ]);

                setBrands(brandRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{editingCategory ? 'Cập nhật' : 'Thêm mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: editingCategory?.name || '',
                        description: editingCategory?.description || '',
                        brandId: editingCategory?.brandId || 0,
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required('Tên danh mục không được để trống'),
                        description: Yup.string().required('Mô tả không được để trống'),
                        brandId: Yup.string().required('Thương hiệu không được để trống'),
                    })}
                    onSubmit={handleAddEditCategory}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên danh mục</Form.Label>
                                <Field name="name" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Thương hiệu</Form.Label>
                                <Field as="select" name="brandId" className="form-control">
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="brandId" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Field name="description" className="form-control" as="textarea" rows={3} />
                                <ErrorMessage name="description" component="div" className="text-danger" />
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

export default CategoryModal;
