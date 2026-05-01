import { Inngest } from "inngest";
//@ts-ignore
type CodeAgentEvent = {
  data: {
    projectId: string;
    value: string;
  };
};
//@ts-ignore
type Events = {
  "code-agent/run": CodeAgentEvent;
};

// Create a client to send and receive events
//@ts-ignore
export const inngest = new Inngest({ id: "v0-clone",isDev:true });

const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [helloWorld];