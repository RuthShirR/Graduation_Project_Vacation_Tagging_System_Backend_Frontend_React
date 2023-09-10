import "./Register.css";
import { useForm } from "react-hook-form";
import globals from "../../../Services/Globals";
import store from "../../../Redux/Store";
import { userRegisteredAction } from "../../../Redux/AuthState";
import UserModel from "../../../Models/UserModel";
import notify from "../../../Services/Notify";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import jwtAxios from "../../../Services/JwtAxios";

/**
 * Register Component
 * Allows users to register to the system.
 * If the user is already registered, it redirects to the homepage.
 */
function Register(): JSX.Element {
  // Determine if the user is already registered
  const isUser = store.getState().authState.user || null;
  const navigate = useNavigate();

  // If the user is already registered, redirect to home
  if (isUser) navigate("/home");

  // Setting up the form with react-hook-form
  const { register, handleSubmit, formState } = useForm<UserModel>();

  /**
   * Handles the form submission.
   * Checks if the email is taken.
   * Registers the user if the email isn't taken.
   */
  async function submit(user: UserModel) {
    try {
      // Checking if email is already registered
      const response = await jwtAxios.get(
        globals.checkEmailUrl + encodeURIComponent(user.email)
      );
      if (response.data.isEmailTaken) {
        notify.error("This email is already registered.");
        return;
      }

      // Registering the user
      const { data } = await jwtAxios.post<UserModel>(
        globals.registerUrl,
        user
      );

      // Dispatching to Redux and navigating to home
      store.dispatch(userRegisteredAction(data));
      notify.success("You have been successfully registered.");
      navigate("/home");
    } catch (err) {
      notify.error(err);
    }
  }

  // Rendering the form
  return (
    <div className="Register Box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(submit)}>
        <label>First Name:</label>
        <input
          type="text"
          autoFocus
          {...register("firstName", {
            required: { value: true, message: "Missing first name." },
            minLength: { value: 2, message: "First name too short." },
          })}
        />
        <span>{formState.errors.firstName?.message}</span>
        <label>Last Name:</label>
        <input
          type="text"
          {...register("lastName", {
            required: { value: true, message: "Missing last name." },
            minLength: { value: 2, message: "Last name too short." },
          })}
        />
        <span>{formState.errors.lastName?.message}</span>
        <label>Email:</label>
        <input
          type="text"
          autoComplete="username"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          })}
        />
        <span>{formState.errors.email?.message}</span>
        <label>Password:</label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: { value: true, message: "Missing password." },
            minLength: { value: 5, message: "Password too short." },
          })}
        />
        <span>{formState.errors.password?.message}</span>

        <button className="button-style">Register</button>
        <NavLink className="link" to="/login">
          You have an account? Click to login!
        </NavLink>
      </form>
    </div>
  );
}


export default Register;
