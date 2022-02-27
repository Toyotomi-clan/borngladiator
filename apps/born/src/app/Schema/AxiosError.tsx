import {z} from "zod"
import {SelfServiceLoginFlow} from "@ory/client";
import {AxiosError} from "axios";
import {UiContainer, UiNode} from "@ory/client/api";

const AxiosErrorSchema = z.object<AxiosError<SelfServiceLoginFlow>>({
  name: z.string(),
  response: z.object<SelfServiceLoginFlow>(
    {
      ui: z.object<UiContainer>({
        nodes: z.object<UiNode>({
          messages: z.array().nonempty(),

        })
      })
    }
  )
})
