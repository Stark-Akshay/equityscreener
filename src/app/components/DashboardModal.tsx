// app/components/DashboardModal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { StockSymbolMatch } from '../types/types';
import { X, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type StockPricePoint = {
    date: string;
    close: number;
};

type StockPriceData = {
    symbol: string;
    prices: StockPricePoint[];
    error?: string;
};

type DashboardModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: StockSymbolMatch[];
};

type ChartDataPoint = {
    date: string;
    [key: string]: number | string | null;
};

interface CachedData {
    data: StockPriceData[];
    timestamp: number;
}

export default function DashboardModal({ isOpen, onClose, selectedItems }: DashboardModalProps) {
    const [priceData, setPriceData] = useState<StockPriceData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryAfter, setRetryAfter] = useState<number | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);

    // Cache to store fetched data
    const cacheRef = useRef<Map<string, CachedData>>(new Map());
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

    // Generate cache key for selected items
    const getCacheKey = useCallback(() => {
        return selectedItems.map(item => item["1. symbol"]).sort().join(',');
    }, [selectedItems]);

    // Check if cache is valid
    const getCachedData = useCallback(() => {
        const cacheKey = getCacheKey();
        const cached = cacheRef.current.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('Using cached data for:', cacheKey);
            return cached.data;
        }
        return null;
    }, [getCacheKey]);

    // Save data to cache
    const saveToCache = useCallback((data: StockPriceData[]) => {
        const cacheKey = getCacheKey();
        cacheRef.current.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }, [getCacheKey]);

    const fetchPriceData = useCallback(async (isRetry = false) => {
        setIsLoading(true);
        setError(null);
        setRetryAfter(null);

        try {
            // First check cache
            const cachedData = getCachedData();
            if (cachedData) {
                setPriceData(cachedData);
                setIsLoading(false);
                return;
            }

            // Extract just the symbol strings from selectedItems
            const symbols = selectedItems.map(item => item["1. symbol"]);

            const response = await fetch('/api/fake-prices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbols }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 429) {
                    // Rate limited
                    const retryAfterHeader = response.headers.get('retry-after');
                    const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 60;
                    setRetryAfter(retrySeconds);
                    setError(`Please wait ${retrySeconds} seconds.`);

                    // Start countdown for retry
                    if (!isRetry) {
                        startRetryCountdown(retrySeconds);
                    }
                } else {
                    // Other errors
                    setError(errorData.error || `Failed to fetch data (${response.status})`);
                }
                return;
            }

            const data: StockPriceData[] = await response.json();

            // Save to cache
            saveToCache(data);
            setPriceData(data);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock prices';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [selectedItems, getCachedData, saveToCache]);

    // Start countdown for retry after rate limiting
    const startRetryCountdown = useCallback((seconds: number) => {
        setIsRetrying(true);
        let remainingSeconds = seconds;

        const countdown = setInterval(() => {
            remainingSeconds -= 1;
            setRetryAfter(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(countdown);
                setIsRetrying(false);
                fetchPriceData(true); // Retry after countdown
            }
        }, 1000);
    }, [fetchPriceData]);

    useEffect(() => {
        if (isOpen && selectedItems.length > 0) {
            fetchPriceData();
        }
    }, [isOpen, selectedItems, fetchPriceData]);

    // Transform price data for recharts
    const chartData: ChartDataPoint[] = (() => {
        if (priceData.length === 0) return [];

        // Find all unique dates across all stocks
        const allDates = new Set<string>();
        priceData.forEach(stock => {
            if (stock.prices) {
                stock.prices.forEach(price => allDates.add(price.date));
            }
        });

        // Sort dates
        const sortedDates = Array.from(allDates).sort();

        // Transform data for recharts
        return sortedDates.map(date => {
            const dataPoint: ChartDataPoint = { date };
            priceData.forEach(stock => {
                if (stock.prices) {
                    const pricePoint = stock.prices.find(p => p.date === date);
                    dataPoint[stock.symbol] = pricePoint ? pricePoint.close : null;
                }
            });
            return dataPoint;
        });
    })();

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ease-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
                backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0)'
            }}
        >
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                {/* Modal */}
                <div
                    className={`relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-7xl
                        ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 sm:translate-y-0 sm:scale-95'}`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
                            Price Comparison Dashboard
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                        >
                            <X size={20} className="sm:hidden" />
                            <X size={24} className="hidden sm:block" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                        {isLoading ? (
                            <div className={`flex flex-col items-center justify-center h-64 sm:h-96 transition-all duration-300 ease-in-out
                                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <Loader2 size={32} className="animate-spin text-blue-500 sm:hidden" />
                                <Loader2 size={40} className="hidden sm:block animate-spin text-blue-500" />
                                <span className="mt-2 text-sm sm:text-base text-gray-600">
                                    {isRetrying ? 'Retrying...' : 'Loading price data...'}
                                </span>
                            </div>
                        ) : error ? (
                            <div className={`p-4 rounded-md transition-all duration-300 ease-in-out ${retryAfter !== null ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-600'
                                } ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                                <h3 className="font-medium">
                                    {retryAfter !== null ? 'Rate Limited' : 'Error'}
                                </h3>
                                <p className="text-sm sm:text-base">{error}</p>
                                {retryAfter !== null ? (
                                    <div className="mt-4 flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-sm sm:text-base">Retrying in {retryAfter} second{retryAfter !== 1 ? 's' : ''}...</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fetchPriceData()}
                                        className="mt-2 text-sm font-medium underline hover:no-underline"
                                    >
                                        Try again
                                    </button>
                                )}
                            </div>
                        ) : chartData.length > 0 ? (
                            <div className={`h-64 sm:h-96 lg:h-[500px] transition-all duration-500 ease-out
                                ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                                style={{
                                    transitionDelay: isOpen ? '200ms' : '0ms'
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 60
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            interval="preserveStartEnd"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: "10px" }}
                                            verticalAlign="top"
                                        />
                                        {priceData.map((stock, index) => (
                                            stock.prices && stock.prices.length > 0 && (
                                                <Line
                                                    key={stock.symbol}
                                                    type="monotone"
                                                    dataKey={stock.symbol}
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth={2}
                                                    name={stock.symbol}
                                                    dot={false}
                                                    activeDot={{ r: 6 }}
                                                />
                                            )
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 h-64 sm:h-96 flex items-center justify-center">
                                <p className="text-sm sm:text-base">No data available</p>
                            </div>
                        )}

                        {/* Selected stocks info and error display */}
                        <div className={`mt-6 sm:mt-8 transition-all duration-500 ease-out
                            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{
                                transitionDelay: isOpen ? '400ms' : '0ms'
                            }}
                        >
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Stocks:</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedItems.map((item, index) => (
                                    <div
                                        key={item["1. symbol"]}
                                        className={`bg-gray-100 text-gray-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full flex items-center transition-all duration-300 ease-out`}
                                        style={{
                                            transitionDelay: isOpen ? `${600 + index * 50}ms` : '0ms',
                                            transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                                            opacity: isOpen ? 1 : 0
                                        }}
                                    >
                                        <span
                                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2"
                                            style={{ backgroundColor: colors[index % colors.length] }}
                                        />
                                        <span className="truncate max-w-[120px] sm:max-w-none">
                                            {item["1. symbol"]} - {item["2. name"]}
                                        </span>
                                        {priceData.find(p => p.symbol === item["1. symbol"])?.error && (
                                            <span className="ml-2 text-red-500">(Error)</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 transition-all duration-500 ease-out
                        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{
                            transitionDelay: isOpen ? '400ms' : '0ms'
                        }}
                    >
                        <button
                            onClick={() => fetchPriceData()}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            disabled={isLoading || isRetrying}
                        >
                            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-sm sm:text-base">Refresh Data</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            <span className="text-sm sm:text-base">Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}