import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import jwtAxios from "../../../Services/JwtAxios";
import store from "../../../Redux/Store";
import { userLoggedInAction } from "../../../Redux/AuthState";
import globals from "../../../Services/Globals";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import notify from "../../../Services/Notify";
import { NavLink } from "react-router-dom";



function Login(): JSX.Element {
  // Determine if the user is already logged in
  const isUser = store.getState().authState.user || null;
  const navigate = useNavigate();
  
  // Setup react-hook-form utilities
  const { register, handleSubmit, formState } = useForm<CredentialsModel>();

  // Handle form submission
  async function submit(credentials: CredentialsModel, event: any) {
    try {
      (event.target as HTMLFormElement).reset();
      
      const { data } = await jwtAxios.post<UserModel>(
        globals.loginUrl,
        credentials
      );
      
      // Update Redux state and notify user of success
      store.dispatch(userLoggedInAction(data));
      notify.success("Logged-in successfully.");
      
      // Navigate to home after successful login
      navigate("/home");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        notify.error("Incorrect email or password.");
      } else {
        notify.error(err);
      }
    }
  }

  // Type guard to determine if an error is an Axios error
  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  return (
    <div className="Login">
      {!isUser ? (
        // Render the login form
        <form onSubmit={handleSubmit(submit)}>
          <h2>Vacations</h2>
          
          <label>Email</label>
          <input
            type="text"
            autoComplete="username"
            autoFocus
            {...register("email", {
              required: { value: true, message: "Missing email." },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <span>{formState.errors.email?.message}</span>

          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: { value: true, message: "Missing password." },
              minLength: { value: 4, message: "Password too short." },
            })}
          />
          <span>{formState.errors.password?.message}</span>

          <button className="button-style">Log in</button>

          <NavLink className="link" to="/register">
            You don't have an account? Register now!
          </NavLink>
        </form>
      ) : (
        // Show a message if the user is already logged in
        <p>
          You are Logged in, <NavLink to="/home">go to Home</NavLink>
        </p>
      )}
    </div>
  );
}


export default Login;

