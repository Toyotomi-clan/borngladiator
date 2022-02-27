import {
  JsonError,
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlowState,
  SelfServiceSettingsFlowState,
  V0alpha2ApiFactory
} from "@ory/client"
import {useMutation, useQuery} from "react-query";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";
import {AxiosError} from "axios";
import {UseFormSetError} from "react-hook-form/dist/types/form";
import OryErrors from "../helper/oryHelper";
import {defaultLoginFieldValues, LoginFormModel} from "../models/loginModels";



async  function  startLoginFlow(){
  const path = "/.ory";
  const client = V0alpha2ApiFactory(null,path);

  const response =  await client.initializeSelfServiceLoginFlowForBrowsers(false,"aal1","")

  return response;
}

async  function  postLoginForm(post: {flow: SelfServiceLoginFlow, model : SubmitSelfServiceLoginFlowBody}){
  const path = "/.ory";
  const client = V0alpha2ApiFactory(null,path);


  const response =  await client.submitSelfServiceLoginFlow("lol",null,post.model)

  return response;
}

//20M in milliseconds
const staleTime = 1200000;

export default function useStartLoginFlow(){
  return useQuery("get",startLoginFlow,{
    staleTime: staleTime
  });
}

export function  useMutateLogin(setFormError: UseFormSetError<LoginFormModel>){
  return useMutation((post: {flow: SelfServiceLoginFlow, model : SubmitSelfServiceLoginFlowBody}) => {
    return postLoginForm(post);
  },{
    onError:(error: AxiosError<SelfServiceLoginFlow> | AxiosError<JsonError>) => {
      //bad request something wrong with our submitted form
      let x: AxiosError<SelfServiceLoginFlow> = null;
      x.
      //use zod to varify instead
      if (error.response.status === 400 && isA<SelfServiceLoginFlow>(error.response.data)){
        const response = error.response.data as SelfServiceLoginFlow ;
        const jsError = response

        if(!response){
          //invalid state ory returns response SelfServiceLoginFlow response on 400
          //https://www.ory.sh/docs/reference/api#operation/submitSelfServiceLoginFlow
          //Todo: log this and return error to the user
        }
        let fields = defaultLoginFieldValues;

        const uiErrors =  OryErrors(response.ui,fields);

        for(const uiError of uiErrors.fields){

          if(!uiError.error){
            continue;
          }

          for(const message of uiError.error){
            setFormError(uiError.form,{
              type: message.type,
              message: message.message,
            });
          }
        }
      }
      if(error.response.status === 403 ||
        error.response.status ===  500){
        const response = error.response.data as JsonError;
        if(!response){
          //invalid state
        }
        setFormError("general",{
          message:response.error.reason,
          type: response.error.status
        })
      }


    }
  })
}
