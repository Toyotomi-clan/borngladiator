export interface registerFormModel {
  traits:{
    username: string,
    email:string,
  }
  "password": string,
   oryValidationGeneral: boolean
}

export type validateField = "traits.username" | "traits.email" | "password";

