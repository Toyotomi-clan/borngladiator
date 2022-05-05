import {OurEndPointClient} from "./CreateUserEndPoint";
import {useQuery} from "react-query";

async function GetUser(){
  const response = await OurEndPointClient.borngladiatorGladiatorFeaturesGetUserGetUser()

  return response;
}

export function useDeathClockUser(){
  return useQuery("deathClockUser",async () => {
    return await GetUser();
  },{
    useErrorBoundary: true,
  })
}
