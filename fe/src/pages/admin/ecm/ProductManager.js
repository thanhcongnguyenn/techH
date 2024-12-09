import React, {useEffect, useState} from 'react';
import {
    Alert,
    Breadcrumb,
    Button,
    Col,
    Container,
    Dropdown, Form,
    Image,
    Modal,
    Nav,
    Pagination,
    Row,
    Table
} from 'react-bootstrap';
import productService from '../../../api/productService';
import {Link, useSearchParams} from "react-router-dom";
import ProductModal from '../components/product/ProductModal';
import DeleteConfirmationModal from '../components/product/ProductDeleteConfirmationModal';
import apiUpload from "../../../api/apiUpload";
import {FaEdit, FaPlusCircle, FaTrash} from "react-icons/fa";
import {createSlug} from "../../../helpers/formatters";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState({ total: 0, total_page: 1, page: 1, page_size: 10 });
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewAlbumImages, setPreviewAlbumImages] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showImportModalItem, setShowImportModalItem] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importSuccess, setImportSuccess] = useState(null);
    const [importError, setImportError] = useState(null);
    const [loadingImport, setLoadingImport] = useState(false);

    const defaultImage = "https://via.placeholder.com/150";

    const fetchProducts = async (params) => {
        try {
            const response = await productService.getLists(params);
            setProducts(response.data.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        fetchProducts({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
    }, [searchParams]);

    const handleAddEditProduct = async (values) => {
        const productData = {
            ...values,
            image: productImage || editingProduct?.avatar || defaultImage,
            content: description,
            categoryId: values.category,
        };
        try {
            
            const productData = {
                name: values.name || "",
                salePrice: values.salePrice || "",
                categoryId: values.category || "",
                code: values.code || "",
                quantity: values.number || 0,
                description: values.description || "",
                image: values.image || null,
                importPrice: values.importPrice || 0,
            };

            console.info("===========[] ===========[productData] : ",productData);

            if (editingProduct) {
                await productService.update(editingProduct.id, productData);
            } else {
                await productService.add(productData);
            }
            setEditingProduct(null);
            setShowProductModal(false);
            const params = Object.fromEntries([...searchParams]);
            fetchProducts({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
        } catch (error) {
            console.error("Error adding/updating product:", error);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            try {
                const response = await apiUpload.uploadImage(file);
                setProductImage(response.data);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await productService.delete(productToDelete.id);
            const params = Object.fromEntries([...searchParams]);
            fetchProducts({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const [importData, setImportData] = useState({
        importPrice: '',
        quantity: '',
        productCode: '',
    });

    const openProductModal = (product = null) => {
        setEditingProduct(product);
        setShowProductModal(true);

        if (product !== null) {
            setProductImage(product.avatar);
            // Nếu sản phẩm có album, chuyển album thành mảng đối tượng xem trước
            if (product.images) {
                setPreviewAlbumImages(
                    product.images.map((imageUrl) => ({
                        url: imageUrl,
                        file: null, // Để trống vì đây là ảnh đã tồn tại
                    }))
                );
            } else {
                setPreviewAlbumImages([]);
            }
        } else {
            setPreviewAlbumImages([]);
        }
    };

    const handleChangeImport = (e) => {
        const { name, value } = e.target;
        setImportData({ ...importData, [name]: value });
    };

    const handleImportItemSubmit = async () => {
        setLoadingImport(true);
        setImportSuccess(null);
        setImportError(null);

        try {
            await productService.importProduct(importData);
            setImportSuccess("Nhập hàng thành công!");
            setImportData({ importPrice: '', quantity: '', productCode: '' }); // Reset form
            setShowImportModal(false);
        } catch (error) {
            setImportError(error.response?.data?.message || "Lỗi nhập hàng!");
        } finally {
            setLoadingImport(false);
        }
    };


    const handlePageChange = (page) => {
        setSearchParams({ ...Object.fromEntries([...searchParams]), page });
        fetchProducts({ ...Object.fromEntries([...searchParams]), page });
    };

    const handlePageSizeChange = (eventKey) => {
        const pageSize = Number(eventKey);
        setSearchParams({ ...Object.fromEntries([...searchParams]), page_size: pageSize, page: 1 });
        fetchProducts({ ...Object.fromEntries([...searchParams]), page_size: pageSize, page: 1 });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImportProducts = async () => {
        try {
            const response = await productService.importProducts(importFile);
            console.log('Import thành công:', response.data);
            alert('Import sản phẩm thành công!');
            setShowImportModal(false);
        } catch (error) {
            console.error('Lỗi import sản phẩm:', error.response?.data || error.message);
            alert('Lỗi import sản phẩm!');
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
                            <Nav.Link as={Link} to="/admin/ecommerce/product">Sản phẩm</Nav.Link>
                        </Nav.Item>
                        <Breadcrumb.Item active>Index</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>


            {/* Modal Nhập hàng */}
            <Modal show={showImportModalItem} onHide={() => setShowImportModalItem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {importSuccess && <Alert variant="success">{importSuccess}</Alert>}
                    {importError && <Alert variant="danger">{importError}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá nhập</Form.Label>
                            <Form.Control
                                type="number"
                                name="importPrice"
                                value={importData.importPrice}
                                onChange={handleChangeImport}
                                placeholder="Nhập giá nhập"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={importData.quantity}
                                onChange={handleChangeImport}
                                placeholder="Nhập số lượng"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã sản phẩm</Form.Label>
                            <Form.Control
                                type="text"
                                name="productCode"
                                value={importData.productCode}
                                onChange={handleChangeImport}
                                placeholder="Nhập mã sản phẩm"
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportModalItem(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleImportItemSubmit}
                        disabled={loadingImport}
                    >
                        {loadingImport ? "Đang nhập..." : "Nhập hàng"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Import */}
            <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Import sản phẩm từ Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Chọn file Excel:</Form.Label>
                        <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleImportProducts}
                        disabled={loadingImport}
                    >
                        {loadingImport ? "Đang import..." : "Import"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row className="gutters">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Quản lý sản phẩm</h2>
                        <div>
                            <Button size={'sm'} variant="secondary" className={''} onClick={() => setShowImportModal(true)}>
                                Import Sản phẩm từ Excel
                            </Button>

                            <Button
                                variant="primary" size={'sm'} className={'ms-2'}
                                onClick={() => setShowImportModalItem(true)}
                            >
                                Nhập hàng
                            </Button>

                            <Button size={'sm'} variant="primary" className={'ms-2'} onClick={() => openProductModal(null)}>
                                Thêm mới <FaPlusCircle className={'mx-1'} />
                            </Button>
                        </div>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Avatar</th>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Số Lượng</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, index) => (
                            <tr key={product?.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <Image src={product?.image || defaultImage} alt="Product avatar" rounded style={{ width: '50px', height: '50px' }} />
                                </td>
                                <td>{product?.name} <br /><span>{product?.slug}</span></td>
                                <td>{product?.categoryName}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.salePrice)}</td>
                                <td>{product?.quantity}</td>
                                <td>
                                    <Button size="sm" variant="primary" onClick={() => openProductModal(product)} title="Cập nhật">
                                        <FaEdit />
                                    </Button>
                                    <Button size="sm" className={'ms-2'} variant="danger" onClick={() => { setProductToDelete(product); setShowDeleteModal(true); }} title="Xoá">
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Dropdown onSelect={handlePageSizeChange}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Hiển thị: {meta.page_size}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                                <Dropdown.Item eventKey="20">20</Dropdown.Item>
                                <Dropdown.Item eventKey="50">50</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={meta.page === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(Math.max(meta.page - 1, 1))} disabled={meta.page === 1} />
                            {[...Array(meta.total_page)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === meta.page}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(Math.min(meta.page + 1, meta.total_page))} disabled={meta.page === meta.total_page} />
                            <Pagination.Last onClick={() => handlePageChange(meta.total_page)} disabled={meta.page === meta.total_page} />
                        </Pagination>
                    </div>
                </Col>
            </Row>

            <ProductModal
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
                editingProduct={editingProduct}
                productImage={productImage}
                handleImageChange={handleImageChange}
                description={description}
                setDescription={setDescription}
                handleAddEditProduct={handleAddEditProduct}
                loading={loading}
                // previewAlbumImages={previewAlbumImages}
            />

            <DeleteConfirmationModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteProduct={handleDeleteProduct}
            />
        </Container>
    );
};

export default ProductManager;
