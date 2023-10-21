import joi from 'joi';

export const customerRegDataValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().trim().required(),

    email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Email is not a valid email pattern'
      }),

    phoneNumber: joi.string().pattern(/^(\+\d{1,3}\s?)?(\d{10,15})$/).required().messages({
          'string.pattern.base': 'Invalid phone number format. Must start with "+" followed by 10 to 15 digits.',
          'string.empty': 'Phone number cannot be empty'
      }),
    password: joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
      })
  }).strict();

  return schema.validate(data);
}

export const loginValidator = (data) => {
  const schema = joi.object({
      email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Email is not a valid email pattern'
      }),
    password: joi.string().min(8).required(),
  }).strict();

  return schema.validate(data);
}