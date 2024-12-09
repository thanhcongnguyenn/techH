import React from 'react';
import {Table, Button, ButtonGroup, Dropdown} from 'react-bootstrap';
import {FaEdit, FaListUl, FaTrash} from "react-icons/fa";
import moment from "moment/moment";

const VoucherTable = ({ vouchers, openCategoryModal, setCategoryToDelete, setShowDeleteModal }) => {
    return (
        <Table striped bordered hover responsive="md" className="text-center align-middle">
            <thead className="table-light">
            <tr>
                <th>#</th>
                <th className="text-start">Tên Voucher</th>
                <th className="text-start">Số lượng</th>
                <th className="text-start">% giảm giá</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {vouchers.map((item, index) => (
                <tr key={item?.id}>
                    <td>{index + 1}</td>
                    <td className="text-start">{item?.voucherName}</td>
                    <td className="text-start">{item?.quantity}</td>
                    <td className="text-start">{item?.discountPercentage}</td>
                    <td>{moment(item?.createdDate).format('DD-MM-YYYY')}</td>
                    <td>
                        <Button size="sm" variant="primary" onClick={() => openCategoryModal(item)} title="Cập nhật">
                            <FaEdit />
                        </Button>
                        <Button size="sm" className={'ms-2'} variant="danger" onClick={() => {
                            setCategoryToDelete(item);
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

export default VoucherTable;
