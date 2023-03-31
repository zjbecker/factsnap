import axios from "axios"

const api = axios.create({
    baseURL: "https://factsnap-be.onrender.com",
});


export const requestInfoAPI = (uri) => {
    console.log("API REQUESTED for ", uri)
    return api.post(`/landmark`, {
        img_path: uri
    })
}