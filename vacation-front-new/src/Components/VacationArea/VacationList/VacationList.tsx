import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../../Redux/Store";
import "./VacationList.css";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/JwtAxios";
import globals from "../../../Services/Globals";
import VacationCard from "../VacationCard/VacationCard";
import PleaseWait from "../../PleaseWait/PleaseWait";
import { RootState, vacationsDownloadedAction } from "../../../Redux/VacationsState";
import SocketService from "../../../Services/SocketService";
import { VacationModel } from "../../../Models/VacationModel";

function VacationList(): JSX.Element {

  const vacationsFromRedux = useSelector( (state: RootState) => state.vacationsState.vacations );
  const dispatch = useDispatch();

  const [vacations, setVacations] = useState<VacationModel[]>([]);
  const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>( [] );
  const [filterFollowed, setFilterFollowed] = useState(false);
  const [filterNotStarted, setFilterNotStarted] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [notStartedActive, setNotStartedActive] = useState(false);
  const [activeActive, setActiveActive] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

    // Instance for real-time socket events
    const vacationActivesRealTime = SocketService.getInstance();
    const navigate = useNavigate();

  const toggleFollowed = () => setFilterFollowed(!filterFollowed);
  const toggleNotStarted = () => {
    setFilterNotStarted(!filterNotStarted);
    setActiveActive(false); // Disable the "Show active vacations" checkbox
    setNotStartedActive(!notStartedActive); // Toggle the active state for "Show vacations that have not started" checkbox
  };

  const toggleActive = () => {
    setFilterActive(!filterActive);
    setNotStartedActive(false); // Disable the "Show vacations that have not started" checkbox
    setActiveActive(!activeActive); // Toggle the active state for "Show active vacations" checkbox
  };

    // Real-time socket subscriptions
  const socketActives = useCallback(async () => {
        // Add, delete, and update subscriptions
    vacationActivesRealTime.subscribeToAddEvent((vacation: VacationModel) => {
      setVacations((prevVacations) => [...prevVacations, vacation]);
    });

    vacationActivesRealTime.subscribeToDeleteEvent((uuid: string) => {
      setVacations((prevVacations) =>
        prevVacations.filter((v) => v.uuid !== uuid)
      );
    });

    vacationActivesRealTime.subscribeToUpdateEvent((vacation: VacationModel) => {
      setVacations((prevVacations) =>
        prevVacations.map((v) => (v.uuid === vacation.uuid ? vacation : v))
      );
    });
  }, [vacationActivesRealTime]);

   // Fetching and setting vacations
   useEffect(() => {
    const fetchData = async () => {
      try {
        vacationActivesRealTime.connect();

        if (!store.getState().authState.user) {
          notify.error("You are not logged in !");
          return navigate("/login");
        }

        let data: VacationModel[] = [];

        if (vacationsFromRedux.length === 0) {
          const response = await jwtAxios.get<VacationModel[]>(globals.vacationsUrl);
          data = response.data;
          setVacations(data);
          dispatch(vacationsDownloadedAction(data));
          await socketActives();
          setFilteredVacations(data);
        } else {
          setVacations(vacationsFromRedux);
          await socketActives();
          setFilteredVacations(vacationsFromRedux);
        }

          // Fetch and set followed vacations for the user
        const user = store.getState().authState.user;
        const response = await jwtAxios.get(`${globals.followersUrl}followed/${user?.id}`);
        const followedVacationsIds = response.data.followedVacations;

        let vacations = vacationsFromRedux.length !== 0 ? vacationsFromRedux : data;
        vacations = vacations.map((vacation: VacationModel) => {
          return {
            ...vacation,
            isFollowed: followedVacationsIds.includes(vacation.vacationId),
          };
        });


        setVacations(vacations);
        setFilteredVacations(vacations);

        const unsubscribe = store.subscribe(() => setVacations(store.getState().vacationsState.vacations));
       
        // Cleanup function
        return () => {
          vacationActivesRealTime.disconnect();
          unsubscribe();
        };
      } catch (err: any) {
        if (!err.response) return notify.error(err as any);
        if (err.response.status === 403 || err.response.status === 401) return navigate("/logout");
        notify.error(err);
      }
    };

    fetchData();
  }, [navigate, vacationsFromRedux.length, vacationActivesRealTime, socketActives, vacationsFromRedux, dispatch]);

  // Applying filters on vacations
  useEffect(() => {
    const applyFilters = () => {
      let newFilteredVacations = [...vacations];

      if (filterFollowed) {
        newFilteredVacations = newFilteredVacations.filter((vacation) => vacation.isFollowed);
      }

      const now = new Date();
      if (filterNotStarted) {
        newFilteredVacations = newFilteredVacations.filter((vacation) => new Date(vacation.startDate) > now);
      }

      if (filterActive) {
        newFilteredVacations = newFilteredVacations.filter((vacation) => new Date(vacation.startDate) <= now && new Date(vacation.endDate) >= now);
      }

      setFilteredVacations(newFilteredVacations);
    };

    applyFilters();
  }, [filterFollowed, filterNotStarted, filterActive, vacations]);


  // Pagination logic
  const vacationsPerPage = 10;
  const lastIndex = currentPage * vacationsPerPage;
  const firstIndex = lastIndex - vacationsPerPage;
  const sortedVacations = [...filteredVacations].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const currentVacations = sortedVacations.slice(firstIndex, lastIndex);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
 
  return (
    <div className="VacationList">
      <div className="filters">
        <label>
          <input
            type="checkbox"
            onChange={toggleFollowed}
            checked={filterFollowed}
          />
          Show followed vacations
        </label>
        <label>
          <input
            type="checkbox"
            onChange={toggleNotStarted}
            checked={filterNotStarted}
            disabled={activeActive} // Disable the "Show vacations that have not started" checkbox if "Show active vacations" is active
          />
          Show vacations that have not started
        </label>
        <label>
          <input
            type="checkbox"
            onChange={toggleActive}
            checked={filterActive}
            disabled={notStartedActive} // Disable the "Show active vacations" checkbox if "Show vacations that have not started" is active
          />
          Show active vacations
        </label>
      </div>

      {sortedVacations.length === 0 ? (
        <PleaseWait />
      ) : (
        <>
          {currentVacations.map((v) => (
            <VacationCard vacation={v} key={v.vacationId} />
          ))}
          <div className="pagination">
            {currentPage > 1 && <button onClick={prevPage}>&lt; Prev</button>}
            {currentPage < Math.ceil(sortedVacations.length / vacationsPerPage) && (
              <button onClick={nextPage}>Next &gt;</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VacationList;