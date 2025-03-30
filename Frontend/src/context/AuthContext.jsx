import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import axios from 'axios'
import { Backendurl } from "../../Private/backend";
export const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);  
    const storeTokenInLS = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        setToken(accessToken);
    }
    let isLoggedIn = !!token;

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser("");
        setToken("");
    }
    
    const userAuthentication = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Backendurl}/api/v1/users/current-user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
    
            if (response.status === 200) {
                console.log("user is ", response.data.data);
                const userData = response.data.data;
                setUser(userData);
                toast.success("User Fetched Succesfully !!");
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error in user authentication:", error);
        
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(token){
            userAuthentication();
        }
        else{
            setLoading(false);
        }
    }, [token]);
    
    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn, logout, user, loading, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext);
}