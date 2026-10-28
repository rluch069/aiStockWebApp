import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/DATABASE/mongoose";
import Portfolio from '@/DATABASE/models/Portfolio';

// 1. Import better-auth and Next.js headers
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

// GET all portfolio items for a user
export async function GET(req: Request) {
    try {
        await connectToDatabase();

        // Authenticate the request
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch only this user's stocks
        const items = await Portfolio.find({ userId });
        return NextResponse.json(items);

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST to add or update a stock
export async function POST(req: Request) {
    try {
        await connectToDatabase();

        // Authenticate the request
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ticker, shares, buyPrice } = await req.json();
        const userId = session.user.id;

        // Check if the user already owns this specific stock
        const existing = await Portfolio.findOne({ userId, ticker });

        if (existing) {
            existing.shares = shares;
            existing.buyPrice = buyPrice;
            await existing.save();
            return NextResponse.json({ message: "Updated", data: existing });
        }

        const newItem = await Portfolio.create({ userId, ticker, shares, buyPrice });
        return NextResponse.json({ message: "Added", data: newItem });

    } catch (error) {
        return NextResponse.json({ error: "Failed to save stock" }, { status: 500 });
    }
}

// DELETE to remove a stock
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();

        // Authenticate the request
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const ticker = searchParams.get('ticker');
        const userId = session.user.id;

        if (!ticker) {
            return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
        }

        // Delete the specific stock for this specific user
        await Portfolio.findOneAndDelete({ userId, ticker });
        return NextResponse.json({ message: "Deleted" });

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete stock" }, { status: 500 });
    }
}