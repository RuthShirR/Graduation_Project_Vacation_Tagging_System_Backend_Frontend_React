import React, { useEffect, useState, useRef } from "react";
import { Unsubscribe } from "redux";
import store from "../../../Redux/Store";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";
import UserModel from "../../../Models/UserModel";

function Layout(): JSX.Element {
    const [user, setUser] = useState<UserModel | null>(null);
    const unsubscribeRef = useRef<Unsubscribe | undefined>();

    useEffect(() => {
        unsubscribeRef.current = store.subscribe(() => setUser(store.getState().authState.user));
        return () => {
            const unsubscribe = unsubscribeRef.current;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); 

    return (
        <div className="Layout">
            {user && <header><Header /></header>}
            <main><Routing /></main>
            <footer className="Footer">
                <p> © {new Date().getFullYear()} All Rights Reserved to Ruth Shir Rosenblum </p>
            </footer>
        </div>
    );
}

export default Layout;

