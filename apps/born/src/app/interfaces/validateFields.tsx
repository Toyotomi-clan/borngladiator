export interface validateFields<T extends FormValidate<string, string>>{
  fields: T[]
}

export interface IOryError
{
  name: string,
  message: string,
  id: number,
  type: string,
}

export interface FormValidate<formField extends string,oryResponseField extends string>  {
  form: formField,
  ory: oryResponseField,
  error: IOryError[]
}
