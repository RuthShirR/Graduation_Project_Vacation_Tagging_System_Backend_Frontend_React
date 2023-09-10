import globals from "../../../Services/Globals";
import moment from "moment";
import "./VacationCard.css";
import { NavLink } from "react-router-dom";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/JwtAxios";
import store from "../../../Redux/Store";
import { addFollowAction, deleteFollowAction, vacationDeletedAction,} from "../../../Redux/VacationsState";
import { useState, useEffect } from "react";
import UserModel from "../../../Models/UserModel";
import SocketService from "../../../Services/SocketService";
import { VacationModel } from "../../../Models/VacationModel";
import { useDispatch } from "react-redux";

interface VacationCardProps {
  vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
  const [user, setUser] = useState<UserModel | null>(null);
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { vacation } = props;

  const vacationActivesRealTime = SocketService.getInstance();

  // Initial effect to set the user.
  useEffect(() => {
    setUser(store.getState().authState.user);
  }, []);

  // check the follow status of the vacation.
  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    (async () => {
      try {
        const followObj = {
          id: user?.id,
          vacationId: vacation.vacationId,
        };
        // optional chaining to safely access the id property
        if (!followObj.id) {
          return;
        }
        const { data } = await jwtAxios.post(
          `${globals.followersUrl}status`,
          followObj
        );

        if (isMounted) {
          setFollowStatus(data.isFollow);
        }
      } catch (err) {
        notify.error(err);
      }
    })();

    // Cleanup function to handle unmounting
    return () => {
      isMounted = false;
    };
  }, [vacation.vacationId, user?.id]);

  if (!vacation) return <></>;
  if (!user) return <></>;

  const startDateFormat = moment(vacation.startDate).format("DD.MM.YYYY");
  const endDateFormat = moment(vacation.endDate).format("DD.MM.YYYY");

  async function deleteVacation() {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete the vacation ?"
      );
      if (!answer) return;

      vacationActivesRealTime.connect();
      // Unsubscribe from events before deleting
      vacationActivesRealTime.unsubscribeFromEvents();

      await jwtAxios.delete<VacationModel>(
        globals.vacationsUrl + vacation.uuid
      );
      notify.success("Vacation has been deleted !");

      // Dispatch the vacationDeletedAction to update the state in Redux store
      dispatch(vacationDeletedAction(vacation.uuid));
    } catch (err) {
      notify.error(err);
    }
  }

  let followInProgress = false; // Flag to track ongoing follow/unfollow process

  async function addFollow() {
    try {
      if (followInProgress) return; // If follow/unfollow is already in progress, do nothing
      followInProgress = true; // Set flag to true to indicate follow process started

      const followObj = { id: user?.id, vacationId: vacation.vacationId };
      if (!followObj.id) {
        // Handle the case when user is null or user.id is not available
        followInProgress = false; // Reset flag
        return;
      }

      const response = await jwtAxios.post<any>(
        `${globals.followersUrl}follow`,
        followObj
      );
      // Extract followersCount from response.data (assuming the API returns an object { followersCount: value })
      const followersCount = response.data.followersCount;
      // Wait for the follow action to complete and then update the Redux store
      await dispatch(addFollowAction(vacation.uuid, followersCount));
      setFollowStatus(true);

      // Wait for 500 milliseconds before resetting the flag
      setTimeout(() => {
        followInProgress = false; // Reset flag to allow follow/unfollow again
      }, 500);
    } catch (err) {
      followInProgress = false; // Reset flag in case of an error
      notify.error(err);
    }
  }

  async function deleteFollow() {
    try {
      if (followInProgress) return; // If follow/unfollow is already in progress, do nothing
      followInProgress = true; // Set flag to true to indicate unfollow process started

      const followObj = { id: user?.id, vacationId: vacation.vacationId };
      if (!followObj.id) {
        // Handle the case when user is null or user.id is not available
        followInProgress = false; // Reset flag
        return;
      }

      // jwtAxios.delete for sending a DELETE request
      const response = await jwtAxios.delete<any>(
        `${globals.followersUrl}remove`,
        { data: followObj }
      );
      // Extract followersCount from response.data (assuming the API returns an object { followersCount: value })
      const followersCount = response.data.followersCount;
      // Wait for the unfollow action to complete and then update the Redux store
      await dispatch(deleteFollowAction(vacation.uuid, followersCount));
      setFollowStatus(false);

      // Wait for 500 milliseconds before resetting the flag
      setTimeout(() => {
        followInProgress = false; // Reset flag to allow follow/unfollow again
      }, 500);
    } catch (err) {
      followInProgress = false; // Reset flag in case of an error
      notify.error(err);
    }
  }

  return (
    <div className="VacationCard">
      <img src={globals.vacationImage + vacation.imageName} alt="background" />
      <div className="card-content">
        <span className="card-destination">{vacation.destination}</span>
        <p>{vacation.description}</p>

        {user.isAdmin ? (
          <div className="admin-icons">
            <NavLink
              className="edit-link"
              to={"/vacations/update/" + vacation.uuid}
            >
              Edit 📝
            </NavLink>
            <button className="delete-button-style" onClick={deleteVacation}>
              Delete
            </button>
          </div>
        ) : (
          <></>
        )}

        {!user.isAdmin && (
          <div className="followers-area">
            <span>{vacation.followersCount} Followers</span>
            <hr />
            {!followStatus ? (
              <button className="follow-button-style" onClick={addFollow}>
                Not Following👎
              </button>
            ) : (
              <button className="button-style" onClick={deleteFollow}>
                Following👍
              </button>
            )}
          </div>
        )}

        <div className="bottom-card">
          <span>
            From: {startDateFormat} | To: {endDateFormat} | Price:{" "}
            {vacation.price}$
          </span>
        </div>
      </div>
    </div>
  );
}

export default VacationCard;
