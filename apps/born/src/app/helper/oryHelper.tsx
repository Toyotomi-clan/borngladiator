import {Node, Ui} from "../models/registerRequest";
import {
  defaultFields,
  defaultRegisterPostError,
  registerFormPostError,
  validateField
} from "../models/registerFormModel";


export default function oryRegisterFormErrorSetter(oryResponse:Ui): Node[]
{

  const defaultField = defaultFields;

  const attributes = oryResponse.nodes.filter(x =>
       defaultField.fields
      .includes(x.attributes.name as "traits.username" | "traits.email" | "password") && x.messages?.length > 0);

  return attributes;
}
