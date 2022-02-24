export interface registerFormModel {
  traits:{
    username: string,
    email:string,
  }
  "password": string,
   oryValidationGeneral: boolean
}
export interface LoginFormModel {
  email:string,
  password: string,
  oryValidationGeneral: boolean
}
export type validateField = "traits.username" | "traits.email" | "password";

interface validateFieldAttribute{
  fields: validateField []
}

export const defaultFields : validateFieldAttribute = {
  fields: ["traits.username","traits.email","password"]
}
interface formError{
  error: boolean,
  message: string
}
export interface registerFormPostError{
  traits: {
  username: formError
  email: formError
  },
  password: formError
}
export const defaultRegisterPostError : registerFormModel = {
  password: "",
  traits:{
    username: "",
    email: "",
  },
  oryValidationGeneral: false
}
