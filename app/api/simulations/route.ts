import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/DATABASE/mongoose";
import SavedSimulation from '@/DATABASE/models/savedSimulation';

// 1. Import your auth instance and Next.js headers
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    await connectToDatabase();

    // 2. Fetch the active session using better-auth
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 3. Protect the route
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // 4. Use the dynamic user ID from the session instead of 'demo_user'
    const userId = session.user.id;

    const sim = await SavedSimulation.create({ userId, ...data });
    return NextResponse.json({ success: true, sim });
}


export async function GET(req: Request) {
    try {
        await connectToDatabase();

        // 2. Fetch the active session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        // 3. Protect the route
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 4. Grab the actual user's ID
        const userId = session.user.id;

        // 5. Fetch ONLY this user's simulations
        const sims = await SavedSimulation.find({ userId }).sort({ dateSaved: -1 });
        return NextResponse.json(sims);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch simulations" }, { status: 500 });
    }
}