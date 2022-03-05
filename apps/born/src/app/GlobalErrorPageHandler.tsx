import {AxiosResponse} from "axios";
import {JsonError} from "@ory/client";
import {axiosErrorJsonSchema} from "./Schema/AxiosErrorSchema";
import {NotAuthorized} from "./NotAuthorizedPage";
import {GenericError} from "./GenericError";
import {AlreadyLoggedInPage} from "./AlreadyLoggedInPage";

export function GlobalErrorPageHandler({error, resetErrorBoundary}) {

  const response: AxiosResponse<JsonError> = error?.response;

  const isServerError =  axiosErrorJsonSchema.isValidSync(response);

  if (isServerError) {
    const currentJsonResponseError: JsonError = response.data || null;

    const notAuthorized = currentJsonResponseError && currentJsonResponseError.error.code === 401;

    if (notAuthorized) {
      return <NotAuthorized message={currentJsonResponseError.error.message} resetErrorBoundary={resetErrorBoundary}/>
    }

    const alreadyLoggedIn = currentJsonResponseError &&
      currentJsonResponseError.error.code === 400
      && currentJsonResponseError.error.id === "session_already_available"

    if (alreadyLoggedIn) {
      return <AlreadyLoggedInPage message={currentJsonResponseError.error.message}
                                  resetErrorBoundary={resetErrorBoundary}/>
    }
  }
    return <GenericError resetErrorBoundary={resetErrorBoundary}/>
}
