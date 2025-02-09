import axios from "axios";
const BASE_URL = "http://localhost:8080";
const getAllOrder = async (page=1, limit = 5) => {
    try{
        const result = await axios.get(BASE_URL + `/orders?_page=${page}&_limit=${limit}`);
        return result.data;
    } catch (error) {
        return [];
    }
}
const saveOrder = async (order) => {
    try {
        order.total = order.products.price * order.quantity;
        const result = await axios.post(BASE_URL + '/orders',order);
        return true;
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo mới đơn hàng: ", error.response ? error.response.data : error.message);
        return false;
    }
}
const updateOrder = async (order) => {
    try {
        const result = await axios.put(BASE_URL + `/orders/${order.id}`, order);
        return true;
    } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật đơn hàng:", error);
        return false;
    }
};
const searchOrder = async (searchQuery, startDate, endDate) => {
    try {
        if (!searchQuery && !startDate && !endDate) {

            return await axios.get(BASE_URL + "/orders");
        }
        if (startDate && endDate) {
            const ordersByDateRange = await axios.get(
                BASE_URL + `/orders?date_gte=${startDate}&date_lte=${endDate}&_sort=title&_order=asc`
            );
            return ordersByDateRange.data;
        }
        if (searchQuery) {
            const ordersByDate = await axios.get(
                BASE_URL + `/orders?date_like=${searchQuery}&_sort=title&_order=asc`
            );
            const ordersByProduct = await axios.get(
                BASE_URL + `/orders?products.name_like=${searchQuery}&_sort=title&_order=asc`
            );
            const allProducts = [...ordersByDate.data, ...ordersByProduct.data];
            const uniqueOrders = allProducts.filter((value, index, self) =>
                index === self.findIndex((t) => t.id === value.id)
            );

            return uniqueOrders;
        }

    } catch (error) {
        console.error(error);
        return [];
    }
};
const deleteOrder = async (orderId) => {
    try {
        await axios.delete(BASE_URL + `/orders/${orderId}`);
        return true;
    } catch (error) {
        console.error("Có lỗi xảy ra khi xóa đơn hàng này:", error);
        return false;
    }
};
const getOrderById = async (id) => {
    try {
        const response = await axios.get(BASE_URL + '/orders/' + id);
        return response.data;
    } catch (error){
        console.error("Không thể xem chi tiết vì :", error);
        return null;
    }
}

export { getAllOrder, saveOrder, updateOrder, searchOrder, deleteOrder,getOrderById };