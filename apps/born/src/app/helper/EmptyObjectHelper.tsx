import {FieldError, FieldErrors} from "react-hook-form/dist/types/errors";

export function errorIsValid(errors: FieldErrors, currentError : FieldError ): boolean{
  if(!errors || !(Object.keys(errors).length > 0)){
    return false;
  }
  if(!currentError){
    return false;
  }

  return true;
}
