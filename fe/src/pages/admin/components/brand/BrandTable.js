import React from 'react';
import {Table, Button, ButtonGroup, Dropdown} from 'react-bootstrap';
import {FaEdit, FaListUl, FaTrash} from "react-icons/fa";
import StatusLabel from "../../../../helpers/StatusLabel";
import moment from "moment/moment";
import {createSlug} from "../../../../helpers/formatters";

const BrandTable = ({ categories, openCategoryModal, setCategoryToDelete, setShowDeleteModal }) => {
    return (
        <Table striped bordered hover responsive="md" className="text-center align-middle">
            <thead className="table-light">
            <tr>
                <th>#</th>
                <th className="text-start">Tên</th>
                <th className="text-start">Địa chỉ</th>
                <th className="text-start">SĐT</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {categories.map((category, index) => (
                <tr key={category?.id}>
                    <td>{index + 1}</td>
                    <td className="text-start">{category?.name}</td>
                    <td className="text-start">{category?.address}</td>
                    <td className="text-start">{category?.phone}</td>
                    <td>
                        <Button size="sm" variant="primary" onClick={() => openCategoryModal(category)} title="Cập nhật">
                            <FaEdit />
                        </Button>
                        <Button size="sm" className={'ms-2'} variant="danger" onClick={() => {
                            setCategoryToDelete(category);
                            setShowDeleteModal(true);
                        }} title="Xoá">
                            <FaTrash />
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default BrandTable;
