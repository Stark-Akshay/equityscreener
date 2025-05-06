// components/StockPriceChart.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { getStockHistoricalUrl } from '@/app/utils/apiIUtils';

type ChartDataPoint = {
    date: string;
    value: number;
};

type StockChartProps = {
    symbol: string;
};

type TimeframeOption = {
    label: string;
    value: string;
};

const timeframeOptions: TimeframeOption[] = [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '2Y', value: '2y' },
    { label: '5Y', value: '5y' },
    { label: 'Max', value: 'max' },
];

export default function StockPriceChart({ symbol }: StockChartProps) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [timeframe, setTimeframe] = useState<string>('1y');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(getStockHistoricalUrl(symbol, timeframe));

                if (!response.ok) {
                    throw new Error('Failed to fetch historical data');
                }

                const data = await response.json();
                setChartData(data.data || []);
            } catch (err) {
                console.error('Error loading chart data:', err);
                setError('Failed to load price history data');
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [symbol, timeframe]);

    // Format dates for display on chart
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        // Different formats based on timeframe
        if (timeframe === '1m' || timeframe === '3m') {
            // For shorter timeframes, show day and month
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(date);
        } else if (timeframe === '6m' || timeframe === '1y' || timeframe === '2y') {
            // For medium timeframes, show month only
            return new Intl.DateTimeFormat('en-US', {
                month: 'short'
            }).format(date);
        } else {
            // For longer timeframes, show month and year
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short'
            }).format(date);
        }
    };

    // Format the tooltip values
    const formatTooltip = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    // Only show a subset of ticks on the X-axis for readability
    const getTicksToShow = () => {
        if (chartData.length <= 10) return chartData.length;

        if (timeframe === '1m') return 5;
        if (timeframe === '3m') return 6;
        if (timeframe === '6m') return 6;
        if (timeframe === '1y') return 6;
        if (timeframe === '2y') return 8;
        if (timeframe === '5y') return 10;
        if (timeframe === 'max') return 10;

        return 10; // Default
    };

    // Generate X-axis ticks at regular intervals
    const generateXAxisTicks = () => {
        if (chartData.length === 0) return [];

        const tickCount = getTicksToShow();
        const interval = Math.floor(chartData.length / (tickCount - 1));
        const ticks = [];

        for (let i = 0; i < chartData.length; i += interval) {
            ticks.push(i);
        }

        // Ensure the last point is included
        if (ticks[ticks.length - 1] !== chartData.length - 1) {
            ticks.push(chartData.length - 1);
        }

        return ticks;
    };

    // Calculate min and max values for Y-axis domain with buffer
    const calculateYAxisDomain = () => {
        if (chartData.length === 0) return [0, 100];

        const values = chartData.map(item => item.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        // Add 5% buffer at top and bottom for better visualization
        const buffer = (max - min) * 0.05;
        return [min - buffer, max + buffer];
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 md:mb-0">Price History</h2>

                <div className="flex flex-wrap gap-2">
                    {timeframeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTimeframe(option.value)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors 
                ${timeframe === option.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                </div>
            ) : error ? (
                <div className="h-80 flex items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : chartData.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500">No price history data available</p>
                </div>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                ticks={generateXAxisTicks()}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                domain={calculateYAxisDomain()}
                                tickFormatter={(value) => `${value.toFixed(2)}`}
                                tick={{ fontSize: 12 }}
                                width={65}
                            />
                            <Tooltip
                                formatter={formatTooltip}
                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                name="Closing Price"
                                stroke="#3182CE"
                                dot={false}
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}