import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please provide valid email')
    .required('Please enter your email'),

  password: Yup.string().min(6).required('Please enter your password'),
})
