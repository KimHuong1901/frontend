import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Table, Card } from "react-bootstrap";
import { enqueueSnackbar } from "notistack";
import * as orderService from "../service/OrderService";
import 'bootstrap/dist/css/bootstrap.min.css';

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const orderData = await orderService.getOrderById(id);
                setOrder(orderData);
            } catch (error) {
                enqueueSnackbar("Không thể tải thông tin đơn hàng", { variant: "error" });
            }
        };

        fetchOrderDetail();
    }, [id]);

    if (!order) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Chi tiết đơn hàng #{order.id}</h2>
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Thông tin</th>
                            <th>Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Mã đơn hàng</td>
                            <td>{order.id}</td>
                        </tr>
                        <tr>
                            <td>Sản phẩm</td>
                            <td>{order.products.name}</td>
                        </tr>
                        <tr>
                            <td>Loại sản phẩm</td>
                            <td>{order.products.type}</td>
                        </tr>
                        <tr>
                            <td>Giá (USD)</td>
                            <td>{order.products.price}</td>
                        </tr>
                        <tr>
                            <td>Số lượng</td>
                            <td>{order.quantity}</td>
                        </tr>
                        <tr>
                            <td>Tổng tiền</td>
                            <td>{order.total}</td>
                        </tr>
                        <tr>
                            <td>Ngày mua</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                        </tr>
                        </tbody>
                    </Table>
                    <Button variant="secondary" onClick={() => navigate("/orders")}>
                        Quay lại danh sách đơn hàng
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default OrderDetail;
