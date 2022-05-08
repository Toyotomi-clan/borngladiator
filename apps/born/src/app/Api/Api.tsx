import {
  JsonError,
  SelfServiceLoginFlow, SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody,
  V0alpha2ApiFactory
} from "@ory/client"
import {useMutation, useQuery} from "react-query";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import axios, {AxiosError} from "axios";
import {UseFormSetError} from "react-hook-form/dist/types/form";
import OryErrors from "../helper/oryHelper";
import {defaultLoginFieldValues, LoginFormModel} from "../models/loginModels";
import {
  axiosErrorSelfServiceLoginFlowSchema, axiosErrorSelfServiceSignUpFlowSchema
} from "../Schema/AxiosErrorSchema";
import {ErrorOption, FieldPath} from "react-hook-form";
import {defaultSignUpFieldValues, registerFormModel} from "../models/registerFormModel";
import {oryFormFieldTypes, oryFormTypes} from "../models/OryFormTypes";
import {queryClient} from "../QueryClient";
import {NavigateFunction} from "react-router";
import useStore from "../store/createstore";
import {environment} from "../../environments/environment";

const allowOrigins = environment.production ? environment.Ory : "*";
const axiosClient = axios.create({
  baseURL: environment.Ory,
  headers: {
    "Access-Control-Allow-Origin": allowOrigins
  }
});

const client = V0alpha2ApiFactory(null, "", axiosClient);

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

async function getLogoutUser(logoutUrl) {

  const response = await axiosClient.get(logoutUrl);

  return response;
}

async function getLogoutUserFlow() {

  const response = await client.createSelfServiceLogoutFlowUrlForBrowsers();

  return response;
}
//Todo: when user is already logged in redirect them to the home page
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
    useErrorBoundary: (error: AxiosError<JsonError>) => error?.response?.status !== 200
  })
}

export function useMutationSignUp(setFormError: UseFormSetError<registerFormModel>) {

  return useMutation(async (post: { flow: SelfServiceRegistrationFlow, model: SubmitSelfServiceRegistrationFlowBody }) => {
    return await postSignUpForm(post);
  }, {
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
    staleTime: environment.userSessionStaleTime,
    retry: false,
    useErrorBoundary: false,
  });
}
export function useLogoutUser(userClickedLogout: boolean,logoutUrl: string, reactRouterRedirect: NavigateFunction) {
  const toggleLogoutFlow = useStore(x => x.toggleLogoutFlow)


  return useQuery("logoutUser",async () => {
    return await getLogoutUser(logoutUrl)
  }, {
    useErrorBoundary: true,
    enabled: !!logoutUrl && userClickedLogout ,
    onSuccess: async (data) => {

      await queryClient.invalidateQueries("user")
      toggleLogoutFlow()
      reactRouterRedirect("/login")
      //Todo: we are doing this because the http-cookie still lives on after we asked the server to logout user
      //Todo: implement a middleware that clears https-cookies (in node) on this request
      window.location.reload();
    }
  });
}

export function useLogoutFlow(userIsLoggedIn) {
  return useQuery("logoutFlow", getLogoutUserFlow, {
    useErrorBoundary: true,
    enabled: userIsLoggedIn
  });
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

