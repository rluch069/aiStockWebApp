import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/DATABASE/mongoose";
import { Prediction } from '@/DATABASE/models/Prediction';

// Predictions take 1-2 minutes on the AI engine; allow up to Vercel's 300s limit
export const maxDuration = 300;

export async function GET(
    req: Request, // <-- Make sure to use 'req' here to read the URL
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;
    const ticker = symbol.toUpperCase();

    // 1. Check if the frontend is JUST asking for a cache check
    const { searchParams } = new URL(req.url);
    const checkOnly = searchParams.get('checkOnly') === 'true';

    try {
        await connectToDatabase();

        // 2. Look for an active cache
        const existingPrediction = await Prediction.findOne({ symbol: ticker });

        if (existingPrediction) {
            console.log(`[CACHE HIT] Returning saved AI prediction for ${ticker}`);
            return NextResponse.json({ ...existingPrediction.toObject(), cached: true });
        }

        // 3. IF WE ARE JUST CHECKING, STOP HERE! Don't run Python.
        if (checkOnly) {
            console.log(`[CACHE MISS] checkOnly is true. Returning empty state for ${ticker}.`);
            return NextResponse.json({ cached: false });
        }

        // 4. CACHE MISS (Manual Button Clicked): Call the Python AI Engine
        const AI_ENGINE_URL = process.env.AI_API_URL || 'http://localhost:8000';

        console.log(`[GENERATING] Fetching fresh AI prediction for ${ticker}...`);
        const pythonResponse = await fetch(`${AI_ENGINE_URL}/predict/${ticker}`, {
            next: { revalidate: 0 },
        });

        if (!pythonResponse.ok) {
            const text = await pythonResponse.text();
            throw new Error(`AI Engine failed: ${text}`);
        }

        const aiData = await pythonResponse.json();

        // 5. Save to MongoDB
        const savedPrediction = await Prediction.findOneAndUpdate(
            { symbol: ticker },
            {
                ...aiData,
                symbol: ticker,
                createdAt: new Date()
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return NextResponse.json({ ...savedPrediction.toObject(), cached: false });

    } catch (error: any) {
        console.error('Prediction API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate prediction' }, { status: 500 });
    }
}