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

    let errors: IOryError[] = [];

    if(node.messages && node.messages.length  > 0 ) {
      for (const message of node.messages) {
        errors.push({
          message: message.text,
          type: message.type,
          id: message.id,
          name: input.name
        })
      }
    }
    else{
      errors.push({
        message: "",
        type: "",
        id: 0,
        name: input.name
      })
    }
    expectedOryField.error = errors;
  }
  return validateOryResponse;
}

export function findCsrfToken(oryResponse:UiContainer): string{

  //Todo: make this more bullet proof
  const attributes = oryResponse.nodes.filter(x => x.group === 'default' && x.attributes as UiNodeInputAttributes).map(x => x.attributes as UiNodeInputAttributes);

  if(!attributes || attributes.length === 0){
    return null;
  }

  const csrfNode = attributes.find(x => x.name.includes("csrf"));

  return csrfNode?.value || null;
}
