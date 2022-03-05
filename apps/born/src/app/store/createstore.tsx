import create from "zustand";
import {SelfServiceLoginFlow, Session, SuccessfulSelfServiceLoginWithoutBrowser, V0alpha2ApiFactory} from "@ory/client";
import {SuccessfulSelfServiceRegistrationWithoutBrowser} from "@ory/client/api";
import {useCurrentUser} from "../Api/Api";

type Store = {
  User:SuccessfulSelfServiceRegistrationWithoutBrowser | SuccessfulSelfServiceLoginWithoutBrowser;
  SetSession: (auth: SuccessfulSelfServiceRegistrationWithoutBrowser | SuccessfulSelfServiceLoginWithoutBrowser) => void;
  RemoveSession: () => void;
  SelfServiceLogin: SelfServiceLoginFlow
  SetLoginSelfServiceFlow: (flow: SelfServiceLoginFlow) => void,
  isUserAuthenticated: () => boolean,
}
export const defaultAuth = {} as SuccessfulSelfServiceRegistrationWithoutBrowser;
const defaultLoginFlow = {} as SelfServiceLoginFlow;

const useStore = create<Store>((set,get ) => ({
  User: defaultAuth,
  isUserAuthenticated: () =>{

    return get().User !== defaultAuth;
  },
  SelfServiceLogin: defaultLoginFlow,
  SetSession: (auth) => set(state => ({
    User: auth
  })),
  RemoveSession: () => set(state => ({
    User: defaultAuth
  })),
  SetLoginSelfServiceFlow:(flow) => set(state => ({
    SelfServiceLogin: flow
  }))
}))

export default useStore;
