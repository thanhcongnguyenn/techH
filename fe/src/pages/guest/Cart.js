import React, {useState, useEffect, startTransition} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Row, Col, Button, Table, Form, Modal} from 'react-bootstrap';
import {addToCart, setAllCart} from "../../redux/slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import apiOrderService from "../../api/apiOrderService";
import toastr from "toastr";
import Select from 'react-select';
import apiAddressService from "../../api/apiAddressService";
import {FaCheckCircle, FaHome} from "react-icons/fa";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [addressUser, setAddressUser] = useState([]);
    const [itemCount, setItemCount] = useState(0); // Thêm state cho itemCount
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getLists().then(r => {
        });
        fetchTagsWithParams().then(r => {
        });
    }, []);

    const getLists = async () => {
        try {
            const response = await apiOrderService.getListsCartItem();
            setCartItems(response.data);
            console.info("===========[] ===========[response] : ", response);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }

    const fetchTagsWithParams = async (params) => {
        try {
            const response = await apiAddressService.getLists(params);
            setAddressUser(response.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    // Hàm cập nhật giỏ hàng vào localStorage
    const updateCartInLocalStorage = (items) => {
        const updatedCart = {
            items,
            itemCount: items.reduce((count, item) => count + item.quantity, 0) // Tính lại itemCount
        };
        setItemCount(updatedCart.itemCount); // Cập nhật itemCount trong state
        dispatch(setAllCart(items));
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = async (item, quantity) => {
        console.info("===========[] ===========[change quantity] : ");
        try {
            const response = await apiOrderService.updateCartItem({
                "productId": item.productId,
                "quantity": quantity
            });
            getLists().then(r => {
            });
            const items = item;
            const updatedCart = {
                items,
                itemCount: items.reduce((count, it) => count + it.quantity, 0) // Tính lại itemCount
            };
            setItemCount(updatedCart.itemCount); // Cập nhật itemCount trong state
            dispatch(setAllCart(items));
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleRemoveItem = async (item) => {
        try {
            const response = await apiOrderService.removeCartItem(item.id);
            getLists().then(r => {
            });
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };


    const handleCheckout = () => {
        startTransition(() => {
            navigate("/checkout");
        });
    };

    const handleConfirmPayment = async () => {
        try {
            // Định dạng dữ liệu theo yêu cầu của API
            const orderData = {
                user_id: user?.id, // Nếu bạn có lưu user_id trong Redux
                cartItemIds: cartItems.data.map(item => item.id), // ID sản phẩm trong giỏ hàng
                paymentMenthod: paymentMethod,
                addressIds: selectedAddresses.map(address => address.value),
                voucherId: 0,
                point: 0
            };


            const response = await apiOrderService.add(orderData);
            console.info("===========[] ===========[createOrder] : ", response);
            if (paymentMethod === "CARD") {
                window.open(response.data.urlVnpay, '_blank', 'noopener,noreferrer');
                // window.location.redirect = response.data.urlVnpay;
                return;
            }

            // Xóa giỏ hàng sau khi thanh toán thành công
            setCartItems([]);
            localStorage.removeItem('cart');
            toastr.success('Tạo giỏ hàng thành công', 'Thông báo');
            // Chuyển hướng đến trang thông báo thành công
            navigate('/');
        } catch (error) {
            console.error('Thanh toán thất bại:', error);
            // Xử lý lỗi (có thể hiển thị thông báo lỗi cho người dùng)
        }
    };

    return (
        <Container className="my-5">
            <h2>Giỏ hàng của bạn</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {cartItems.data?.length > 0 ? (
                    cartItems.data.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.productName}</td>
                            <td>{(item.price).toLocaleString('vi-VN')} vnđ</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                                    style={{width: '80px', display: 'inline-block'}}
                                />
                            </td>
                            <td>{(item.price * item.quantity).toLocaleString('vi-VN')} vnđ</td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveItem(item)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">Giỏ hàng của bạn đang trống</td>
                    </tr>
                )}
                </tbody>
            </Table>
            <h4 className="text-end">Tổng tiền: {cartItems.totalAmount?.toLocaleString('vi-VN')} vnđ</h4>
            <h5 className="text-end">Số lượng sản phẩm: {cartItems.data?.length}</h5> {/* Hiển thị itemCount */}
            <div className="d-flex justify-content-between mt-3">
                <Link className="text-white btn btn-danger text-decoration-none"
                      onClick={(e) => {
                          e.preventDefault();
                          startTransition(() => {
                              navigate("/");
                          });
                      }}
                      to={'/'}>
                    <FaHome className="me-2"/>
                    Tiếp tục mua sắm
                </Link>

                <Button variant="primary" onClick={handleCheckout}>
                    <FaCheckCircle className="me-2"/>
                    Thanh toán
                </Button>

                {/*<Button variant="danger" onClick={handleCheckout}>Thanh toán</Button>*/}
                {/*{cartItems.data?.length > 0 && (*/}
                {/*  */}
                {/*)}*/}
            </div>

            {/* Modal để nhập thông tin thanh toán */}
            <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Địa chỉ thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn phương thức thanh toán</Form.Label>
                            <Select
                                options={[
                                    {value: 'COD', label: 'Thanh toán khi nhận hàng (COD)'},
                                    {value: 'CARD', label: 'Thẻ tín dụng/Ghi nợ (CARD)'},
                                    {value: 'SPAYLATER', label: 'Trả sau (SPayLater)'}
                                ]}
                                onChange={(selectedOption) => {
                                    setPaymentMethod(selectedOption.value)
                                }}
                                placeholder="Chọn phương thức thanh toán"
                                defaultValue={{value: 'COD', label: 'Thanh toán khi nhận hàng (COD)'}}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckout(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmPayment}>
                        Xác nhận thanh toán
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Cart;
