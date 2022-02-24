import {SelfServiceLoginFlow, V0alpha2ApiFactory} from "@ory/client"
import {useMutation, useQuery} from "react-query";
import {LoginFormModel} from "../models/registerFormModel";
import {SubmitSelfServiceLoginFlowBody} from "@ory/client/dist/api";

async  function  startLoginFlow(){
  const path = "/.ory";
  const client = V0alpha2ApiFactory(null,path);

  const response =  await client.initializeSelfServiceLoginFlowForBrowsers(false,"aal1","")

  return response;
}

async  function  postLoginForm(post: {flow: SelfServiceLoginFlow, model : SubmitSelfServiceLoginFlowBody}){
  const path = "/.ory";
  const client = V0alpha2ApiFactory(null,path);


  const response =  await client.submitSelfServiceLoginFlow(post.flow.id,null,post.model)

  return response;
}

//20M in milliseconds
const staleTime = 1200000;

export default function useStartLoginFlow(){
  return useQuery("get",startLoginFlow,{
    staleTime: staleTime
  });
}

export function  useMutateLogin(){
  return useMutation((post: {flow: SelfServiceLoginFlow, model : SubmitSelfServiceLoginFlowBody}) => {
    return postLoginForm(post);
  })
}
