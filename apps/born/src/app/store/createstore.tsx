import create from "zustand";
import { devtools } from 'zustand/middleware'

type Store = {
  logoutClicked: boolean
  toggleLogoutFlow: () => void,

}

const createStore = create<Store>((set,get ) => ({
  logoutClicked: false,
  toggleLogoutFlow: () => set(state => ({
    logoutClicked: !state.logoutClicked
  }))
}));

//Todo: only enable devTools on dev
//Todo: add devtool
const useStore = createStore;



export default useStore;
