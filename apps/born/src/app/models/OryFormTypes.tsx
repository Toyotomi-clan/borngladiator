import {defaultLoginFieldValues, LoginFormModel} from "./loginModels";
import { defaultSignUpFieldValues, registerFormModel} from "./registerFormModel";

export type oryFormTypes = LoginFormModel | registerFormModel;

export type oryFormFieldTypes = typeof defaultLoginFieldValues | typeof defaultSignUpFieldValues;
