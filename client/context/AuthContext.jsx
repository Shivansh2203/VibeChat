import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check if user is authenticated and if so, set the user data and connect the socket.

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

//   Login function to handle user authentication and socket connection


const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);

    if (data.success) {
      setAuthUser(data.userData);
      connectSocket(data.userData);

      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);

      localStorage.setItem("token", data.token);

      toast.success(data.message);

    }else{
        toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  } 
};


// Logout function to clear auth data and disconnect socket
const logout = async() => {
  try {
      
    localStorage.removeItem("token")

    // clear auth state
    setAuthUser(null);
    setToken(null);

    //clear storage
    localStorage.removeItem("authUser");

    // remove token from axios
    axios.defaults.headers.common["token"]=null;

    toast.success("Logged out successfully");

    // disconnect socket
      socket.disconnect();

  } catch (error) {
    toast.error("Logout failed");
  }
};



// Update profile function
const updateProfile = async (body) => {
  try {
    const { data } = await axios.put("/api/auth/update-profile", body);

    if (data.success) {
      // update auth state
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    }
  } catch (error) {
    toast.error(error.message || "Profile update failed");
  }
};


  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers",(userIds)=>{
        setonlineUsers(userIds);
    })
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile
  };

  return (<AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>)
};
