import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import productService from "../service/ProductService";
import * as orderService from "../service/OrderService";
import 'bootstrap/dist/css/bootstrap.min.css';
function OrderCreate() {
    const [product, setProducts] = useState([]);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const list = await productService.getAllProduct();
            console.log("Danh sách sản phẩm" + list)
            setProducts( list);
        };
        fetchProducts();
    }, []);

    const validationSchema = Yup.object({
        date: Yup.string()
            .required("Thời gian là bắt buộc")
            .test("is-not-future-date", "Ngày phải nhỏ hơn ngày hiện tại", (value) => {
                const currentDate = new Date();
                const selectedDate = new Date(value);
                return selectedDate <= currentDate;
            }),
        quantity: Yup.number()
            .typeError("Số lượng phải là một số")
            .positive("Số lượng phải lớn hơn 0")
            .required(" Bắt buộc nhập"),
        productId: Yup.string().required("Phải chọn 1 sản phẩm")
    });

    const saveOrder = async (values) => {
        try {
            const orderData = {
                ...values,
                total,
                product: product.find((p) => p.id === parseInt(values.productId)) || null
            };

            const isSaved = await orderService.saveOrder(orderData);
            if (isSaved) {
                enqueueSnackbar("Order added successfully", { variant: "success" });
                navigate("/orders");
            } else {
                enqueueSnackbar("Failed to add order", { variant: "error" });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Error when adding order", { variant: "error" });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Thêm mới đơn hàng</h2>
            <Formik
                initialValues={{ date: "", quantity: "", productId: "" }}
                validationSchema={validationSchema}
                onSubmit={saveOrder}
            >
                {({ errors, touched, values, setFieldValue }) => {
                    const handleProductChange = (event) => {
                        const productId = event.target.value;
                        const selected = product.find((p) => p.id === parseInt(productId));
                        setSelectedProduct(selected);
                        setFieldValue("productId", productId);
                        setTotal(product ? product.price * (values.quantity || 0) : 0);
                    };

                    const handleQuantityChange = (event) => {
                        const qty = parseInt(event.target.value) || 0;
                        setFieldValue("quantity", qty);
                        setTotal(selectedProduct ? selectedProduct.price * qty : 0);
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
                                    {product.map((products) => (
                                        <option key={products.id} value={products.id}>
                                            {products.name} - ${products.price}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="productId" component="div" className="text-danger" />
                            </BootstrapForm.Group>

                            <BootstrapForm.Group className="mb-3">
                                <BootstrapForm.Label>Tổng tiền</BootstrapForm.Label>
                                <Field name="total" type="number" className="form-control" value={total} readOnly />
                            </BootstrapForm.Group>

                            <Button type="submit" variant="primary">Thêm đơn hàng</Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default OrderCreate;
