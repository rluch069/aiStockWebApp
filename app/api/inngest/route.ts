import {inngest} from "@/lib/inngest/client";
import {serve} from "inngest/next"
import {sendDailyNewsSummary, sendSignUpEmail, generateEarningsSummary,} from "@/lib/inngest/functions";

// Inngest v4 on Vercel: give step runs the full 300s (see Inngest's v3->v4 migration guide)
export const maxDuration = 300;

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary,generateEarningsSummary],
})