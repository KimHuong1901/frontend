import React, { useEffect, useState } from "react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import * as orderService from "../service/OrderService.js";
import { Table, Button, InputGroup, FormControl, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {InfoCircle, Pencil, Search, Trash} from 'react-bootstrap-icons';

function OrdersList() {
    const { enqueueSnackbar } = useSnackbar();
    const [orders, setOrders] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        getAll(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const getAll = async (page, limit) => {
        try {
            let orders;
            if (!searchQuery && !startDate && !endDate) {
                orders = await orderService.getAllOrder(page, limit);
            } else {
                orders = await orderService.searchOrder(searchQuery, startDate, endDate);
            }

            setOrders(orders);
            const totalOrders = orders.length;
            setTotalCount(totalOrders);
            setTotalPages(Math.ceil(totalOrders / limit));

            if (orders.length === 0) {
                enqueueSnackbar("Không tìm thấy đơn hàng nào", { variant: "warning" });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Không thể tải danh sách", { variant: "error" });
        }
    };

    const handleSearchClick = () => {
        getAll(currentPage, itemsPerPage);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleDeleteOrder = async (orderId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this order?");
        if (isConfirmed) {
            const isDelete = await orderService.deleteOrder(orderId);
            if(isDelete) {
                enqueueSnackbar("Xóa thành công", { variant: "success" });
            }else {
                enqueueSnackbar("Có lỗi xảy ra khi xóa", { variant: "error" });
            }
        }
    };
    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const handleUpdateOrder = async (orderId) => {
        try {
            navigate(`/orders/${orderId}`);
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Error updating order", { variant: "error" });
        }
    };
    const handleViewOrderDetails = (orderId) => {
        navigate(`/orders/${orderId}`);
    };
    return (
        <div className="container mt-4">
            <Row className="mb-4">
                <Col xs="auto" className="d-flex align-items-center">
                    <h5 className="me-1">Danh sách từ:</h5>
                    <InputGroup className="me-3">
                        <FormControl
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </InputGroup>
                    đến ngày:
                    <InputGroup className="me-3">
                        <FormControl
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </InputGroup>
                    <Button variant="outline-primary" onClick={handleSearchClick}>
                        <Search style={{ color: 'blue' }} />
                    </Button>
                </Col>
            </Row>

            <h1 className="text-center text-primary mb-4">Thống kê đơn hàng</h1>
            <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá(USD)</th>
                    <th>Loại sản phẩm</th>
                    <th>Ngày mua</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.id}</td>
                            <td>{order.products.name}</td>
                            <td>{order.products.price}</td>
                            <td>{order.products.type}</td>
                            <td>{formatDate(order.date)}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total}</td>
                            <td>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="ms-2"
                                        style={{ height: '40px', width: '40px', padding: '0' }}
                                        onClick={() => handleUpdateOrder(order.id)}>
                                        <Pencil style={{ color: 'white', fontSize: '20px', margin: 'auto' }} />
                                    </Button>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDeleteOrder(order.id)}>
                                            <Trash style={{color: 'white', fontSize: '20px', margin: 'auto'}}/>
                                        </Button>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="ms-2"
                                            style={{ height: '40px', width: '40px', padding: '0' }}
                                            onClick={() => handleViewOrderDetails(order.id)}>
                                            <InfoCircle style={{ color: 'white', fontSize: '20px', margin: 'auto' }} />
                                        </Button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center">Không có đơn hàng nào.</td>
                    </tr>
                )}
                </tbody>
            </Table>
            <Col xs="auto" className="d-flex justify-content-end">
                <Button variant="success" onClick={() => navigate("/orders/create")}>
                    Thêm mới đơn hàng
                </Button>
            </Col>
        </div>
    );
}

export default OrdersList;
