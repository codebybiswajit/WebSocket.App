// import createAxiosInstance from "../Utils/ApiServises";
import axios from "axios";
import type { UserSignup } from "../Component/Home/Signup";
class UserReturnServices {
    route = '/api/user';
    // api = createAxiosInstance();
    // https://localhost:7130/api/user/login?userName=d&password=f

    getUserDetails = async () => { return await axios.get(`${this.route}/all`) }
    login = async (userName: string, password: string) => {
        return await axios.post(`${this.route}/login`, { userName, password });
    }
    signup = async ({ rq }: { rq: UserSignup }) => {
        return await axios.post(`${this.route}`, rq);
    }
}
export default new UserReturnServices();
