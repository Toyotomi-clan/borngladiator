import {useMutation} from "react-query";
import {AxiosError} from "axios";
import {
  axiosErrorSubscribeSchema,
  SubscribeEndPointError
} from "../Schema/OurEndPointSchema";
import {ErrorOption, FieldPath} from "react-hook-form";
import {SubscribeOurEndPointFormTypes} from "../models/OurEndPointFormTypes";
import { SubscribeDto } from "dist/apps/gladiator/client";
import {OurEndPointClient} from "./CreateUserEndPoint";
import {UseFormSetError} from "react-hook-form/dist/types/form";
import {SubscribeModel} from "../models/newUserModel";

async function Subscribe(subscribe:SubscribeDto) {

  const response = await OurEndPointClient.borngladiatorGladiatorFeaturesSubscribeSubscribe(subscribe)

  return response;
}

export function useMutationNewUser(setFormError: UseFormSetError<SubscribeModel>) {

  return useMutation(async (subscribe : SubscribeDto) => {
    return await Subscribe(subscribe);
  }, {
    useErrorBoundary: false,
    onError: (error: AxiosError<SubscribeEndPointError>) => {
      if (axiosErrorSubscribeSchema.isValidSync(error.response)) {
        //Todo: write custom error for api 400 response
        SubscribeError(error, setFormError);
      }
    }
  })
}

function SubscribeError(error: AxiosError<SubscribeEndPointError>, setFormError: (name: FieldPath<SubscribeOurEndPointFormTypes>, error: ErrorOption, options?: { shouldFocus: boolean }) => void) {

    const apiError = error.response.data;

    if(apiError == null){
      throw new Error("Api failed to return error on 400 response");
    }
    if(apiError.errors?.Subscribe !== null && apiError.errors?.Subscribe !== undefined) {
      for (const message of apiError.errors.Subscribe) {
        setFormError("subscribe", {
          message: message
        })
      }
    }
    if(apiError.errors?.UnsubscribeId !== null && apiError.errors?.UnsubscribeId !== undefined){
    for(const message of apiError.errors.UnsubscribeId) {
      setFormError("unsubscribeId", {
        message: message
      })
    }
    if (apiError.message) {
      setFormError("generalError", {
        message: apiError.message
      });
    }
  }
}
