// import createAxiosInstance from "../Utils/ApiServises";
import axios from "axios";
import type { UserSignup } from "../Component/Home/Signup";
class UserReturnServices {
    route = '/api/user';
    // api = createAxiosInstance();
    getSession = async (userId: string) => {
        return await axios.get(`${this.route}/session/${userId}`);
    }

    getSearchResult = async (search?: string) => { return await axios.get(`${this.route}/all?search=${search ?? ''}`) }
    getUser = async (id: string) => { return await axios.get(`${this.route}/${id}`) }
    login = async (userName: string, password: string) => {
        return await axios.post(`${this.route}/login`, { userName, password });
    }
    signup = async ({ user }: { user: UserSignup }) => {
        return await axios.post(`${this.route}`, user);
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
    createFriend = async (userId: string, friendId: string) => {
        return await axios.post(`${this.route}/CreatePairChat/${userId}/${friendId}`, {});
    }

}
export default new UserReturnServices();
