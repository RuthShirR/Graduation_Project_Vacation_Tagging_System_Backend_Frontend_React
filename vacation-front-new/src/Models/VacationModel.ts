import moment from "moment";

// ==========================
// VACATION MODEL
// ==========================

export interface VacationModel {
    vacationId: number;
    uuid: string;
    description: string;
    destination: string;
    startDate: Date | string;
    endDate: Date | string;
    price: number;
    imageName: string;
    image: FileList;
    followersCount: number;
    isFollowed?: boolean; // Optional: Indicates if a vacation is followed by the user
}

// Convert a VacationModel object to FormData suitable for a POST request.
export function convertToFormDataPost(vacation: VacationModel): FormData {
    const myFormData = new FormData();
    
    myFormData.append("description", vacation.description);
    myFormData.append("destination", vacation.destination);
    myFormData.append("startDate", moment(vacation.startDate).format('YYYY-MM-DD'));
    myFormData.append("endDate", moment(vacation.endDate).format('YYYY-MM-DD'));
    myFormData.append("price", vacation.price.toString());
    
    // Check and append the image if available
    if (vacation.image.item(0)) {
        myFormData.append("image", vacation.image.item(0) as File);
    }

    // Log the content of the form data for debugging purposes (optional)
    for (const pair of myFormData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    return myFormData;
}

// Convert a VacationModel object to FormData suitable for a PATCH request.
export function convertToFormDataPatch(vacation: VacationModel): FormData {
    const myFormData = new FormData();
    
    myFormData.append("vacationId", vacation.vacationId.toString());
    myFormData.append("description", vacation.description);
    myFormData.append("destination", vacation.destination);
    myFormData.append("startDate", moment(vacation.startDate).format('YYYY-MM-DD'));
    myFormData.append("endDate", moment(vacation.endDate).format('YYYY-MM-DD'));
    myFormData.append("price", vacation.price.toString());

    // Check and append the image if available
    if (vacation.image && vacation.image.length > 0) {
        myFormData.append("image", vacation.image.item(0) as File);
    }
    myFormData.append("imageName", vacation.imageName);
    
    return myFormData;
}
