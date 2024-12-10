import React, {useState, useEffect} from 'react';
import {Breadcrumb, Col, Container, Nav, Row, Card, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import dashboardService from "../../api/dashboardService";
import {FaDatabase, FaPencilAlt, FaUser} from "react-icons/fa";
import {FaCartShopping, FaPencil} from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [statistics, setStatistics] = useState({
        countUser: 0,
        countProduct: 0,
        countOrder: 0,
        totalArticles: 0
    });

    // Khởi tạo dữ liệu biểu đồ với cấu trúc mặc định
    const [monthlyRevenueData, setMonthlyRevenueData] = useState({
        labels: [],
        datasets: [{label: 'Revenue', data: []}]
    });

    const [dailyRevenueData, setDailyRevenueData] = useState({
        labels: [],
        datasets: [{label: 'Daily Revenue', data: []}]
    });

    const [newMembers, setNewMembers] = useState([]);
    const [newOrders, setNewOrders] = useState([]);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [revenueDataDayli, setRevenueDataDayli] = useState([]);
    const [revenueDataMonthli, setRevenueDataMonthli] = useState([]);
    useEffect(() => {
        // Gọi các hàm để lấy dữ liệu cần thiết
        fetchStatistics();
        fetchMonthlyRevenue(selectedYear);
        fetchDailyRevenue(selectedMonth);
        fetchNewMembers();
        fetchNewOrders();
    }, [selectedYear, selectedMonth]);

    const fetchStatistics = async () => {
        try {
            const response = await dashboardService.getStatistics();
            console.info("===========[response] ===========[] : ", response);
            setStatistics({
                countUser: response.data.countUser,
                countProduct: response.data.countProduct,
                countOrder: response.data.countOrder,
                totalArticles: statistics.totalArticles,
            });
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year); // Cập nhật năm được chọn
    };
    const fetchMonthlyRevenue = async (year) => {
        try {

            const response = await dashboardService.getFetchMonthlyRevenue(year);
            setRevenueDataMonthli(response.data);
            // Format dữ liệu từ API
            const formattedData = {
                labels: response.data.map((item) => item.date), // Trích xuất tháng
                datasets: [
                    {
                        label: 'Doanh thu (Revenue)',
                        data: response.data.map((item) => item.revenue), // Trích xuất doanh thu
                        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu cột biểu đồ
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Chi tiêu (Expenditure)',
                        data: response.data.map((item) => item.expenditure), // Trích xuất chi tiêu
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            };

            // Cập nhật state với dữ liệu đã format
            setMonthlyRevenueData(formattedData);
        } catch (error) {
            console.error("Error fetching monthly revenue:", error);
        }
    };


    const fetchDailyRevenue = async (selectedMonth) => {
        try {
            // Lấy ngày bắt đầu và ngày kết thúc của tháng hiện tại nếu không có tham số
            // const currentDate = new Date();
            const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString().split('T')[0];
            const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).toISOString().split('T')[0];

            const params = {
                startDate: startDate,
                endDate: endDate
            };

            const response = await dashboardService.getFetchDailyRevenue(params);
            setRevenueDataDayli(response.data);
            console.info("===========[getFetchDailyRevenue] ===========[] : ", response);

            // Format dữ liệu từ API để khớp với cấu trúc biểu đồ
            const formattedData = {
                labels: response.data.map((item) => item.date), // Trích xuất ngày
                datasets: [
                    {
                        label: 'Doanh thu (Revenue)',
                        data: response.data.map((item) => item.revenue), // Trích xuất doanh thu
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu cột
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            };

            // Cập nhật state để hiển thị trên biểu đồ
            setDailyRevenueData(formattedData);
        } catch (error) {
            console.error("Error fetching daily revenue:", error);
        }
    };

    const fetchNewMembers = async () => {
        try {
            const response = await dashboardService.getFetchNewUser({});
            console.info("===========[getFetchDailyRevenue] ===========[] : ", response);
            setNewMembers(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchNewOrders = async () => {
        // Giả lập danh sách đơn hàng mới
        try {
            const response = await dashboardService.getFetchNewOrder({});
            console.info("===========[getFetchDailyRevenue] ===========[] : ", response);
            setNewOrders(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
        // setNewOrders([
        //     { id: 1, orderNumber: 'ORD001', customer: 'John Doe', totalAmount: '$500', date: '2024-10-30' },
        //     { id: 2, orderNumber: 'ORD002', customer: 'Jane Smith', totalAmount: '$300', date: '2024-10-29' },
        // ]);
    };
    const handleMonthChange = (date) => {
        setSelectedMonth(date);
        console.log("Selected Month:", date);
    };
    const exportToExcelDaily = () => {
        if (revenueDataDayli.length === 0) {
            alert("Không có dữ liệu để xuất Excel!");
            return;
        }

        // Tạo một worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(revenueDataDayli);

        // Tạo một workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh Thu");

        // Xuất file Excel
        const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: "application/octet-stream"});

        // Tải file xuống
        saveAs(data, `DoanhThu_${new Date().toISOString()}.xlsx`);
    };

    const exportToExcelMonthly = () => {
        if (revenueDataDayli.length === 0) {
            alert("Không có dữ liệu để xuất Excel!");
            return;
        }

        // Tạo một worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(revenueDataDayli);

        // Tạo một workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh Thu");

        // Xuất file Excel
        const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: "application/octet-stream"});

        // Tải file xuống
        saveAs(data, `DoanhThu_${new Date().toISOString()}.xlsx`);
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
                            <Nav.Link as={Link} to="/Admin">Admin</Nav.Link>
                        </Nav.Item>
                        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Tổng số thành viên</Card.Title>
                            <Card.Text className={'d-flex align-items-center justify-content-center'}>
                                <FaUser/>
                                <span className={'m-lg-2'}>{statistics.countUser}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Tổng số đơn hàng</Card.Title>
                            <Card.Text className={'d-flex align-items-center justify-content-center'}>
                                <FaCartShopping/>
                                <span className={'m-lg-2'}>{statistics.countOrder}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Tổng số sản phẩm</Card.Title>
                            <Card.Text className={'d-flex align-items-center justify-content-center'}>
                                <FaDatabase/>
                                <span className={'m-lg-2'}>{statistics.countProduct}</span>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                {/*<Col md={3}>*/}
                {/*    <Card className="text-center">*/}
                {/*        <Card.Body>*/}
                {/*            <Card.Title>Tổng số bài viết</Card.Title>*/}
                {/*            <Card.Text className={'d-flex align-items-center justify-content-center'}>*/}
                {/*                <FaPencilAlt />*/}
                {/*                <span className={'m-lg-2'}>{statistics.totalArticles}</span>*/}
                {/*            </Card.Text>*/}
                {/*        </Card.Body>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
            </Row>

            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <Card.Title className="mb-0">Biểu đồ doanh thu theo tháng</Card.Title>
                                <select
                                    className="form-select w-auto"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                >
                                    {[2023, 2024, 2025].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {/* Nút xuất Excel */}
                                {/*<button*/}
                                {/*    className="btn btn-success"*/}
                                {/*    onClick={exportToExcelMonthly}*/}
                                {/*>*/}
                                {/*    Xuất Excel*/}
                                {/*</button>*/}
                            </div>
                            <Bar data={monthlyRevenueData}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <Card.Title>Biểu đồ doanh thu các ngày trong tháng</Card.Title>
                                <DatePicker
                                    selected={selectedMonth}
                                    onChange={handleMonthChange}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    className="form-control w-auto"
                                />
                                {/* Nút xuất Excel */}
                                {/*<button*/}
                                {/*    className="btn btn-success"*/}
                                {/*    onClick={exportToExcelDaily}*/}
                                {/*>*/}
                                {/*    Xuất Excel*/}
                                {/*</button>*/}
                            </div>
                            <Bar data={dailyRevenueData}/>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/*<Row className="mt-4">*/}
            {/*    <Col md={6}>*/}
            {/*        <Card>*/}
            {/*            <Card.Body>*/}
            {/*                <Card.Title>Danh sách thành viên mới</Card.Title>*/}
            {/*                <Table striped bordered hover>*/}
            {/*                    <thead>*/}
            {/*                    <tr>*/}
            {/*                        <th>ID</th>*/}
            {/*                        <th>Name</th>*/}
            {/*                        <th>Email</th>*/}
            {/*                        <th>Joined Date</th>*/}
            {/*                    </tr>*/}
            {/*                    </thead>*/}
            {/*                    <tbody>*/}
            {/*                    {newMembers.map((member) => (*/}
            {/*                        <tr key={member.id}>*/}
            {/*                            <td>{member.id}</td>*/}
            {/*                            <td>{member.name}</td>*/}
            {/*                            <td>{member.email}</td>*/}
            {/*                            <td>{member.joinedDate}</td>*/}
            {/*                        </tr>*/}
            {/*                    ))}*/}
            {/*                    </tbody>*/}
            {/*                </Table>*/}
            {/*            </Card.Body>*/}
            {/*        </Card>*/}
            {/*    </Col>*/}
            {/*    <Col md={6}>*/}
            {/*        <Card>*/}
            {/*            <Card.Body>*/}
            {/*                <Card.Title>Danh sách đơn hàng mới</Card.Title>*/}
            {/*                <Table striped bordered hover>*/}
            {/*                    <thead>*/}
            {/*                    <tr>*/}
            {/*                        <th>ID</th>*/}
            {/*                        /!*<th>Order Number</th>*!/*/}
            {/*                        /!*<th>Customer</th>*!/*/}
            {/*                        <th>Total Amount</th>*/}
            {/*                        <th>Date</th>*/}
            {/*                    </tr>*/}
            {/*                    </thead>*/}
            {/*                    <tbody>*/}
            {/*                    {newOrders.map((order) => (*/}
            {/*                        <tr key={order.id}>*/}
            {/*                            <td>{order.id}</td>*/}
            {/*                            /!*<td>{order.orderNumber}</td>*!/*/}
            {/*                            /!*<td>{order.customer}</td>*!/*/}
            {/*                            <td>{order.totalAmount}</td>*/}
            {/*                            <td>{order.date}</td>*/}
            {/*                        </tr>*/}
            {/*                    ))}*/}
            {/*                    </tbody>*/}
            {/*                </Table>*/}
            {/*            </Card.Body>*/}
            {/*        </Card>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </Container>
    );
};

export default AdminDashboard;
