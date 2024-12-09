import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave } from "react-icons/fa";

const VoucherModal = ({
                          showVoucherModal,
                          setShowVoucherModal,
                          editingVoucher,
                          handleAddEditCategory
                      }) => {
    const [loading, setLoading] = useState(false);

    const timestampToDate = (timestamp) =>
        timestamp ? new Date(timestamp).toISOString().split('T')[0] : '';

    const initialValues = {
        voucherName: editingVoucher?.voucherName || '',
        startDate: timestampToDate(editingVoucher?.startDate),
        endDate: timestampToDate(editingVoucher?.endDate),
        maxDiscountAmount: editingVoucher?.maxDiscountAmount || '',
        minValueOrder: editingVoucher?.minValueOrder || '',
        quantity: editingVoucher?.quantity || '',
        discountPercentage: editingVoucher?.discountPercentage || '',
    };

    const validationSchema = Yup.object({
        voucherName: Yup.string().required('Tên mã giảm giá không được để trống'),
        startDate: Yup.date().required('Ngày bắt đầu không được để trống'),
        endDate: Yup.date()
            .required('Ngày kết thúc không được để trống')
            .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
        maxDiscountAmount: Yup.number()
            .typeError('Giá trị phải là số')
            .min(0, 'Số tiền giảm tối đa không được âm')
            .required('Số tiền giảm tối đa không được để trống'),
        minValueOrder: Yup.number()
            .typeError('Giá trị phải là số')
            .min(0, 'Giá trị đơn hàng tối thiểu không được âm')
            .required('Giá trị đơn hàng tối thiểu không được để trống'),
        quantity: Yup.number()
            .typeError('Giá trị phải là số')
            .min(1, 'Số lượng phải lớn hơn 0')
            .required('Số lượng không được để trống'),
        discountPercentage: Yup.number()
            .typeError('Giá trị phải là số')
            .min(0, 'Phần trăm giảm giá không được âm')
            .max(100, 'Phần trăm giảm giá không được vượt quá 100')
            .required('Phần trăm giảm giá không được để trống'),
    });

    const handleFormSubmit = (values, { setSubmitting }) => {
        setLoading(true);

        // Chuyển startDate và endDate từ YYYY-MM-DD sang timestamp
        const updatedValues = {
            ...values,
            startDate: new Date(values.startDate).getTime(),
            endDate: new Date(values.endDate).getTime(),
        };

        handleAddEditCategory(updatedValues); // Gọi callback xử lý ở component cha

        setSubmitting(false);
        setLoading(false);
        setShowVoucherModal(false); // Đóng modal sau khi submit
    };

    return (
        <Modal show={showVoucherModal} onHide={() => setShowVoucherModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{editingVoucher ? 'Cập nhật mã giảm giá' : 'Thêm mới mã giảm giá'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên mã giảm giá</Form.Label>
                                <Field name="voucherName" className="form-control" />
                                <ErrorMessage name="voucherName" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày bắt đầu</Form.Label>
                                <Field name="startDate" type="date" className="form-control" />
                                <ErrorMessage name="startDate" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày kết thúc</Form.Label>
                                <Field name="endDate" type="date" className="form-control" />
                                <ErrorMessage name="endDate" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Số tiền giảm tối đa</Form.Label>
                                <Field name="maxDiscountAmount" type="number" className="form-control" />
                                <ErrorMessage name="maxDiscountAmount" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá trị đơn hàng tối thiểu</Form.Label>
                                <Field name="minValueOrder" type="number" className="form-control" />
                                <ErrorMessage name="minValueOrder" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Field name="quantity" type="number" className="form-control" />
                                <ErrorMessage name="quantity" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phần trăm giảm giá</Form.Label>
                                <Field name="discountPercentage" type="number" className="form-control" />
                                <ErrorMessage name="discountPercentage" component="div" className="text-danger" />
                            </Form.Group>

                            <Button type="submit" disabled={isSubmitting || loading} className="w-100">
                                {loading ? 'Đang lưu...' : editingVoucher ? 'Cập nhật' : 'Thêm mới'} <FaSave className="ms-2" />
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default VoucherModal;
