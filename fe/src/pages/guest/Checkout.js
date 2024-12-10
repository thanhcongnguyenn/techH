import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import apiOrderService from './../../api/apiOrderService';
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import toastr from "toastr";
import apiAddressService from "../../api/apiAddressService";
import apiVoucherService from "../../api/apiVoucherService";
import Select from "react-select";
import {FaCheckCircle, FaShoppingCart, FaSpinner} from "react-icons/fa";

const Checkout = () => {

    const user = useSelector((state) => state.auth.user);
    const [userInfo, setUserInfo] = useState({
        name: user?.fullName || '',
        phone: user?.phone || '',
        address: user?.phone_number || '',
        email: user?.email || '',
    });

    console.info("===========[] ===========[user] : ", user);
    const [currentPoint, setCurrentPoint] = useState(0); // Điểm hiện có từ API
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [disCountPoint, setDisCountPoint] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [addressUser, setAddressUser] = useState([]);
    const [voucherList, setVoucherList] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [monthsToPay, setMonthsToPay] = useState(null);
    const [point, setPoint] = useState(0);
    const [payLater, setPaylater] = useState(0);

    const taxRate = 0;
    const shippingFee = 0;

    const navigate = useNavigate();

    useEffect(() => {
        getLists().then(r => {
        });
        getPoint();
        fetchTagsWithParams().then(r => {
        });
        fetchVouchers().then(r => {
        });
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await apiVoucherService.getListsGuest();
            setVoucherList(
                response.data.map((voucher) => ({
                    value: voucher.id,
                    label: `${voucher.voucherName} - Giảm giá: ${voucher.discountPercentage}%`,
                    voucherDetails: voucher,
                }))
            );
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };


    const getLists = async () => {
        try {
            const response = await apiOrderService.getListsCartItem();
            console.info("===========[data] ===========[response] : ", response.data);
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }
    const getPoint = async () => {
        try {
            const response = await apiOrderService.showPoint();
            console.info("===========[data] ===========[point] : ", response.data);
            setCurrentPoint(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }


    const handleUserInfoChange = (e) => {
        const {name, value} = e.target;
        setUserInfo({...userInfo, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Định dạng dữ liệu theo yêu cầu của API
            const orderData = {
                cartItemIds: cartItems.data.map(item => item.id), // ID sản phẩm trong giỏ hàng
                paymentMenthod: paymentMethod,
                addressIds: selectedAddresses.map(address => address.value),
                voucherId: selectedVoucher?.value || 0,
                point: point ? point : 0,
                monthsToPay: paymentMethod === "PAY_LATER" ? monthsToPay : null,
            };

            console.info("===========[] ===========[orderData] : ", orderData);
            const response = await apiOrderService.add(orderData);
            console.info("===========[] ===========[createOrder] : ", response);
            if (paymentMethod === "CARD" || paymentMethod === "PAY_LATER") {
                window.open(response.data.urlVnpay, '_blank', 'noopener,noreferrer');
                // window.location.redirect = response.data.urlVnpay;
                return;
            }

            // Xóa giỏ hàng sau khi thanh toán thành công
            setCartItems([]);
            localStorage.removeItem('cart');
            toastr.success('Xử lý đơn hàng thành công', 'Thông báo');
            // Chuyển hướng đến trang thông báo thành công
            navigate('/');
        } catch (error) {
            console.error('Xử lý đơn hàng thất bại:', error);
            // Xử lý lỗi (có thể hiển thị thông báo lỗi cho người dùng)
        }
    };

    const fetchTagsWithParams = async (params) => {
        try {
            const response = await apiAddressService.getLists(params);
            setAddressUser(response.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };


    // Tính thuế
    const calculateTax = (subtotal) => {
        return subtotal * taxRate;
    };

    const handlePaymentChange = (id) => {
        console.log('Phương thức thanh toán được chọn:', id);
        setPaymentMethod(id);
    };

    // Tính tổng tiền cuối cùng
    const calculateTotal = (subtotal, tax, shippingFee) => {
        return (subtotal + tax + shippingFee - discountAmount - disCountPoint + payLater) > 0 ? (subtotal + tax + shippingFee - discountAmount - disCountPoint + payLater) : 0;
    };

    // Xử lý khi người dùng nhấn "Áp dụng" mã giảm giá
    const handleApplyDiscount = (voucher) => {
        let discount = 0;


        if (cartItems.totalAmount < voucher.minValueOrder) {
            discount = 0;
        } else {
            // Tính toán discount dựa trên điều kiện voucher
            if ((cartItems.totalAmount * voucher.discountPercentage / 100) < voucher.maxDiscountAmount) {
                discount = (cartItems.totalAmount * voucher.discountPercentage) / 100;
            } else {
                discount = voucher.maxDiscountAmount;
            }
        }
        setDiscountAmount(discount)
    };

    const handleApplyDiscountPoint = (pointApply) => {
        setDisCountPoint(
            pointApply * 100
        )
    }

    const subtotal = cartItems.totalAmount;
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax, shippingFee);


    return (
        <Container>
            <h1 className="my-4">Thanh toán</h1>
            <Row>
                <Col md={7}>
                    <h4>Thông tin vận chuyển</h4>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleUserInfoChange}
                                placeholder="Nhập họ và tên"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleUserInfoChange}
                                placeholder="Nhập email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleUserInfoChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn địa chỉ</Form.Label>
                            <Select
                                isMulti
                                options={addressUser.map((address) => ({
                                    value: address.id,
                                    label: address.toName + ' | ' + address.phoneNumber + ' | ' + address.address
                                }))}
                                onChange={(selectedOptions) => setSelectedAddresses(selectedOptions)}
                                placeholder="Chọn địa chỉ giao hàng"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Voucher</Form.Label>
                            <Select
                                options={voucherList}
                                onChange={(selectedOption) => {
                                    setSelectedVoucher(selectedOption);
                                    handleApplyDiscount(selectedOption.voucherDetails);
                                }}
                                placeholder="Chọn mã giảm giá"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sử dụng điểm tích lũy</Form.Label>
                            <div style={{display: "flex", alignItems: "center"}}>
                                {/* Input cho phép nhập điểm muốn sử dụng */}
                                <Form.Control
                                    type="number"
                                    value={point}
                                    onChange={(e) => {
                                        if (e.target && e.target.value !== undefined) {
                                            setPoint(Number(e.target.value));
                                            handleApplyDiscountPoint(e.target.value);
                                        }
                                    }}
                                    placeholder="Nhập số điểm bạn muốn sử dụng"
                                    min="0"
                                    style={{flex: 1, marginRight: "10px"}}
                                />

                                {/* Hiển thị điểm hiện có */}
                                <span style={{whiteSpace: "nowrap", fontWeight: "bold"}}>
                                    Điểm hiện có: {currentPoint}
                                </span>
                            </div>
                        </Form.Group>
                        <h4>Phương thức thanh toán</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn phương thức thanh toán</Form.Label>
                            <Select
                                options={[
                                    {value: 'COD', label: 'Thanh toán khi nhận hàng (COD)'},
                                    {value: 'CARD', label: 'Thẻ tín dụng/Ghi nợ (CARD)'},
                                    {value: 'PAY_LATER', label: 'Trả sau (SPayLater)'}
                                ]}
                                onChange={(selectedOption) => {
                                    handlePaymentChange(selectedOption.value)
                                    if (selectedOption.value === "PAY_LATER") {
                                        setPaylater(subtotal * 10 / 100);
                                    } else {
                                        setPaylater(0); // Reset giá trị nếu không phải PAYLATER
                                    }
                                }}
                                placeholder="Chọn phương thức thanh toán"
                                defaultValue={{value: 'COD', label: 'Thanh toán khi nhận hàng (COD)'}}
                            />
                        </Form.Group>
                        {paymentMethod === "PAY_LATER" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Số tháng trả góp</Form.Label>
                                <Select
                                    options={[
                                        {value: 3, label: "3 tháng"},
                                        {value: 6, label: "6 tháng"},
                                        {value: 9, label: "9 tháng"},
                                        {value: 12, label: "12 tháng"},
                                    ]}
                                    onChange={(selectedOption) =>
                                        setMonthsToPay(selectedOption.value)
                                    }
                                    placeholder="Chọn số tháng trả góp"
                                />
                            </Form.Group>
                        )}


                        <div className="d-flex justify-content-between align-items-center">
                            <Link
                                className="font-italic text-white btn btn-danger"
                                to="/cart"
                            >
                                <FaShoppingCart className="me-2"/>
                                Về giỏ hàng
                            </Link>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="me-2 spinner-border spinner-border-sm"/>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="me-2"/>
                                        Xác nhận thanh toán
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col md={5}>
                    <div className="checkout-summary">
                        <h5 className="mb-4">Sản phẩm:</h5>
                        <div>
                            {cartItems?.data?.map((item, index) => (
                                <div key={index} className="d-flex mb-3 align-items-center">
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            marginRight: "10px",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    <div style={{flex: 1}}>
                                        <p className="mb-1">{item.productName}</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="mb-0">
                                            <strong>{(item.price * item.quantity)} vnđ</strong>
                                        </p>
                                        <small className="text-muted">x{item.quantity}</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr/>
                        <div className="summary-details">
                            <div className="d-flex justify-content-between">
                                <span>Tạm tính:</span>
                                <span>{subtotal} vnd</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Thuế (VAT):</span>
                                <span>{tax} vnđ</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Phí vận chuyển:</span>
                                <span>{shippingFee} vnđ</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="d-flex justify-content-between">
                                    <span>Giảm giá:</span>
                                    <span>-{discountAmount} vnđ</span>
                                </div>
                            )}
                            {disCountPoint > 0 && (
                                <div className="d-flex justify-content-between">
                                    <span>Đổi điểm:</span>
                                    <span>-{disCountPoint} vnđ</span>
                                </div>
                            )}
                            {payLater > 0 && (
                                <div className="d-flex justify-content-between">
                                    <span>Phí trả sau:</span>
                                    <span>+{payLater} vnđ</span>
                                </div>
                            )}
                            <hr/>
                            <div className="d-flex justify-content-between">
                                <strong>Tổng cộng:</strong>
                                <strong>{total} vnđ</strong>
                            </div>
                        </div>

                        {/*<div className="mt-4">*/}
                        {/*    <p className="mb-2">Bạn có mã phiếu giảm giá?</p>*/}
                        {/*    <div className="d-flex">*/}
                        {/*        <Form.Control*/}
                        {/*            type="text"*/}
                        {/*            placeholder="Nhập mã giảm giá..."*/}
                        {/*            value={discountCode}*/}
                        {/*            onChange={(e) => setDiscountCode(e.target.value)}*/}
                        {/*        />*/}
                        {/*        <Button variant="danger" onClick={handleApplyDiscount} className="ms-2">*/}
                        {/*            Áp dụng*/}
                        {/*        </Button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;
