import axios from "axios";
const getAllProduct = async () => {
    try{
        const response = await axios.get("http://localhost:8080/api/products");
        return response.data;
    }catch(error){
        console.log(error);
        return [];
    }
}
export default {getAllProduct};