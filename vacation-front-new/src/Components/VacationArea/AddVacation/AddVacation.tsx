import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

import store from "../../../Redux/Store";
import { AuthState } from "../../../Redux/AuthState";
import {
  VacationsState,
  vacationAddedAction,
} from "../../../Redux/VacationsState";
import { VacationModel } from "../../../Models/VacationModel";

import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import SocketService from "../../../Services/SocketService";

import "./AddVacation.css";

interface CombinedState {
  authState: AuthState;
  vacationsState: VacationsState;
}

export function AddVacation(): JSX.Element {
  const navigate = useNavigate();

  // Using React Hook Form for form management
  const { register, handleSubmit, formState } = useForm<VacationModel>({
    mode: "onBlur",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);

  // Using a singleton for the SocketService
  let addVacationRealTime: SocketService = SocketService.getInstance();

  const { authState } = store.getState() as CombinedState;

  // Ensure only admins can add a vacation
  useEffect(() => {
    if (!authState.user || !authState.user.isAdmin) {
      navigate(authState.user ? "/home" : "/login");
      return;
    }
  }, [navigate, authState]);

  // If user is not admin, render nothing
  if (!authState || !authState.user || !authState.user.isAdmin) {
    return <></>;
  }

  // Logic to add a new vacation
  async function addVacation(vacation: VacationModel) {
    try {
      // Date and price validation
      if (moment(vacation.startDate).isAfter(vacation.endDate)) {
        notify.error("End date should not be earlier than the start date.");
        return;
      }

      if (
        moment().startOf('day').isAfter(moment(vacation.startDate).startOf('day')) ||
        moment().startOf('day').isAfter(moment(vacation.endDate).startOf('day'))
      ) {
        notify.error("Dates should not be in the past.");
        return;
      }

      if (vacation.price < 0 || vacation.price > 10000) {
        notify.error("Price should be between 0 and 10,000.");
        return;
      }

      // Create FormData to send multipart request (required for uploading files)
      const formData = new FormData();
      formData.append("description", vacation.description);
      formData.append("destination", vacation.destination);
      formData.append("startDate", vacation.startDate.toString());
      formData.append("endDate", vacation.endDate.toString());
      formData.append("price", vacation.price.toString());
      if (vacation.image) {
        formData.append("image", vacation.image[0]);
      }

      const { data } = await jwtAxios.post<VacationModel>(
        globals.addVacationUrl,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      store.dispatch(vacationAddedAction(data));

      addVacationRealTime.connect();
      addVacationRealTime.addVacation(data);

      notify.success("Vacation has been added");
      navigate("/home");
    } catch (err: any) {
      if (!err.response) return notify.error(err);
      if (err.response.status === 403 || err.response.status === 401)
        return navigate("/logout");
      notify.error(err);
    }
  }

  // Render form for adding a vacation
  return (
    <div className="AddVacation">
      <h2>Add Vacation</h2>
      <form onSubmit={handleSubmit(addVacation)}>
        <label>Description </label>
        <textarea
          autoFocus
          {...register("description", {
            required: true,
            minLength: 2,
            maxLength: 300,
          })}
        />
        {formState.errors.description?.type === "required" && (
          <span>Missing description.</span>
        )}
        {formState.errors.description?.type === "minLength" && (
          <span>Description too short.</span>
        )}
        {formState.errors.description?.type === "maxLength" && (
          <span>Description too long.</span>
        )}
        <label>Destination </label>
        <input
          type="text"
          {...register("destination", {
            required: true,
            minLength: 2,
            maxLength: 200,
          })}
        />
        {formState.errors.destination?.type === "required" && (
          <span>Missing destination.</span>
        )}
        {formState.errors.destination?.type === "minLength" && (
          <span>Destination too short.</span>
        )}
        {formState.errors.destination?.type === "maxLength" && (
          <span>Destination too long.</span>
        )}
        <label>From </label>
        <input
          type="date"
          {...register("startDate", { required: true })}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
            register("startDate").onChange(e);
          }}
        />
        {formState.errors.startDate?.type === "required" && (
          <span>Missing start date.</span>
        )}
        <label>To </label>
        <input
          type="date"
          {...register("endDate", { required: true })}
          min={startDate}
        />
        {formState.errors.endDate?.type === "required" && (
          <span>Missing end date.</span>
        )}
        <label>Price </label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: true, min: 0, max: 10000 })}
        />
        {formState.errors.price?.type === "required" && (
          <span>Missing price.</span>
        )}
        {formState.errors.price?.type === "min" && (
          <span>Price can't be negative.</span>
        )}
        {formState.errors.price?.type === "max" && (
          <span>Price can't exceed 10,000.</span>
        )}
        <label>Image </label> <br />
        <input
          type="file"
          accept="image/*"
          className="custom-file-input"
          {...register("image", { required: true })}
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              setSelectedImage(URL.createObjectURL(event.target.files[0]));
            }
          }}
        />
        {formState.errors.image?.type === "required" && (
          <span>Missing image.</span>
        )}
        {selectedImage && (
          <img src={selectedImage} className="preview-image" alt="Selected" />
        )}
        <button className="button-style">Add</button>
      </form>
    </div>
  );
}

export default AddVacation;
