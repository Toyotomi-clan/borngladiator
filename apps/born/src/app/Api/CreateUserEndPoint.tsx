import * as api from "../../../../../dist/apps/gladiator/client/index"
import {CreateUserDto} from "../../../../../dist/apps/gladiator/client/index"

import axios, {AxiosError} from "axios";
import {useMutation} from "react-query";
import {errorBoundaryBadError} from "./Api";
import {UseFormSetError} from "react-hook-form/dist/types/form";
import {NewUserModel} from "../models/newUserModel";
import {ErrorOption, FieldPath} from "react-hook-form";
import {OurEndPointFormTypes} from "../models/OurEndPointFormTypes";
import {axiosErrorCreateUserSchema, CreateUserEndPointError} from "../Schema/OurEndPointSchema";

const axiosClient = axios.create({
  baseURL: "http://localhost:5165",
  withCredentials: true
})
const client = api.BorngladiatorGladiatorVersion1000CultureneutralPublicKeyTokennullApiFactory(null,"",axiosClient);

const staleTime = 3600000;


async function CreateUser(user:CreateUserDto) {

  const response = await client.borngladiatorGladiatorFeaturesCreateUserCreateUser(user)

  return response;
}

export function useMutationNewUser(setFormError: UseFormSetError<NewUserModel>) {

  return useMutation(async (user : CreateUserDto) => {
    return await CreateUser(user);
  }, {
    retry: false,
    useErrorBoundary: errorBoundaryBadError,
    onError: (error: AxiosError<CreateUserEndPointError>) => {
      if (axiosErrorCreateUserSchema.isValidSync(error.response)) {

        //Todo: write custom error for api 400 response
        CreateUserError(error, setFormError);
      }
    }
  })
}

function CreateUserError(error: AxiosError<CreateUserEndPointError>, setFormError: (name: FieldPath<OurEndPointFormTypes>, error: ErrorOption, options?: { shouldFocus: boolean }) => void) {

  const apiError = error.response.data;

  if(apiError == null){
    throw new Error("Api failed to return error on 400 response");
  }
  for(const message of apiError.errors.dateOfBirth){
    setFormError("dateOfBirth", {
      message: message
    })  }
  for(const message of apiError.errors.gender){
    setFormError("gender", {
      message: message
    })
  }
}
