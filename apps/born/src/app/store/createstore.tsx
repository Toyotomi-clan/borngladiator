import create from "zustand";
import {SelfServiceLoginFlow, Session, V0alpha2ApiFactory} from "@ory/client";
import {SuccessfulSelfServiceRegistrationWithoutBrowser} from "@ory/client/api";

type Store = {
  User:SuccessfulSelfServiceRegistrationWithoutBrowser;
  SetSession: (auth: SuccessfulSelfServiceRegistrationWithoutBrowser) => void;
  RemoveSession: () => void;
  SelfServiceLogin: SelfServiceLoginFlow
  SetLoginSelfServiceFlow: (flow: SelfServiceLoginFlow) => void,
}
const defaultAuth = {} as SuccessfulSelfServiceRegistrationWithoutBrowser;
const defaultLoginFlow = {} as SelfServiceLoginFlow;

const useStore = create<Store>((set) => ({
  User: defaultAuth,
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
