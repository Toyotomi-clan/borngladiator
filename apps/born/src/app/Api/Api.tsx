import {
  JsonError,
  SelfServiceLoginFlow, SelfServiceLogoutUrl, SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody,
  V0alpha2ApiFactory
} from "@ory/client"
import {useMutation, useQuery} from "react-query";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import axios, {AxiosError, AxiosResponse} from "axios";
import {UseFormSetError} from "react-hook-form/dist/types/form";
import OryErrors from "../helper/oryHelper";
import {defaultLoginFieldValues, LoginFormModel} from "../models/loginModels";
import {
  axiosErrorSelfServiceLoginFlowSchema, axiosErrorSelfServiceSignUpFlowSchema
} from "../Schema/AxiosErrorSchema";
import {ErrorOption, FieldPath} from "react-hook-form";
import {defaultSignUpFieldValues, registerFormModel} from "../models/registerFormModel";
import {oryFormFieldTypes, oryFormTypes} from "../models/OryFormTypes";

const path = "/.ory";

const axiosClient = axios.create({});

const client = V0alpha2ApiFactory(null, path, axiosClient);

const staleTime = 3600000;

async function startLoginFlow() {

  const response = await client.initializeSelfServiceLoginFlowForBrowsers(false, "aal1", "")

  return response;
}

async function startSignUpFlow() {

  const response = await client.initializeSelfServiceRegistrationFlowForBrowsers("", "aal1");

  return response;
}

async function getCurrentUser() {

  const response = await client.toSession();

  return response;
}

async function getLogoutUser() {

  const response = await client.createSelfServiceLogoutFlowUrlForBrowsers();

  return response;
}

async function postLoginForm(post: { flow: SelfServiceLoginFlow, model: SubmitSelfServiceLoginFlowBody }) {

  const response = await client.submitSelfServiceLoginFlow(post.flow.id, null, post.model)

  return response;
}

async function postSignUpForm(post: { flow: SelfServiceRegistrationFlow, model: SubmitSelfServiceRegistrationFlowBody }) {

  const response = await client.submitSelfServiceRegistrationFlow(post.flow.id, post.model)

  return response;
}


export function useStartLoginFlow() {
  return useQuery("startLoginFlow", startLoginFlow, {
    staleTime: staleTime,
    retry: false,
    useErrorBoundary: (error: AxiosError<JsonError>) => error?.response?.status !== 200
  });
}
export function useMutateLogin(setFormError: UseFormSetError<LoginFormModel>) {
  return useMutation(async (post: { flow: SelfServiceLoginFlow, model: SubmitSelfServiceLoginFlowBody }) => {
    return await postLoginForm(post);
  }, {
    useErrorBoundary: errorBoundaryBadError,
    onError: (error: AxiosError<SelfServiceLoginFlow>) => {
      if (axiosErrorSelfServiceLoginFlowSchema.isValidSync(error.response)) {
        OnErrorFormUserFeedback(error, setFormError, defaultLoginFieldValues);
      }
    }
  })
}

export function useStartSignUpFlow() {
  return useQuery("startSignUpFlow", startSignUpFlow, {
    staleTime: staleTime,
    retry: false,
    useErrorBoundary: (error: AxiosError<JsonError>) => error?.response?.status !== 200
  })
}

export function useMutationSignUp(setFormError: UseFormSetError<registerFormModel>) {

  return useMutation(async (post: { flow: SelfServiceRegistrationFlow, model: SubmitSelfServiceRegistrationFlowBody }) => {
    return await postSignUpForm(post);
  }, {
    retry: false,
    useErrorBoundary: errorBoundaryBadError,
    onError: (error: AxiosError<SelfServiceRegistrationFlow>) => {
      if (axiosErrorSelfServiceSignUpFlowSchema.isValidSync(error.response)) {
        OnErrorFormUserFeedback(error, setFormError, defaultSignUpFieldValues);
      }
    }
  })
}

export function useCurrentUser() {
  return useQuery("user", getCurrentUser, {
    retry: false,
  });
}

export function useLogout(userIsLoggedIn) {
  return useQuery("logout", getLogoutUser, {
    retry: false,
    useErrorBoundary: true,
    enabled: userIsLoggedIn
  });
}


function NonFormError(error: AxiosError<SelfServiceRegistrationFlow> | AxiosError<JsonError>, setFormError: (name: FieldPath<oryFormTypes>, error: ErrorOption, options?: { shouldFocus: boolean }) => void) {
  const response = error.response.data as JsonError;

  setFormError("general", {
    message: response.error.message,
    type: response.error.status
  })
}

export function errorBoundaryBadError<T>(error: AxiosError<T>): boolean {
  return !error || !error?.response || error?.response?.status !== 400;
}


//Todo move all this stuff into their own logical container
type uiResponse = SelfServiceLoginFlow | SelfServiceRegistrationFlow;

function OnErrorFormUserFeedback(error: AxiosError<uiResponse> | AxiosError<JsonError>, setFormError: (name: FieldPath<oryFormTypes>, error: ErrorOption, options?: { shouldFocus: boolean }) => void, defaultFields: oryFormFieldTypes) {
  const response = error.response.data as uiResponse;

  const uiErrors = OryErrors(response.ui, defaultFields);

  for (const uiError of uiErrors.fields) {

    if (!uiError.error) {
      continue;
    }

    for (const error of uiError.error) {
      if (error?.message) {
        setFormError(uiError.form, {
          type: error.type,
          message: error.message,
        });
      }
    }
  }
}

