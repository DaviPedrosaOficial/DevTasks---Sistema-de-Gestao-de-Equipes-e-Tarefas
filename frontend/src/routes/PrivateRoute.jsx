import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }) {

    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
}

export default PrivateRoute;