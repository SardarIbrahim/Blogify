import * as Yup from 'yup'

// Signup Schema
export const signupSchema = Yup.object({
  name: Yup.string().min(2).max(25).required('Please enter your name'),

  email: Yup.string()
    .email('Please provide valid email')
    .required('Please enter your email'),

  password: Yup.string().min(6).required('Please enter your password'),

  confirmpassword: Yup.string()
    .required()
    .min(6)
    .oneOf([Yup.ref('password'), null], 'Password must match'),
})

// profile Schema
export const profileSchema = Yup.object({
  name: Yup.string().min(2).max(25),

  email: Yup.string().email('Please provide valid email'),

  password: Yup.string().min(6),

  confirmpassword: Yup.string()
    .min(6)
    .oneOf([Yup.ref('password'), null], 'Password must match'),
})
