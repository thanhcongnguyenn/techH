import React from 'react';
import {Table, Button, ButtonGroup, Dropdown} from 'react-bootstrap';
import moment from "moment/moment";
import {FaEdit, FaListUl, FaTrash} from "react-icons/fa";

const AddressTable = ({ tags, openMenuModal, setMenuToDelete, setShowDeleteModal }) => {
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>SĐT</th>
                <th>Address</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {tags?.map((tag, index) => (
                <tr key={tag.id}>
                    <td>{index + 1}</td>
                    <td>{tag.toName}</td>
                    <td>{tag.phoneNumber}</td>
                    <td>{tag.address}</td>
                    <td>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <FaListUl/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => openMenuModal(tag)}>  <FaEdit /> Cập nhật</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setMenuToDelete(tag);
                                    setShowDeleteModal(true);
                                }}> <FaTrash /> Xoá</Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default AddressTable;
