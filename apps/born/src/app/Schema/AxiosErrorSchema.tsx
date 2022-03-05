import {array, number, object, string} from "yup";
import {
  JsonError,
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  SuccessfulSelfServiceLoginWithoutBrowser
} from "@ory/client";
import {SuccessfulSelfServiceRegistrationWithoutBrowser, UiContainer, UiNode, UiText} from "@ory/client/api";
import {GenericError, Identity, Session} from "@ory/client/dist/api";
import {AxiosError, AxiosResponse} from "axios";
import { Shape } from "./yupSchemaHelper";

const oryErrorMessageSchema = array().of(object<Shape<UiText>>({
    id: number().required(),
    type: string().required(),
    text: string().required(),
  })).optional();

const oryUiErrorMessageSchema = object<Shape<UiContainer>>({
  messages: oryErrorMessageSchema,
  method: string(),
  action: string(),
  nodes: array().of(object<Shape<UiNode>>({
    meta: object(),
    type: string(),
    group: string(),
    attributes: object(),
    messages: oryErrorMessageSchema
  })).required()
});

const identitySchema = object<Shape<Identity>>({
  id: string().required(),
  traits: object({
    email: string().required(),
    username: string().required()
  })}).required();

const sessionSchema = object<Shape<Session>>({
  id: string().required(),
  expires_at: string().required(),
  authenticated_at: string().required(),
  identity: identitySchema
});
const selfServiceFailLoginFlowSchema = object<Shape<SelfServiceLoginFlow>>({
  id: string().required(),
  created_at: string().required(),
  expires_at: string().required(),
  ui: oryUiErrorMessageSchema
});


const selfServiceSuccessSignUpFlowSchema = object<Shape<SuccessfulSelfServiceRegistrationWithoutBrowser>>({
  identity: identitySchema,
  session: sessionSchema,
  session_token: string().required()
})

const selfServiceFailSignUpFlowSchema = object<Shape<SelfServiceRegistrationFlow>>({
  id: string().required(),
  ui: oryUiErrorMessageSchema
})
const selfServiceSuccessLoginFlowSchema = object<Shape<SuccessfulSelfServiceLoginWithoutBrowser>>({
  session: sessionSchema,
  session_token: string().required()
})
const JsonErrorSchema = object<Shape<JsonError>>({
  error: object<Shape<GenericError>>({
    id: string().optional(),
    status: string().optional(),
    code: string().required(),
    reason: string().required(),
    request: string().optional(),
    message: string().optional()
  })
})


export const axiosErrorSelfServiceLoginFlowSchema =  object<Shape<AxiosResponse<SelfServiceLoginFlow>>>({
  data: selfServiceFailLoginFlowSchema
})

export const axiosErrorSelfServiceSignUpFlowSchema =  object<Shape<AxiosResponse<SelfServiceRegistrationFlow>>>({
  data: selfServiceFailSignUpFlowSchema
})
export const axiosErrorJsonSchema =  object<Shape<AxiosResponse<JsonError>>>({
  data: JsonErrorSchema
})

export const axiosSuccessSelfServiceLoginFlowSchema = object<Shape<AxiosResponse<SuccessfulSelfServiceLoginWithoutBrowser>>>({
data: selfServiceSuccessLoginFlowSchema
})

export const axiosSuccessSelfServiceSignUpFlowSchema = object<Shape<AxiosResponse<SuccessfulSelfServiceRegistrationWithoutBrowser>>>({
 data: selfServiceSuccessSignUpFlowSchema
})
