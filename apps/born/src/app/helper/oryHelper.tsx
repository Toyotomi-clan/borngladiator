import {Node, Ui} from "../models/registerRequest";
import {
  defaultFields,
} from "../models/registerFormModel";
import {UiContainer, UiNode, UiNodeAttributes, UiNodeInputAttributes} from "@ory/client/api";


export default function oryRegisterFormErrorSetter(oryResponse:Ui): Node[]
{

  const defaultField = defaultFields;

  const attributes = oryResponse.nodes.filter(x =>
       defaultField.fields
      .includes(x.attributes.name as "traits.username" | "traits.email" | "password") && x.messages?.length > 0);

  return attributes;
}

export function findCsrfToken(oryResponse:UiContainer): string{

  const node = oryResponse.nodes.find(x => x.group === 'default' && x.attributes as UiNodeInputAttributes);

  if(!node){
    return null;
  }

  const csrfNode = node.attributes as UiNodeInputAttributes;

  return csrfNode?.value || null;
}
