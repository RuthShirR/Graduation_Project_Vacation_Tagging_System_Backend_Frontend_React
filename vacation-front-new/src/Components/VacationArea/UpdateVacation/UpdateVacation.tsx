import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import store from "../../../Redux/Store";
import {
  VacationsState,
  vacationUpdatedAction,
} from "../../../Redux/VacationsState";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import moment from "moment";
import "./UpdateVacation.css";
import SocketService from "../../../Services/SocketService";
import { AuthState } from "../../../Redux/AuthState";
import {
  VacationModel,
  convertToFormDataPatch,
} from "../../../Models/VacationModel";

// Define a type for combined redux state
interface CombinedState {
  authState: AuthState;
  vacationsState: VacationsState;
}

function UpdateVacation(): JSX.Element {
  const { register, handleSubmit, setValue, formState, watch } =
    useForm<VacationModel>();
  const [vacationToUpdate, setVacationToUpdate] =
    useState<VacationModel | null>(null);
  const updateVacationRealTime = SocketService.getInstance(); // Singleton pattern usage for SocketService
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();
  const { authState } = store.getState() as CombinedState;

  // Redirect if the user isn't logged in or isn't an admin
  useEffect(() => {
    if (!authState.user) {
      navigate("/login");
      return;
    }
    if (!authState.user?.isAdmin) {
      navigate("/home");
      return;
    }
  }, [navigate, authState]);

  // Fetch the vacation data for given UUID when component mounts
  useEffect(() => {
    (async () => {
      try {
        const { data } = await jwtAxios.get<VacationModel>(
          globals.vacationsUrl + uuid
        );
        setVacationToUpdate(data);
        // Setting initial values for the form fields
        setValue("description", data.description);
        setValue("startDate", moment(data.startDate).format("YYYY-MM-DD"));
        setValue("endDate", moment(data.endDate).format("YYYY-MM-DD"));
        setValue("price", data.price);
      } catch (err) {
        notify.error(err);
      }
    })();
  }, [uuid, setValue]);

  // Watch for changes in the image field
  const watchedImage = watch("image");

  // Return a loading state if the vacation data is not yet fetched
  if (!vacationToUpdate) return <div>Loading...</div>;

  // This function is used to collect values from the form and handle missing/optional data
  function getValues(formData: VacationModel): VacationModel {
    // Use default values from the existing vacation if values are missing in the form data
    return {
      vacationId: formData.vacationId ?? vacationToUpdate?.vacationId,
      uuid: formData.uuid ?? vacationToUpdate?.uuid,
      description: formData.description ?? vacationToUpdate?.description,
      destination: formData.destination ?? vacationToUpdate?.destination,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      price: formData.price ?? vacationToUpdate?.price,
      image: formData.image ?? vacationToUpdate?.image,
      imageName: formData.imageName ?? vacationToUpdate?.imageName,
      followersCount:
        formData.followersCount ?? vacationToUpdate?.followersCount,
    };
  }

  // Handle vacation update
  async function updateVacation(formData: VacationModel) {
    let vacation: VacationModel = getValues(formData);

    // Validation for price and date range
    if (!vacation.price) {
      return notify.error("Price is required.");
    }
    if (vacation.price < 0 || vacation.price > 10000) {
      return notify.error("Invalid price. Price must be between 0 and 10,000.");
    }
    if (vacation.startDate >= vacation.endDate) {
      return notify.error(
        "Invalid date range. End date must be after start date."
      );
    }

    // Updating the vacation
    try {
      const { data } = await jwtAxios.patch<VacationModel>(
        globals.vacationsUrl + uuid,
        convertToFormDataPatch(vacation)
      );

      store.dispatch(vacationUpdatedAction(data));
      updateVacationRealTime.connect();
      updateVacationRealTime.updateVacation(data);
      notify.success("Vacation details saved successfully");
      navigate("/home");
    } catch (err: any) {
      if (!err.response) return notify.error(err);
      if (err.response.status === 403 || err.response.status === 401)
        return navigate("/logout");
      notify.error(err);
    }
  }

  // Formatting the dates to display in the form placeholders
  const startDateFormat = moment(vacationToUpdate.startDate).format(
    "DD-MM-YYYY"
  );
  const endDateFormat = moment(vacationToUpdate.endDate).format("DD-MM-YYYY");

  return (
    <div className="UpdateVacation">
      <h2>Update Vacation</h2>
      {vacationToUpdate && (
        <form onSubmit={handleSubmit(updateVacation)}>
          <label>Description </label>
          <textarea
            placeholder={vacationToUpdate.description}
            autoFocus
            {...register("description", {
              required: "Description is required",
              minLength: { value: 2, message: "Description too short." },
              maxLength: { value: 300, message: "Description too long." },
            })}
          />
          {formState.errors.description && (
            <span>{formState.errors.description.message}</span>
          )}
          <label>Destination </label>
          <input
            type="text"
            value={watch("destination") || vacationToUpdate.destination}
            {...register("destination", {
              required: "Destination is required",
              minLength: { value: 2, message: "Destination too short." },
              maxLength: { value: 200, message: "Destination too long." },
            })}
          />
          {formState.errors.destination && (
            <span>{formState.errors.destination.message}</span>
          )}
          <label>From </label>
          <input
            type="date"
            placeholder={"(" + startDateFormat + ") "}
            {...register("startDate", { required: "Start date is required" })}
          />
          {formState.errors.startDate && (
            <span>{formState.errors.startDate.message}</span>
          )}
          <label>To </label>
          <input
            type="date"
            placeholder={"(" + endDateFormat + ") "}
            {...register("endDate", {
              required: "End date is required",
              validate: {
                afterStartDate: (value) =>
                  moment(value).isAfter(moment(watch().startDate)) ||
                  "End date must be after start date",
              },
            })}
          />
          {formState.errors.endDate && (
            <span>{formState.errors.endDate.message}</span>
          )}
          <label>Price </label>
          <input
            type="number"
            placeholder={`${vacationToUpdate.price}`}
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price can't be negative." },
              max: { value: 10000, message: "Price can't exceed 10,000." },
            })}
          />
          {formState.errors.price && (
            <span>{formState.errors.price.message}</span>
          )}
          <label>Image </label> <br />
          <input
            type="file"
            accept="image/*"
            className="custom-file-input"
            {...register("image")}
          />
          {watchedImage && watchedImage.length > 0 && (
            <img
              src={URL.createObjectURL(watchedImage[0])}
              alt="Chosen"
              style={{ height: "100px" }}
            /> // Show chosen image preview
          )}
          {!watchedImage && vacationToUpdate.imageName && (
            <img
              src={
                globals.vacationsUrl + "images/" + vacationToUpdate.imageName
              }
              alt="Existing"
              style={{ height: "100px" }}
            /> // Show existing image preview
          )}
          {formState.errors.image && (
            <span>{formState.errors.image.message}</span>
          )}
          <button className="button-style">Update</button>
        </form>
      )}
    </div>
  );
}

export default UpdateVacation;
