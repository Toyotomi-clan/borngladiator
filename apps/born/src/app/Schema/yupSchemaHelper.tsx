import {JsonError, SelfServiceLoginFlow} from "@ory/client";
import {AxiosError} from "axios";
import {UiContainer, UiNode, UiText} from "@ory/client/api";
import {AnySchema, array, object, ObjectSchema, string} from "yup";
import {ObjectShape} from "yup/lib/object";
import {GenericError} from "@ory/client/dist/api";


type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never
type Shape<T extends Record<any, any>> =  Partial<Record<keyof T, ObjectShapeValues>>


const selfServiceLoginFlowSchema =  object<Shape<AxiosError<SelfServiceLoginFlow>>>({
  id: string().required(),
  ui: object<Shape<UiContainer>>({
    messages: array(),
    method: string(),
    action: string(),
    nodes: array().of(object<Shape<UiNode>>({
      meta: object(),
      type: string(),
      group: string(),
      attributes: object(),
      messages: array().of(object<Shape<UiNode>>({
        meta: object(),
        type: string(),
        group: string(),
        attributes: object(),
      }))
    })).required()
  })
})

const JsonErrorSchema = object<Shape<JsonError>>({
  error: object<Shape<GenericError>>({
    id: string().required(),
    status: string().required(),
    code: string().required(),
    reason: string().required()
  })
})
