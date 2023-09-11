import Joi from "joi";

// =================================
// MODEL: UserModel
// =================================

//Represents a user with validations.
export default class UserModel {
  id?: number;
  uuid?: string;
  firstName?: string;
  lastName?: string;
  email?: string; 
  password: string = ""; 
  token?: string;
  
// Validation schema for POST request
static #postValidationSchema = Joi.object({
  id: Joi.forbidden(), 
  uuid: Joi.forbidden(), 
  firstName: Joi.string().required().min(2).max(100),
  lastName: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),  // email validation
  password: Joi.string().required().min(5).max(100),
});

constructor(data: Partial<UserModel>) {
  Object.assign(this, data);
}

  // Validate the object against the POST validation schema
  ValidatePost() {
    const result = UserModel.#postValidationSchema.validate(this, {
      abortEarly: false,
    });
    return result.error ? result.error.message : null;
  }
}







