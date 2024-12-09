import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Spinner, Button, Card } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import categoryService from './../../../../api/categoryService';
import { formatCurrencyInput } from '../../../../helpers/formatters';
import apiUpload from "../../../../api/apiUpload";

const ProductModal = ({
                          showProductModal,
                          setShowProductModal,
                          editingProduct,
                          productImage,
                          handleImageChange,
                          handleAddEditProduct,
                          loading,
                          // previewAlbumImages
                      }) => {
    const [categories, setCategories] = useState([]);
    const [productLabels, setProductLabels] = useState([]);
    const [description, setDescription] = useState(editingProduct?.description || '');
    const [albumImages, setAlbumImages] = useState([]);
    const [previewAlbumImages, setPreviewAlbumImages] = useState([]);
    const defaultImage = "https://via.placeholder.com/150";
    const [previewAlbumImagesState, setPreviewAlbumImagesState] = useState(previewAlbumImages || []); // Lưu trữ album ảnh

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes] = await Promise.all([
                    categoryService.getLists({ page: 0, page_size: 1000 }),
                ]);

                setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleMainImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            // setProductImage(event.target.files[0]);
            try {
                const response = await apiUpload.uploadImage(event.target.files[0]);
                // setProductImage(response.data);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                // setLoading(false);
            }
        }
    };

    const handleAlbumImageChange = (event) => {
        const files = Array.from(event.target.files);
        setAlbumImages(prevImages => [...prevImages, ...files]);

        const newPreviewUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));

        setPreviewAlbumImages(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
    };

    const removeAlbumImage = (index) => {
        setAlbumImages(prevImages => prevImages.filter((_, i) => i !== index));
        setPreviewAlbumImages(prevPreviews => {
            URL.revokeObjectURL(prevPreviews[index].url);
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    
    console.info("===========[] ===========[productImage] : ",productImage);

    return (
        <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="xl" className="product-modal">
            <Modal.Header closeButton>
                <Modal.Title>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <Formik
                    initialValues={{
                        name: editingProduct?.name || '',
                        salePrice: editingProduct?.salePrice || '',
                        importPrice: editingProduct?.importPrice || '',
                        category: editingProduct?.category?.id || '',
                        code: editingProduct?.code || null
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required('Tên sản phẩm không được để trống'),
                        salePrice: Yup.number().required('Giá sản phẩm không được để trống').positive('Giá phải là số dương'),
                        importPrice: Yup.number().required('Giá nhập không được để trống').positive('Giá phải là số dương'),
                        category: Yup.string().required('Danh mục không được để trống'),
                        code: Yup.string().required('Code không được để trống'),
                    })}
                    onSubmit={(values) => {
                        handleAddEditProduct({ ...values, description, productImage, albumImages });
                    }}
                >
                    {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row className="h-100 g-0">
                                <Col md={4} className="border-end">
                                    <div className="p-3 h-100 d-flex flex-column">
                                        <Form.Group className="mb-3 flex-grow-0">
                                            <Form.Label>Ảnh chính sản phẩm</Form.Label>
                                            <div className="main-image-preview mb-2">
                                                <img
                                                    src={productImage ? productImage : defaultImage}
                                                    alt="Main Product"
                                                    className="img-fluid"
                                                    style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <Form.Control type="file" onChange={handleImageChange} />
                                        </Form.Group>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="p-3" style={{ height: '80vh', overflowY: 'auto' }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tên sản phẩm</Form.Label>
                                            <Field name="name" className="form-control" />
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Giá</Form.Label>
                                                    <Field
                                                        name="salePrice"
                                                        type="text"
                                                        className="form-control"
                                                        value={formatCurrencyInput(values.salePrice.toString())}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.replace(/\./g, "");
                                                            setFieldValue("salePrice", rawValue);
                                                        }}
                                                    />
                                                    <ErrorMessage name="salePrice" component="div" className="text-danger" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Giá nhập</Form.Label>
                                                    <Field
                                                        name="importPrice"
                                                        type="text"
                                                        className="form-control"
                                                        value={formatCurrencyInput(values.importPrice.toString())}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.replace(/\./g, "");
                                                            setFieldValue("importPrice", rawValue);
                                                        }}
                                                    />
                                                    <ErrorMessage name="importPrice" component="div" className="text-danger" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Số lượng</Form.Label>
                                                    <Field
                                                        name="number"
                                                        type="number"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="number" component="div" className="text-danger" />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Danh mục</Form.Label>
                                                    <Field as="select" name="category" className="form-control">
                                                        <option value="">Chọn danh mục</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="category" component="div" className="text-danger" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Code</Form.Label>
                                                    <Field
                                                        name="code"
                                                        type="text"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage name="code" component="div" className="text-danger" />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Mô tả</Form.Label>
                                            <ReactQuill
                                                value={description}
                                                onChange={setDescription}
                                                theme="snow"
                                            />
                                        </Form.Group>

                                        <div className="d-flex justify-content-end mt-3">
                                            <Button
                                                className="d-flex align-items-center"
                                                type="submit"
                                                variant="primary"
                                                disabled={isSubmitting || loading}
                                            >
                                                {loading ? (
                                                    <Spinner size="sm" className="me-2" />
                                                ) : (
                                                    <FaSave className="me-2" />
                                                )}
                                                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ProductModal;
