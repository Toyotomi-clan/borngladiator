import axios, {AxiosResponse} from "axios";
import {environment} from "../environments/environment";
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import {queryCache, queryClient} from "./QueryClient";
import {QueryClient} from "react-query";
import {Session} from "@ory/client/dist/api";

export const errorHandler = async (error: Error, info: {componentStack: string}) => {
  //Get user fingerprint
  const fingerPrint =  await visitorFingerPrint();
  const actualUser = await getAuthenticatedUser();
  //https://docs.datalust.co/docs/built-in-properties-and-functions
  const time = '@t';
  const message = "@m"
  const level = "@l"
  //Todo: maybe include device fingerprint

  const seqLogReport = JSON.stringify(
    {
      Exception: error,
      reason: info,
      [time]: new Date(),
      http: window.location.href,
      [message]: error.message,
      [level]: "error",
      ...fingerPrint,
      ...actualUser
    });

  await axios.post(`${environment.seqLogServer}/api/events/raw?clef`,seqLogReport,{
    headers: {"X-Seq-ApiKey": environment.seqApiKey}
  });
}

async function visitorFingerPrint(){
  const load = await FingerprintJS.load()
  const fingerPrint = await  load.get();
  return  {
     fingerPrintConfidence: fingerPrint.confidence,
     fingerPrintVisitorId: fingerPrint.visitorId,
     fingerPrintVersion: fingerPrint.version
  }
}
async function getAuthenticatedUser(){
  const user: AxiosResponse<Session> =  queryClient.getQueryData("user")
  const session  =  user?.data?.identity;

  if(!session){
    return {
      authenticated: false
    }
  }
  
  return {
    authenticated: true,
    angle: session.id,
  }
}
