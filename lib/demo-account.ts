// The shared demo account every visitor is signed in to (app/api/demo/route.ts); there is no sign-in page.
// The account and its sample data are created the first time someone opens the app.
export const DEMO_ACCOUNT = {
    name: 'Demo Investor',
    email: 'demo@stocksapp.dev',
    password: 'Demo#2026',
};

export const DEMO_WATCHLIST = [
    { symbol: 'AAPL', company: 'Apple Inc.' },
    { symbol: 'NVDA', company: 'NVIDIA Corporation' },
    { symbol: 'MSFT', company: 'Microsoft Corporation' },
    { symbol: 'TSLA', company: 'Tesla, Inc.' },
    { symbol: 'AMZN', company: 'Amazon.com, Inc.' },
    { symbol: 'GOOGL', company: 'Alphabet Inc.' },
];

// Fictional holdings so the portfolio page has something to show
export const DEMO_PORTFOLIO = [
    { ticker: 'AAPL', shares: 10, buyPrice: 190 },
    { ticker: 'NVDA', shares: 15, buyPrice: 120 },
    { ticker: 'MSFT', shares: 5, buyPrice: 410 },
    { ticker: 'TSLA', shares: 8, buyPrice: 240 },
];
