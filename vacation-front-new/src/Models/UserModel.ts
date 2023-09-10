
// ==========================
// USER MODEL
// ==========================

export interface UserModel {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: number;
    token: string;
}

export default UserModel;

