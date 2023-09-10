import { Routes, Route } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import UpdateVacation from "../../VacationArea/UpdateVacation/UpdateVacation";
import VacationList from "../../VacationArea/VacationList/VacationList";
import Page404 from "../Page404/Page404";
import VacationReport from "../../VacationArea/VacationReport/VacationReport";

function Routing(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<VacationList />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vacations/update/:uuid" element={<UpdateVacation />} />
      <Route path="/vacations/add" element={<AddVacation />} />
      <Route path="/report" element={<VacationReport />} />
       <Route path="/" element={<Login />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default Routing;



