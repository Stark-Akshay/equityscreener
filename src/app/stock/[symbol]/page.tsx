// app/stock/[symbol]/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, ExternalLink, TrendingUp, Calendar, Building, DollarSign, Percent, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import StockPriceChart from '@/app/components/StockPriceChart';
import { getStockOverviewUrl } from '@/app/utils/apiIUtils';

type StockOverview = {
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    Address: string;
    OfficialSite: string;
    MarketCapitalization?: string;
    PERatio?: string;
    DividendYield?: string;
    EPS?: string;
    Beta?: string;
    '52WeekHigh'?: string;
    '52WeekLow'?: string;
};

type NewsItem = {
    title: string;
    url: string;
    timePublished: string;
    summary: string;
    source: string;
    bannerImage: string;
    overallSentiment: string;
};

type StockData = {
    overview: StockOverview;
    news: NewsItem[];
    hasMoreNews: boolean;
    totalNewsCount: number;
};

export default function StockDetailPage() {
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMoreNews, setLoadingMoreNews] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const newsContainerRef = useRef<HTMLDivElement>(null);
    const params = useParams<{ symbol: string }>();
    const { symbol } = params;

    // Function to fetch the initial stock data
    const fetchStockData = async () => {
        try {
            setLoading(true);
            const response = await fetch(getStockOverviewUrl(symbol));
            console.log()

            if (!response.ok) {
                throw new Error('Failed to fetch stock data');
            }

            const data = await response.json();
            setStockData(data);
        } catch (err) {
            setError('Error loading stock data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch more news items
    const fetchMoreNews = async () => {
        if (!stockData || !stockData.hasMoreNews || loadingMoreNews) return;

        try {
            setLoadingMoreNews(true);
            const nextPage = currentPage + 1;
            const url = `${getStockOverviewUrl(symbol)}&page=${nextPage}&limit=5&newsOnly=true`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch more news');
            }

            const data = await response.json();

            // Merge news data with existing data
            setStockData(prevData => {
                if (!prevData) return data;
                return {
                    ...prevData,
                    news: [...prevData.news, ...data.news],
                    hasMoreNews: data.hasMoreNews
                };
            });

            setCurrentPage(nextPage);
        } catch (err) {
            console.error('Error loading more news:', err);
        } finally {
            setLoadingMoreNews(false);
        }
    };

    // Intersection Observer callback for infinite scrolling
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && stockData?.hasMoreNews) {
            fetchMoreNews();
        }
    }, [stockData?.hasMoreNews]);

    // Initialize stock data fetch
    useEffect(() => {
        fetchStockData();
    }, [symbol]);

    // Set up IntersectionObserver for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        const loadingElement = document.getElementById('news-loader');
        if (loadingElement) {
            observer.observe(loadingElement);
        }

        return () => {
            if (loadingElement) {
                observer.unobserve(loadingElement);
            }
        };
    }, [handleObserver]);

    // Format market cap
    const formatMarketCap = (marketCap?: string) => {
        if (!marketCap) return 'N/A';

        const num = parseInt(marketCap);
        if (isNaN(num)) return 'N/A';

        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)} T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} M`;
        return `$${num.toLocaleString()}`;
    };

    // Format date from news item
    const formatNewsDate = (dateStr: string) => {
        // Format: 20250505T154420
        if (!dateStr || dateStr.length < 8) return '';

        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        return `${month}/${day}/${year}`;
    };

    // Get sentiment color
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'Bullish':
                return 'bg-green-500';
            case 'Somewhat-Bullish':
                return 'bg-green-300';
            case 'Neutral':
                return 'bg-gray-300';
            case 'Somewhat-Bearish':
                return 'bg-red-300';
            case 'Bearish':
                return 'bg-red-500';
            default:
                return 'bg-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading stock data...</p>
                </div>
            </div>
        );
    }

    if (error || !stockData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Stock Search
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h1 className="text-red-500 text-xl font-semibold mb-2">Error</h1>
                        <p className="text-gray-600">{error || 'Failed to load stock data'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { overview, news } = stockData;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Stock Search
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content - 2/3 width on desktop */}
                    <div className="lg:col-span-2">
                        {/* Stock header */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{overview.Name} ({overview.Symbol})</h1>
                                    <p className="text-gray-600">{overview.Exchange} • {overview.AssetType}</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <a
                                        href={overview.OfficialSite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Visit Official Website
                                        <ExternalLink size={14} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Add Stock Price Chart */}
                        <StockPriceChart symbol={overview.Symbol} />

                        {/* Stock details */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About {overview.Name}</h2>
                            <p className="text-gray-700 mb-6">{overview.Description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Company Information</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <Building size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Sector</span>
                                                <span className="text-gray-900">{overview.Sector || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <Building size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Industry</span>
                                                <span className="text-gray-900">{overview.Industry || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <Globe size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Country</span>
                                                <span className="text-gray-900">{overview.Country || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <Building size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Address</span>
                                                <span className="text-gray-900">{overview.Address || 'N/A'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Metrics</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <DollarSign size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Market Cap</span>
                                                <span className="text-gray-900">{formatMarketCap(overview.MarketCapitalization)}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <TrendingUp size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">P/E Ratio</span>
                                                <span className="text-gray-900">{overview.PERatio || 'N/A'}</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <Percent size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">Dividend Yield</span>
                                                <span className="text-gray-900">
                                                    {overview.DividendYield
                                                        ? `${(parseFloat(overview.DividendYield) * 100).toFixed(2)}%`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <DollarSign size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="block text-sm font-medium text-gray-700">EPS</span>
                                                <span className="text-gray-900">{overview.EPS ? `$${overview.EPS}` : 'N/A'}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Price Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="block text-sm font-medium text-gray-700">52 Week High</span>
                                        <span className="text-xl font-semibold text-green-600">
                                            {overview['52WeekHigh'] ? `$${overview['52WeekHigh']}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="block text-sm font-medium text-gray-700">52 Week Low</span>
                                        <span className="text-xl font-semibold text-red-600">
                                            {overview['52WeekLow'] ? `$${overview['52WeekLow']}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <span className="block text-sm font-medium text-gray-700">Beta</span>
                                        <span className="text-xl font-semibold text-gray-900">
                                            {overview.Beta || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* News sidebar - 1/3 width on desktop */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest News</h2>

                            {news.length > 0 ? (
                                <div
                                    ref={newsContainerRef}
                                    className="space-y-6 max-h-[800px] overflow-y-auto pr-2"
                                >
                                    {news.map((item, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                            <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                                                {item.bannerImage ? (
                                                    <Image
                                                        src={item.bannerImage}
                                                        alt={item.title}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                                <span className="flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {formatNewsDate(item.timePublished)}
                                                </span>
                                                <span className="flex items-center">
                                                    <span className={`h-2 w-2 rounded-full mr-1 ${getSentimentColor(item.overallSentiment)}`}></span>
                                                    {item.overallSentiment}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                                {item.summary}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Source: {item.source}
                                                </span>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    Read more
                                                    <ExternalLink size={10} className="ml-1" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Loading indicator at the bottom for infinite scroll */}
                                    <div id="news-loader" className="py-4 text-center">
                                        {loadingMoreNews ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mx-auto"></div>
                                        ) : stockData.hasMoreNews ? (
                                            <p className="text-sm text-gray-500">Scroll for more news</p>
                                        ) : news.length > 0 ? (
                                            <p className="text-sm text-gray-500">No more news available</p>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No recent news available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}