import { Action } from 'redux';
import UserModel from '../Models/UserModel';

export interface AuthState {
    user: UserModel | null;
}

// Initialize the auth state, if user data is found in local storage, populate the initial state
let initialAuthState: AuthState = { user: null };

if (typeof localStorage !== 'undefined') {
    initialAuthState = {
        user: JSON.parse(localStorage.getItem("user") || 'null'),
    };
}

// Enumeration of the different action types related to authentication
export enum AuthActionType {
    UserRegistered = "UserRegistered",
    UserLoggedIn = "UserLoggedIn",
    UserLoggedOut = "UserLoggedOut"
}

// Define the shape of an authentication action
export interface AuthAction extends Action<AuthActionType> {
    payload?: UserModel;
}

// Action creators for different authentication actions

// When a user registers
export function userRegisteredAction(user: UserModel): AuthAction {
    return { type: AuthActionType.UserRegistered, payload: user };
}

// When a user logs in
export function userLoggedInAction(user: UserModel): AuthAction {
    return { type: AuthActionType.UserLoggedIn, payload: user };
}

// When a user logs out
export function userLoggedOutAction(): AuthAction {
    return { type: AuthActionType.UserLoggedOut };
}

// Reducer function for authentication-related actions
export function authReducer(state: AuthState = initialAuthState, action: AuthAction): AuthState {
    switch (action.type) {
        // Handle user registration and login similarly
        case AuthActionType.UserRegistered:
        case AuthActionType.UserLoggedIn:
            const newUser = action.payload;
            if (newUser) {
                // Store user data in local storage for persistence
                localStorage.setItem("user", JSON.stringify(newUser));
                return { ...state, user: newUser };
            }
            break;
        // Handle user logout
        case AuthActionType.UserLoggedOut:
            // Remove user data from local storage
            localStorage.removeItem("user");
            return { ...state, user: null };
        default:
            return state;
    }
    return state;
}




