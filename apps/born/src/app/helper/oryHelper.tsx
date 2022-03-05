import {UiContainer, UiNodeInputAttributes} from "@ory/client/api";
import {FormValidate, IOryError, validateFields} from "../interfaces/validateFields";


export default function OryErrors<Form extends string,Ory extends  string>
(oryResponse:UiContainer, formFields: validateFields<FormValidate<Form,Ory>>)
{
  const validateOryResponse = Object.assign({},formFields);
  
  const topLevelContainerMessage: IOryError[] = oryResponse?.messages?.map(x => ({
      name: "general",
      message: x.text,
      id: x.id,
      type: x.type
  })) || [];

  const generalField = validateOryResponse.fields.find(x => x.form === "general");

  if(!generalField){
    throw "Expected a general ory validation error field"
  }

  generalField.error = topLevelContainerMessage;

  if(!oryResponse.nodes){
    return formFields;
  }

  for(const node of oryResponse.nodes){
    const input = node.attributes as UiNodeInputAttributes;

    if(!input){
      continue;
    }

    //ory field essentially would make directly to x.form for example email === password_identifier one is what we expect
    //the latter is what we get as response from ory
    const expectedOryField = validateOryResponse.fields.find(x => x.ory === input.name);

    if(!expectedOryField){
      continue;
    }

    if(!node.messages || node.messages.length === 0 ){
      continue;
    }
    let errors: IOryError[] = [];
    for(const message of node.messages){
      errors.push({
        message: message.text,
        type: message.type,
        id: message.id,
        name: input.name
      })
    }
    expectedOryField.error = errors;
  }
  return validateOryResponse;
}

export function findCsrfToken(oryResponse:UiContainer): string{

  const node = oryResponse.nodes.find(x => x.group === 'default' && x.attributes as UiNodeInputAttributes);

  if(!node){
    return null;
  }

  const csrfNode = node.attributes as UiNodeInputAttributes;

  return csrfNode?.value || null;
}
