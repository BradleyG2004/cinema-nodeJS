 import Joi from 'joi';

export const attendanceValidation = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required()
});
