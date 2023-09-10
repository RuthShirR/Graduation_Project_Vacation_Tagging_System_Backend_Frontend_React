import { VacationModel } from "../Models/VacationModel";
import produce from "immer";
import { AuthState } from "./AuthState";

// Define the structure of the state for vacations
export class VacationsState {
    public vacations: VacationModel[] = [];
}

// Define a type representing the global application state
export interface RootState {
    vacationsState: VacationsState;
    authState: AuthState;
}

// Enumeration of possible action types related to vacations
export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted",
    AddFollow = "AddFollow",
    DeleteFollow = "DeleteFollow",
}

// Define the shape of an action related to vacations
export interface VacationsAction {
    type: VacationsActionType;
    payload?: any;
}

// Initial state for vacations
const initialVacationsState: VacationsState = {
    vacations: [],
};

// Action creators for the different vacations actions

export function vacationsDownloadedAction(vacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.VacationsDownloaded, payload: vacations };
}

export function vacationAddedAction(addedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationAdded, payload: addedVacation };
}

export function vacationUpdatedAction(updatedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationUpdated, payload: updatedVacation };
}

export function vacationDeletedAction(uuid: string): VacationsAction {
    return { type: VacationsActionType.VacationDeleted, payload: uuid };
}

export function addFollowAction(uuid: string, followersCount: number): VacationsAction {
    return { type: VacationsActionType.AddFollow, payload: { uuid, followersCount } };
}

export function deleteFollowAction(uuid: string, followersCount: number): VacationsAction {
    return { type: VacationsActionType.DeleteFollow, payload: { uuid, followersCount } };
}

// Reducer function to handle the changes to the vacations state based on actions
export function vacationsReducer(currentState: VacationsState = initialVacationsState, action: VacationsAction): VacationsState {
    return produce(currentState, (draftState) => {
        switch (action.type) {
            case VacationsActionType.VacationsDownloaded:
                draftState.vacations = action.payload;
                break;
            case VacationsActionType.VacationAdded:
                draftState.vacations.push(action.payload);
                break;
            case VacationsActionType.VacationUpdated:
                const indexToUpdate = draftState.vacations.findIndex(vacation => vacation.uuid === action.payload?.uuid);
                if (indexToUpdate !== -1) {
                    draftState.vacations[indexToUpdate] = action.payload;
                }
                break;
            case VacationsActionType.VacationDeleted:
                draftState.vacations = draftState.vacations.filter(vacation => vacation.uuid !== action.payload);
                break;
            case VacationsActionType.AddFollow:
                const indexToAddFollow = draftState.vacations.findIndex(vacation => vacation.uuid === action.payload.uuid);
                if (indexToAddFollow !== -1) {
                    draftState.vacations[indexToAddFollow].followersCount += 1;
                    draftState.vacations[indexToAddFollow].isFollowed = true;  // Setting the 'isFollowed' flag
                }
                break;
            case VacationsActionType.DeleteFollow:
                const indexToDeleteFollow = draftState.vacations.findIndex(vacation => vacation.uuid === action.payload.uuid);
                if (indexToDeleteFollow !== -1) {
                    draftState.vacations[indexToDeleteFollow].followersCount -= 1;
                    draftState.vacations[indexToDeleteFollow].isFollowed = false;  // Resetting the 'isFollowed' flag
                }
                break;
            default:
                break;
        }
    });
}

