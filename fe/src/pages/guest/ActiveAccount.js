import React, {startTransition, useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './style/Login.css';
import { useDispatch, useSelector } from "react-redux";
import bgImage from '../../assets/images/bg-login.jpg';
import userService from "../../api/userService";
import slideService from "../../api/slideService";
import toastr from "toastr";

const ActiveAccount = () => {
    const initialValues = {
        username: '',
        verifyCode: ''
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth); // Add isAuthenticated
    const [slides, setSlides] = useState([]);

    // Lấy URL của hình ảnh từ slides (sử dụng hình ảnh đầu tiên trong danh sách)
    const backgroundImageUrl = slides.length > 0 ? slides[0].avatar : '';

    useEffect(() => {

    }, []);

    useEffect(() => {

    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Hàm gọi API để lấy danh sách slide
        const fetchSlides = async () => {
            try {
                const response = await slideService.getListsGuest({
                    page_site: "auth"
                });
                setSlides(response.data.data);
            } catch (error) {
                console.error("Error fetching slides:", error);
            }
        };

        fetchSlides();
    }, []);


    const validationSchema = Yup.object({
        username: Yup.string().required('Username không được để trống'),
        verifyCode: Yup.string().min(5, 'Mật khẩu phải >= 5 ký tự').required('Mã xác nhận được để trống')
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            console.info("===========[] ===========[values] : ",values);
            const response = await userService.activeAccount(values);
            if(response.status == "success") {
                toastr.success('Kích hoạt thành công, xin vui lòng đăng nhập', 'Success');
                navigate('/login');
            }
            console.info("===========[] ===========[response] : ",response);
        } catch (error) {
            console.error("Error fetching slides:", error);
            toastr.error('Kích hoạt thất bại, xin vui lòng thử lại', 'Error');
            navigate('/login');
        }
    };

    return (
        <Row className="no-gutter">
            <Col
                className="col-md-6 d-none d-md-flex bg-image"
                style={{ backgroundImage: `url(${backgroundImageUrl || bgImage})` }}
            ></Col>
            <Col className="col-md-6 bg-light">
                <div className="login d-flex align-items-center py-5">
                    <Container>
                        <Row>
                            <Col lg={12} xl={8} className="mx-auto">
                                <h4 className="display-6">Kích hoạt tài khoản</h4>
                                <p className="text-muted mb-4">Xin vui lòng điền đẩy đủ thông tin</p>
                                {error && error.trim() && <Alert variant="danger">{error}</Alert>}
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="mb-3">
                                                <label htmlFor="username">Username</label>
                                                <Field name="username" type="text" className="form-control" />
                                                <ErrorMessage name="username" component="div" className="text-danger" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="verifyCode">Code</label>
                                                <Field name="verifyCode" type="verifyCode" className="form-control" />
                                                <ErrorMessage name="verifyCode" component="div" className="text-danger" />
                                            </div>
                                            <Button type="submit" className="w-100" disabled={isSubmitting || loading}>
                                                {loading ? 'Logging in...' : 'Active'}
                                            </Button>
                                            <div className="text-center d-flex justify-content-between mt-4">
                                                <p>Bạn chưa có tài khoản? Đăng ký <Link
                                                    to={'/register'} className="font-italic text-muted"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        startTransition(() => {
                                                            navigate("/register");
                                                        });
                                                    }}
                                                >
                                                    <u>tại đây</u></Link>
                                                </p>
                                                <Link to={'/'} className="font-italic text-danger"
                                                      onClick={(e) => {
                                                          e.preventDefault();
                                                          startTransition(() => {
                                                              navigate("/");
                                                          });
                                                      }}
                                                >Trang chủ</Link>
                                            </div>
                                            <div className="text-center d-flex justify-content-between mt-4">
                                                <p>Code by <Link to={'/'} className="font-italic text-muted"><u>Phuphan</u></Link></p>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Col>
        </Row>
    );
};

export default ActiveAccount;
