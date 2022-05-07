import axios from "axios";
import {environment} from "../environments/environment";
import FingerprintJS from "@fingerprintjs/fingerprintjs"

export const errorHandler = async (error: Error, info: {componentStack: string}) => {
  // Do something with the error
  // E.g. log to an error logging client here

  //Get user fingerprint
  const fingerPrint =  await visitorFingerPrint();
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
      ...fingerPrint
    });

  await axios.post(`${environment.seqLogServer}/api/events/raw?clef`,seqLogReport);
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
