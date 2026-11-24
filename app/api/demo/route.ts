import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/DATABASE/mongoose";
import { Watchlist } from "@/DATABASE/models/watchlist.model";
import Portfolio from "@/DATABASE/models/Portfolio";
import { DEMO_ACCOUNT, DEMO_WATCHLIST, DEMO_PORTFOLIO } from "@/lib/demo-account";

/**
 * There is no sign-in page: the (root) layout sends every visitor without a session here, and this
 * signs them in to the shared demo account, creating it (with a sample watchlist and portfolio) the first time.
 */
export async function GET(request: Request) {
    const { name, email, password } = DEMO_ACCOUNT;
    const home = NextResponse.redirect(new URL('/', request.url));

    try {
        await auth.api.signInEmail({ body: { email, password } });
        return home;
    } catch {
        // No demo account yet: create it below
    }

    try {
        // autoSignIn is on, so this also signs the visitor in
        const { user } = await auth.api.signUpEmail({ body: { email, password, name } });
        await connectToDatabase();
        await Watchlist.insertMany(DEMO_WATCHLIST.map((w) => ({ ...w, userId: user.id })));
        await Portfolio.insertMany(DEMO_PORTFOLIO.map((p) => ({ ...p, userId: user.id })));
        return home;
    } catch (e) {
        console.log('Demo sign in failed', e);
        // A plain error page, not a redirect: redirecting back to / would loop
        return new NextResponse('The demo is unavailable right now. Please try again in a moment.', { status: 503 });
    }
}
