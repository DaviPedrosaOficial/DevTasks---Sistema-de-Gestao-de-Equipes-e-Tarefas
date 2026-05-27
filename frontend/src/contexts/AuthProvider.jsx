import { AuthContext } from "./AuthContext";
import { useState } from "react";

function AuthProvider({ children }) {

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token") || "";

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