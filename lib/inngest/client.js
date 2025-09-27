import { max } from "date-fns";
import { Inngest } from "inngest";

export const inngest = new Inngest({
        id: "wealthmind",
        name: "WealthMind",
        retryFunction: async (attempt) => ({
            delay:Math.pow(2, attempt) * 1000,
            maxAttempts:2
        }) 
    
    });