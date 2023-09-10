import { useEffect } from "react";
import store from "../../../Redux/Store";
import { userLoggedOutAction } from "../../../Redux/AuthState";
import { useNavigate } from "react-router-dom";
import notify from "../../../Services/Notify";

/**
 * Component responsible for handling user logout.
 * When rendered, it will:
 * 1. Dispatch a logout action to the Redux store.
 * 2. Show a successful logout notification.
 * 3. Redirect the user to the login page.
 * 
 * It does not render any UI (returns null).
 */
function Logout(): JSX.Element | null {
    
    const navigate = useNavigate(); 
    
    useEffect(() => {
        // Dispatch logout action to Redux store
        store.dispatch(userLoggedOutAction());
        
        // Notify user about successful logout
        notify.success("Logged-out successfully.");

        // Redirect to the login page
        navigate("/login");

    }, [navigate]);  // Dependency array contains 'navigate' to ensure that it's up-to-date

  
    return null;
}

export default Logout;
