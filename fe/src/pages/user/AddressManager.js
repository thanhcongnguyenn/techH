import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Breadcrumb, Nav, Pagination } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiAddressService from "../../api/apiAddressService";
import {FaPlusCircle} from "react-icons/fa";
import AddressTable from "./components/address/AddressTable";
import AddressFormModal from "./components/address/AddressFormModal";
import ModelConfirmDeleteData from "../components/model-delete/ModelConfirmDeleteData";

const AddressManager = () => {
    const [tags, setTags] = useState([]);
    const [meta, setMeta] = useState({ total: 0, total_page: 1, page: 1, page_size: 10 });
    const [editingMenu, setEditingMenu] = useState(null);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [showSearchModal, setShowSearchModal] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [searchCriteria, setSearchCriteria] = useState({
        name: searchParams.get('name') || '',
    });

    const fetchTagsWithParams = async (params) => {
        try {
            const response = await apiAddressService.getLists(params);
            setTags(response.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        fetchTagsWithParams({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
    }, [searchParams]);

    const handleAddEditMenu = async (values) => {
        try {
			values = {
				...values
			}
            if (editingMenu) {
                const response = await apiAddressService.update(editingMenu.id, values);
            } else {
                const response = await apiAddressService.add(values);
            }
            const params = Object.fromEntries([...searchParams]);
            fetchTagsWithParams({ ...params, page: params.page || 0, page_size: params.page_size || 10 });
            setEditingMenu(null);
            setShowMenuModal(false);
        } catch (error) {
            console.error("Error adding/updating menu:", error);
        }
    };

    const handleDeleteData = async () => {
        try {
            await apiAddressService.delete(menuToDelete.id);
            const params = Object.fromEntries([...searchParams]);
            await fetchTagsWithParams({...params, page: params.page || 0, page_size: params.page_size || 10});
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    };

    const openMenuModal = (menu = null) => {
        setEditingMenu(menu);
        setShowMenuModal(true);
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
                            <Nav.Link as={Link} to="/admin/news/tag">Tags</Nav.Link>
                        </Nav.Item>
                        <Breadcrumb.Item active>Index</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Row className="gutters">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Quản lý địa chỉ</h2>
                        <div>
                            <Button size={'sm'} variant="primary" onClick={() => openMenuModal(null)}>
                                Thêm mới <FaPlusCircle className={'mx-1'} />
                            </Button>
                        </div>
                    </div>

                    <AddressTable
                        tags={tags}
                        openMenuModal={openMenuModal}
                        setMenuToDelete={setMenuToDelete}
                        setShowDeleteModal={setShowDeleteModal}
                    />
                </Col>
            </Row>

            <AddressFormModal
                showMenuModal={showMenuModal}
                setShowMenuModal={setShowMenuModal}
                editingMenu={editingMenu}
                handleAddEditMenu={handleAddEditMenu}
            />

            <ModelConfirmDeleteData
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDeleteData={handleDeleteData}
            />
        </Container>
    );
};

export default AddressManager;
