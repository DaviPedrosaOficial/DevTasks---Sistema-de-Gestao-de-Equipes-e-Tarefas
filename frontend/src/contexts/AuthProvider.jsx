import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'

function AuthProvider({ children }) {

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token") || "";

    });

    useEffect(() => {

        if (!token) {
            return;
        }

        try {

            const decoded = jwtDecode(token);

            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {

                logout();

            }

        } catch {

            logout();
        }

    });

    function login(newToken) {

        localStorage.setItem("token", newToken);

        setToken(newToken);
    }

    function logout() {

        localStorage.removeItem("token");

        setToken("");
    }

    return (

        <AuthContext.Provider
            value={{
                token,
                setToken,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}

export default AuthProvider;