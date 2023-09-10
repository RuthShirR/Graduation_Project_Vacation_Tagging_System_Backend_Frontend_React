import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./AuthState";
import { vacationsReducer } from "./VacationsState";

const reducers = {
  vacationsState: vacationsReducer,
  authState: authReducer,
};

const store = configureStore({
  reducer: reducers
});

export default store;

