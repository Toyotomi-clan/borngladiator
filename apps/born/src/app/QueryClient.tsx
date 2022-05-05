import {QueryCache, QueryClient} from "react-query";
import {environment} from "../environments/environment";

export const queryCache = new QueryCache({
})
export const queryClient = new QueryClient({
  queryCache: queryCache,
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: environment.defaultStaleTime,
      retry: environment.defaultRetryRate
    }
  }
});
