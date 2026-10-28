'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function PredictionSection({ symbol }: { symbol: string }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [isInitialCheck, setIsInitialCheck] = useState(true);

    // 1. Silently check for a cached prediction when the page loads
    useEffect(() => {
        const checkCache = async () => {
            try {
                const res = await fetch(`/api/predict/${symbol}?checkOnly=true`);
                const text = await res.text();

                if (res.ok) {
                    const result = JSON.parse(text);
                    // Only auto-load if it was explicitly pulled from the cache
                    if (result.cached) {
                        setData(result);
                    }
                }
            } catch (err) {
                console.error("Cache check failed", err);
            } finally {
                setIsInitialCheck(false);
            }
        };

        checkCache();
    }, [symbol]);

    // 2. The manual button trigger (runs Python if cache doesn't exist)
    const runPrediction = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/predict/${symbol}`);
            const text = await res.text();

            if (!res.ok) {
                throw new Error(`Server Error ${res.status}: ${text || 'Empty response'}`);
            }

            const result = JSON.parse(text);
            if (result.error) throw new Error(result.error);

            setData(result);
        } catch (err: any) {
            console.error("Fetch failed:", err);
            setError(err.message || 'Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    // Don't flash the button while we are silently checking the database
    if (isInitialCheck) return null;

    return (
        <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <BrainCircuit className="text-blue-400" />
                        AI Monte Carlo Engine
                    </h2>
                    <p className="text-sm text-slate-400">GRU-Attention Neural Network Simulation</p>
                </div>
                {!data && !loading && (
                    <button
                        onClick={runPrediction}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/50 active:scale-95"
                    >
                        PREDICT {symbol} PRICE WITH AI
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-300 animate-pulse">Training Neural Model & Simulating 100 Realities...</p>
                    <p className="text-xs text-slate-500 mt-2">This usually takes 45-60 seconds</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {data && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Cache indicator badge */}
                    {data.cached && (
                        <div className="inline-block px-3 py-1 bg-emerald-900/30 border border-emerald-800 rounded-full text-xs text-emerald-400 font-semibold mb-2">
                            ✓ Active 24-Hour Cache
                        </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Expected Target" value={`$${data.expected_target}`} sub="30-Day Mean" />
                        <MetricCard label="NLP Sentiment" value={data.sentiment_score} sub="FinBERT Score" color="text-blue-400" />
                        <MetricCard label="Max Upside" value={`$${data.max_upside_95}`} sub="95th Percentile" color="text-green-400" />
                        <MetricCard label="Value at Risk" value={`${data.max_portfolio_risk_pct}%`} sub="Potential Drawdown" color="text-red-400" />
                    </div>

                    {/* The AI Graph */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <img
                            src={`data:image/png;base64,${data.graph_base64}`}
                            alt="AI Simulation Graph"
                            className="relative w-full rounded-lg border border-slate-700 shadow-inner bg-black"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value, sub, color = "text-white" }: any) {
    return (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
            <p className={`text-xl font-mono font-bold my-1 ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-500">{sub}</p>
        </div>
    );
}