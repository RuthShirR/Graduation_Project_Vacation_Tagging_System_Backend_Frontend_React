import Joi from "joi";


// =================================
// MODEL: CredentialsModel
// =================================

//Represents user credentials with validations.
export default class CredentialsModel {
  email!: string;  
  password!: string;

  // Validation schema for POST request
  static #postValidationSchema = Joi.object({
    email: Joi.string().required().email(),  // Added email validation
    password: Joi.string().required().min(2).max(100),
  });

  constructor(data: Partial<CredentialsModel>) {
    Object.assign(this, data);
  }

  // Validate the object against the POST validation schema
  ValidatePost() {
    const result = CredentialsModel.#postValidationSchema.validate(this, { abortEarly: false });
    return result.error ? result.error.message : null;
  }
}



