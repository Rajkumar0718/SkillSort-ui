import axios from "axios";
import url from "../utils/UrlConstant";

export async function sendOtp(email) {
    try {
        let resp = await axios.get(`${url.ADMIN_API}/admin/register/otp?email=${email}`)
        localStorage.removeItem("otpTimeUp")
        localStorage.setItem('startDate', new Date())
        return resp.data
    } catch (error) {
        return "error" 
    }
}