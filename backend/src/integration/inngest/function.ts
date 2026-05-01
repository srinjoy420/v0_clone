import {Sandbox} from "e2b"
import { inngest } from "./client.js";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: [{ event: "code-agent/run" }] },
  async ({ event, step }) => {
    // return { message: "code agent ran" };
    const sandboxId=await step.run("get-sandbox-id",async()=>{
      const sandbox=await Sandbox.create("myv0-app-clone1")

      return sandbox.sandboxId
    })
  },
);