import * as Yup from 'yup';
import { ValidationError } from '../../lib/errors';

export default async (request, response, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    await schema.validate(request.body, { abortEarly: false });

    return next();
  } catch (err) {
    throw new ValidationError(null, err.inner);
  }
};
