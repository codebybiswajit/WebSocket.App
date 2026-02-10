// import createAxiosInstance from "../Utils/ApiServises";
import axios from "axios";
class UserReturnServices {
    route = '/api/user';
    // api = createAxiosInstance();
    getUserDetails = async () => { return await axios.get(`${this.route}/all`) }
}
export default new UserReturnServices();
