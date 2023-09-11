import Joi from "joi";

// =================================
// MODEL: VacationModel
// =================================

//Validate current instance against the POST validation schema.
export default class VacationModel {
  vacationId!: string;
  uuid!: string;
  description!: string;
  destination!: string;
  startDate!: string;
  endDate!: string;
  price!: number;
  imageName!: string;

  // Validation schema for POST request
  private static postValidationSchema = Joi.object({
    vacationId: Joi.forbidden(), 
    uuid: Joi.forbidden(), 
    description: Joi.string().required().min(5).max(300),
    destination: Joi.string().required().min(2).max(200),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    price: Joi.number().positive().required(),
    imageName: Joi.forbidden(), 
  });

  // Validation schema for PATCH request
  private static patchValidationSchema = Joi.object({
    vacationId: Joi.number().required(),
    uuid: Joi.forbidden(),
    description: Joi.string().required().min(5).max(300),
    destination: Joi.string().required().min(2).max(200),
    startDate: Joi.date().required().iso(),
    endDate: Joi.date().required().iso().greater(Joi.ref('startDate')),
    price: Joi.number().required().positive(),
    imageName: Joi.string().required(),
  });

  // Validate the object against the POST validation schema
  ValidatePost(): string | null {
    const result = VacationModel.postValidationSchema.validate(this, { abortEarly: false });
    return result.error ? result.error.message : null;
  }

  // Validate the object against the PATCH validation schema
  ValidatePatch(): string | null {
    const result = VacationModel.patchValidationSchema.validate(this, { abortEarly: false });
    return result.error ? result.error.message : null;
  }
}
