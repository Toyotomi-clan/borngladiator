import {FormValidate, validateFields} from "../interfaces/validateFields";

export interface registerFormModel {
  traits:{
    username: string,
    email:string,
  }
  "password": string,
   general: boolean
}

type  OryLoginFieldResponse = "traits.email" | "traits.username" | "password" | "topLevelMessage";

type signUpFormFields = "traits.username" | "traits.email" | "password" | "general";

export const defaultSignUpFieldValues: validateFields<FormValidate<signUpFormFields,OryLoginFieldResponse>> = {
  fields: [{
    form: "traits.email",
    ory: "traits.email",
    error: null //This will get populated on runtime
  },{
    form: "password",
    ory: "password",
    error: null
  },{
    form: "traits.username",
    ory: "traits.username",
    error: null
  },
    {
      form: "general",
      ory: "topLevelMessage", //This does not get returned by ory rather we use as indication that this is the top level response
      //oryHelper.tsx line 8 to line 19 has this logic
      error: null
    }]
};


