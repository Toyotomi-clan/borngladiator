import {QueryCache, QueryClient} from "react-query";

export const queryCache = new QueryCache({
  onError: error => {
    console.log("Toast")
  }
})
export const queryClient = new QueryClient({
  queryCache: queryCache
});
