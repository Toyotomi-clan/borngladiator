import create from "zustand";
import {Session} from "@ory/client";
import {SuccessfulSelfServiceRegistrationWithoutBrowser} from "@ory/client/api";


type Store = {
  User:SuccessfulSelfServiceRegistrationWithoutBrowser;
  SetSession: (auth: SuccessfulSelfServiceRegistrationWithoutBrowser) => void;
  RemoveSession: () => void;
}
const defaultAuth: SuccessfulSelfServiceRegistrationWithoutBrowser = {
  session: undefined,
  session_token: undefined,
  identity: undefined
}

const useStore = create<Store>((set) => ({
  User: defaultAuth,
  SetSession: (auth) => set(state => ({
    User: auth
  })),
  RemoveSession: () => set(state => ({
    User: defaultAuth
  }))
}))

export default useStore;
