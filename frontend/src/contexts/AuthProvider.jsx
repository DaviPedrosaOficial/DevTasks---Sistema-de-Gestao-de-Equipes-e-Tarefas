import { AuthContext } from "./AuthContext";
import { useState } from 'react';

function AuthProvider({ children }) {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || "";
    });

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;