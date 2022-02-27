import {FormValidate, validateFields} from "../interfaces/validateFields";

export type LoginFormModel = {
  email:string,
  password: string,
  general: boolean
}

//fields we get from ory as response on submit for 400 status code (under these fields there will be a message
//to indicate what has gone wrong)
type  OryLoginFieldResponse = "password_identifier" | "password" | "topLevelMessage";
//fields that map directly to the login form
type  LoginFormFields = "email" | "password" | "general";

//Form fields represent what is in the form while ory represent what is in the ory response for that field
//error would be in the ory response under that ory field i.e. email error under password_identifier message in the response
export const defaultLoginFieldValues: validateFields<FormValidate<LoginFormFields,OryLoginFieldResponse>> = {
  fields: [{
    form: "email",
    ory: "password_identifier",
    error: null //This will get populated on runtime
  },{
    form: "password",
    ory: "password",
    error: null
  },
    {
      form: "general",
      ory: "topLevelMessage",
      error: null
    }]
};
