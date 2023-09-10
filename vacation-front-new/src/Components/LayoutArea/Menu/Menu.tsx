

import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./Menu.css";

function Menu(): JSX.Element {
    return (
        <div className="Menu">
            <div className="logo"></div>
            <AuthMenu />
        </div>
    );
}

export default Menu;

