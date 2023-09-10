import { Component } from "react";
import "./AuthMenu.css";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";



// Define the state interface for the AuthMenu component
interface AuthMenuState {
  user: UserModel | null;
}

// Define the AuthMenu component
class AuthMenu extends Component<{}, AuthMenuState> {
  private unsubscribe: Unsubscribe = () => {}; 

  // initialize the state
  public constructor(props: {}) {
    super(props);
    this.state = { user: store.getState().authState.user };
  }

  // Subscribe to the store when the component mounts
  public componentDidMount(): void {
    this.unsubscribe = store.subscribe(() =>
      this.setState({ user: store.getState().authState.user })
    );
  }

  // Unsubscribe from the store when the component unmounts
  public componentWillUnmount(): void {
    this.unsubscribe();
  }

  // Render the component
  public render(): JSX.Element {
    const { user } = this.state;

    return (
      <div className="AuthMenu">
        {user && (
          <>
            <span>Hello {user.firstName + " " + user.lastName} </span>
            {user.isAdmin ? (
              // Links for admin users
              <>
                <NavLink className="link" to="/vacations/add">Add Vacation</NavLink>
                <span> | </span>
                <NavLink className="link" to="/home">Home</NavLink>
                <span> | </span>
                <NavLink className="link" to="/report">Vacation Report</NavLink>
                <span> | </span>
              </>
            ) : (
              // Links for non-admin users
              <>
                <NavLink className="link" to="/home">Home</NavLink>
                <span> | </span>
              </>
            )}
            <NavLink className="link" to="/logout">Log out</NavLink> 
          </>
        )}
      </div>
    );
  }
}


export default AuthMenu;

