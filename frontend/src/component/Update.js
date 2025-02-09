import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import productService from "../service/ProductService";
import * as orderService from "../service/OrderService";
import 'bootstrap/dist/css/bootstrap.min.css';

function UpdateOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // Khởi tạo selectedProduct
    const [total, setTotal] = useState(0); // Khởi tạo total

    useEffect(() => {
        const fetchOrder = async () => {
            const data = await orderService.getOrderById(id);
            setOrder(data);
            setSelectedProduct(data.product); // Cập nhật sản phẩm đã chọn
            setTotal(data.product.price * data.quantity); // Tính tổng tiền ban đầu
        };

        const fetchProducts = async () => {
            const products = await productService.getAllProduct();
            setProducts(products);
        };

        fetchOrder();
        fetchProducts();
    }, [id]);

    if (!order || products.length === 0) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Cập nhật đơn hàng</h2>

            <Formik
                initialValues={{
                    date: order?.date || "",
                    quantity: order?.quantity || 0,
                    productId: order?.product?.id?.toString() || "", // Lưu ý sử dụng "productId"
                    total: total || 0,
                }}
                enableReinitialize
                validationSchema={Yup.object({
                    date: Yup.date().required("Ngày mua là bắt buộc"),
                    quantity: Yup.number().min(1, "Số lượng phải lớn hơn 0").required("Số lượng là bắt buộc"),
                    productId: Yup.string().required("Chọn sản phẩm là bắt buộc"),
                })}
                onSubmit={async (values) => {
                    const updatedOrder = {
                        id,
                        date: values.date,
                        quantity: values.quantity,
                        productId: values.productId,
                    };
                    const isUpdated = await orderService.updateOrder(updatedOrder);
                    if (isUpdated) {
                        enqueueSnackbar("Cập nhật đơn hàng thành công", { variant: "success" });
                        navigate("/orders");
                    } else {
                        enqueueSnackbar("Cập nhật đơn hàng thất bại", { variant: "error" });
                    }
                }}
            >
                {({ setFieldValue, values }) => {
                    const handleProductChange = (event) => {
                        const productId = event.target.value;
                        const product = products.find((p) => p.id === parseInt(productId));
                        setSelectedProduct(product);
                        setFieldValue("productId", productId);
                        setTotal(product ? product.price * (values.quantity || 0) : 0); // Cập nhật total
                    };

                    const handleQuantityChange = (event) => {
                        const qty = parseInt(event.target.value) || 0;
                        setFieldValue("quantity", qty);
                        setTotal(selectedProduct ? selectedProduct.price * qty : 0); // Cập nhật total
                    };

                    return (
                        <Form>
                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Ngày mua</BootstrapForm.Label>
                                <Field name="date" type="date" className="form-control" />
                                <ErrorMessage name="date" component="div" className="text-danger" />
                            </BootstrapForm.Group>

                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Số lượng</BootstrapForm.Label>
                                <Field name="quantity" type="number" className="form-control"
                                       onChange={handleQuantityChange} />
                                <ErrorMessage name="quantity" component="div" className="text-danger" />
                            </BootstrapForm.Group>

                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Sản phẩm</BootstrapForm.Label>
                                <Field as="select" name="productId" className="form-select"
                                       onChange={handleProductChange}>
                                    <option value="">Chọn sản phẩm</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - ${product.price}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="productId" component="div" className="text-danger" />
                            </BootstrapForm.Group>

                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Tổng tiền</BootstrapForm.Label>
                                <Field name="total" type="number" className="form-control" value={total} readOnly />
                            </BootstrapForm.Group>

                            <Button type="submit" variant="primary">Cập nhật đơn hàng</Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default UpdateOrder;
