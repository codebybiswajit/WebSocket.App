// import createAxiosInstance from "../Utils/ApiServises";
import axios from "axios";
import type { UserSignup } from "../Component/Home/Signup";
class UserReturnServices {
    route = '/api/user';
    // api = createAxiosInstance();
    getSession = async (userId: string) => {
        return await axios.get(`${this.route}/session/${userId}`);
    }
    getAllUserDetails = async () => { return await axios.get(`${this.route}/all`) }
    getUser = async (id: string) => { return await axios.get(`${this.route}/${id}`) }
    login = async (userName: string, password: string) => {
        return await axios.post(`${this.route}/login`, { userName, password });
    }
    signup = async ({ rq }: { rq: UserSignup }) => {
        return await axios.post(`${this.route}`, rq);
    }

    getContacts = async (id: string) => {
        return await axios.get(`${this.route}/GetContact/${id}`);
    }
    logOut = async (id: string) => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        return await axios.post(`${this.route}/logout/${id}`, {});
    }

}
export default new UserReturnServices();
