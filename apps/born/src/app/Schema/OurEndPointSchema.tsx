//Todo: make our api generate this
import {array, number, object, string} from "yup";
import {Shape} from "./yupSchemaHelper";
import {AxiosResponse} from "axios";

export interface CreateUserError{
  dateOfBirth: Array<string>, gender: Array<string>,
}

export interface CreateUserEndPointError{
  errors: CreateUserError,
  statusCode: number,
  message: string
}

export interface UnsubscribeError{
  Subscribe: Array<string>, UnsubscribeId: Array<string>,
}

export interface SubscribeEndPointError{
  errors: UnsubscribeError,
  statusCode: number,
  message: string
}

const ourEndPointSchema = object<Shape<CreateUserEndPointError>>({
  errors: object<Shape<CreateUserError>>({
    gender: array().optional(),
    dateOfBirth: array().optional()
  }),
  statusCode: number().required(),
  message: string().required()
})

const SubscribeOurEndPointSchema = object<Shape<CreateUserEndPointError>>({
  errors: object<Shape<UnsubscribeError>>({
    UnsubscribeId:  array().optional(),
    Subscribe:  array().optional()
  }),
  statusCode: number().required(),
  message: string().required()
})
export const axiosErrorCreateUserSchema =  object<Shape<AxiosResponse<CreateUserEndPointError>>>({
  data: ourEndPointSchema
})

export const axiosErrorSubscribeSchema =  object<Shape<AxiosResponse<CreateUserEndPointError>>>({
  data: SubscribeOurEndPointSchema
})
