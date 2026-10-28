'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import { headers } from "next/headers";
import { connectToDatabase } from "@/DATABASE/mongoose";
import { Watchlist } from "@/DATABASE/models/watchlist.model";
import Portfolio from "@/DATABASE/models/Portfolio";
import { DEMO_ACCOUNT, DEMO_WATCHLIST, DEMO_PORTFOLIO } from "@/lib/demo-account";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            // The account already exists at this point, so a failed welcome email must not fail the sign-up
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                })
            } catch (e) {
                console.log('Welcome email could not be queued', e)
            }
        }

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign up failed', e)
        return { success: false, error: 'Sign up failed' }
    }
}

export const signOut = async () =>{
    try{
        await auth.api.signOut({headers: await headers()});
    } catch (e){
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}

export const signInWithEmail = async ({ email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })
        return { success: true, data: response }
    } catch (e) {
        console.log('Sign In failed', e)
        return { success: false, error: 'Sign In failed' }
    }
}

/**
 * One-click demo sign-in. Signs in to the shared demo account, creating it (with a sample
 * watchlist and portfolio) the first time. Turned off when NEXT_PUBLIC_DEV_MODE=false.
 */
export const signInAsDemo = async () => {
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'false') return { success: false, error: 'Demo is turned off' }
    const { name, email, password } = DEMO_ACCOUNT

    try {
        await auth.api.signInEmail({ body: { email, password } })
        return { success: true }
    } catch {
        // No demo account yet: create it below
    }

    try {
        // autoSignIn is on, so this also signs the visitor in. No welcome email for the demo.
        const { user } = await auth.api.signUpEmail({ body: { email, password, name } })
        await connectToDatabase()
        await Watchlist.insertMany(DEMO_WATCHLIST.map((w) => ({ ...w, userId: user.id })))
        await Portfolio.insertMany(DEMO_PORTFOLIO.map((p) => ({ ...p, userId: user.id })))
        return { success: true }
    } catch (e) {
        console.log('Demo sign in failed', e)
        return { success: false, error: 'Demo sign in failed' }
    }
}
