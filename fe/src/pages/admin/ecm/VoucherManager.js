import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Button, Pagination, Breadcrumb, Nav} from 'react-bootstrap';
import {Link, useSearchParams} from "react-router-dom";
import apiVoucherService from '../../../api/apiVoucherService';
import CategorySearchModal from '../components/category/CategorySearchModal';
import {FaPlusCircle} from "react-icons/fa";
import ModelConfirmDeleteData from "../../components/model-delete/ModelConfirmDeleteData";
import VoucherTable from "../components/voucher/VoucherTable";
import VoucherModal from "../components/voucher/VoucherModal";

const VoucherManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [meta, setMeta] = useState({ total: 0, total_page: 1, page: 1, page_size: 10 });
    const [editingVoucher, setEditingCategory] = useState(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchCriteria, setSearchCriteria] = useState({
        name: searchParams.get('name') || '',
    });

    const fetchCategoriesWithParams = async (params) => {
        try {
            const response = await apiVoucherService.getLists(params);
            setVouchers(response.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        fetchCategoriesWithParams({ ...params, page: params.page || 1, page_size: params.page_size || 10 });
    }, [searchParams]);

    const handleSearch = (value, key) => {
        setSearchCriteria((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearchSubmit = () => {
        const newParams = { ...searchCriteria, page: 1 };
        setSearchParams(newParams);
        setShowSearchModal(false);
    };

    const handleResetSearch = () => {
        setSearchCriteria({ name: '' });
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ ...searchCriteria, page: newPage });
    };

    const handleAddEditCategory = async (values) => {
        setLoading(true);
        try {
            values = {
                ...values,
                id: editingVoucher?.id
            }
            if (editingVoucher) {
                const response = await apiVoucherService.update(editingVoucher.id, {...editingVoucher, ...values});
                const params = Object.fromEntries([...searchParams]);
                fetchCategoriesWithParams({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
            } else {
                const response = await apiVoucherService.add(values);
                const params = Object.fromEntries([...searchParams]);
                fetchCategoriesWithParams({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
            }
            setEditingCategory(null);
            setShowVoucherModal(false);
        } catch (error) {
            console.error("Error adding/updating category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteData = async () => {
        try {
            await apiVoucherService.delete(categoryToDelete.id);

        } catch (error) {
            console.error("Error deleting category:", error);
        } finally {

        }
        const params = Object.fromEntries([...searchParams]);
        await fetchCategoriesWithParams({...params, page: params.page || 0, page_size: params.page_size || 10});
        setShowDeleteModal(false);
    };

    const openCategoryModal = (category = null) => {
        setEditingCategory(category);
        setShowVoucherModal(true);
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
                            <Nav.Link as={Link} to="/admin/ecommerce/voucher">Mã giảm giá</Nav.Link>
                        </Nav.Item>
                        <Breadcrumb.Item active>Index</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Row className="gutters">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Quản lý mã giảm giá</h2>
                        <div>
                            <Button size={'sm'} variant="primary" onClick={() => openCategoryModal(null)}>
                                Thêm mới <FaPlusCircle className={'mx-1'} />
                            </Button>
                        </div>
                    </div>
                    <VoucherTable
                        vouchers={vouchers}
                        openCategoryModal={openCategoryModal}
                        setCategoryToDelete={setCategoryToDelete}
                        setShowDeleteModal={setShowDeleteModal}
                    />
                    {meta && meta.total > 0 && (
                        <Pagination>
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={meta.page === 1}
                            />
                            <Pagination.Prev
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1}
                            />
                            {Array.from({ length: meta.total_page }, (_, index) => (
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
                                disabled={meta.page === meta.total_page}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(meta.total_page)}
                                disabled={meta.page === meta.total_page}
                            />
                        </Pagination>
                    )}
                </Col>
            </Row>

            <VoucherModal
                showVoucherModal={showVoucherModal}
                setShowVoucherModal={setShowVoucherModal}
                editingVoucher={editingVoucher}
                handleAddEditCategory={handleAddEditCategory}
                loading={loading}
            />

            <ModelConfirmDeleteData
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteData={handleDeleteData}
            />

            <CategorySearchModal
                showSearchModal={showSearchModal}
                setShowSearchModal={setShowSearchModal}
                searchCriteria={searchCriteria}
                handleSearch={handleSearch}
                handleSearchSubmit={handleSearchSubmit}
                handleResetSearch={handleResetSearch}
            />
        </Container>
    );
};

export default VoucherManager;
