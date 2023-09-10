import { authReducer, userLoggedInAction, userLoggedOutAction, userRegisteredAction } from '../src/Redux/AuthState';
import UserModel from '../src/Models/UserModel';
import { TextEncoder, TextDecoder } from 'text-encoding';


if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('authReducer', () => {
  it('should return initial state', () => {
    const initialState = { user: null };
    expect(authReducer(undefined, {} as any)).toEqual(initialState);
  });

  it('should handle UserRegistered action', () => {
    const user: UserModel = { id: 1, uuid: '123', firstName: 'Shir', lastName: 'Test', email: 'shir@example.com', password: 'hashed_password', isAdmin: 0, token: 'token' };
    const action = userRegisteredAction(user);
    const newState = authReducer(undefined, action);
    expect(newState.user).toEqual(user);
  });

  it('should handle UserLoggedIn action', () => {
    const user: UserModel = { id: 1, uuid: '123', firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'hashed_password', isAdmin: 0, token: 'token' };
    const action = userLoggedInAction(user);
    const newState = authReducer(undefined, action);
    expect(newState.user).toEqual(user);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should handle UserLoggedOut action', () => {
    Storage.prototype.removeItem = jest.fn();
    
    const initialState = { 
      user: { 
        id: 1, 
        uuid: '123', 
        firstName: 'Shir', 
        lastName: 'Test', 
        email: 'Shir@example.com', 
        password: 'hashed_password', 
        isAdmin: 0, 
        token: 'token' 
      } 
    };
    
    const action = userLoggedOutAction();
    const newState = authReducer(initialState, action);
    
    expect(newState.user).toBeNull(); 
    expect(localStorage.removeItem).toHaveBeenCalledWith('user'); 
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  

});
