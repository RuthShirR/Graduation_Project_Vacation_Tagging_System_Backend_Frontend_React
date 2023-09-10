import { 
    VacationsState, 
    vacationsDownloadedAction,
    vacationAddedAction,
    vacationUpdatedAction,
    vacationDeletedAction,
    addFollowAction,
    deleteFollowAction,
    vacationsReducer 
  } from "../src/Redux/VacationsState";
  import { VacationModel } from "../src/Models/VacationModel";
  function createMockFileList(): FileList {
    const blob = new Blob([""], { type: "image/png" });
    const file = new File([blob], "mock.png", { type: "image/png", lastModified: new Date().getTime() });
  
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
  
    return dataTransfer.files;
  }
  

  
  const mockFileList = createMockFileList();

  describe("Test VacationsState functionality", () => {
    
    const mockVacations: VacationModel[] = [
      {
        vacationId: 1,
        uuid: "uuid1",
        description: "Vacation 1",
        destination: "Place 1",
        startDate: "2023-08-01",
        endDate: "2023-08-07",
        price: 1000,
        imageName: "image1.png",
        image: mockFileList,
        followersCount: 5,
      },
      {
        vacationId: 2,
        uuid: "uuid2",
        description: "Vacation 2",
        destination: "Place 2",
        startDate: "2023-09-01",
        endDate: "2023-09-07",
        price: 2000,
        imageName: "image2.png",
        image: mockFileList,
        followersCount: 10,
      },
    ];
    
    let state: VacationsState;
  
    beforeEach(() => {
      state = {
        vacations: [],
      };
    });
  
    it("should download vacations", () => {
      const action = vacationsDownloadedAction(mockVacations);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations).toEqual(mockVacations);
    });
  
    it("should add a vacation", () => {
      const mockVacation = mockVacations[0];
      const action = vacationAddedAction(mockVacation);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations).toContainEqual(mockVacation);
    });
  
    it("should update a vacation", () => {
      const mockVacation = { ...mockVacations[0], description: "Updated Vacation 1" };
      state.vacations = [...mockVacations];
      const action = vacationUpdatedAction(mockVacation);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations).toContainEqual(mockVacation);
    });
  
    it("should delete a vacation", () => {
      state.vacations = [...mockVacations];
      const action = vacationDeletedAction(mockVacations[0].uuid);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations).not.toContainEqual(mockVacations[0]);
    });
  
    it("should add a follow to a vacation", () => {
      state.vacations = [...mockVacations];
      const action = addFollowAction(mockVacations[0].uuid, mockVacations[0].followersCount);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations[0].followersCount).toBe(mockVacations[0].followersCount + 1);
      expect(newState.vacations[0].isFollowed).toBeTruthy();
    });
  
    it("should delete a follow from a vacation", () => {
      state.vacations = [...mockVacations];
      const action = deleteFollowAction(mockVacations[0].uuid, mockVacations[0].followersCount);
      const newState = vacationsReducer(state, action);
      expect(newState.vacations[0].followersCount).toBe(mockVacations[0].followersCount - 1);
      expect(newState.vacations[0].isFollowed).toBeFalsy();
    });
  });
  