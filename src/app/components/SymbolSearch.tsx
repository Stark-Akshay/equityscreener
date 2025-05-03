// components/SymbolSearch.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { SearchResponse, StockSymbolMatch, ActiveFilters } from '../types/types';
import { Search, X, Filter, AlertTriangle, Loader2 } from 'lucide-react';
import FilterPanel from './FilterPanel';

export default function SymbolSearch() {
    const [keyword, setKeyword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<StockSymbolMatch[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        types: [],
        regions: [],
        currencies: [],
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filterOptions, setFilterOptions] = useState<{
        types: string[];
        regions: string[];
        currencies: string[];
    }>({
        types: [],
        regions: [],
        currencies: [],
    });

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const debouncedKeyword = useDebounce<string>(keyword, 500);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
                setShowFilters(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch search results when debounced keyword changes
    useEffect(() => {
        async function fetchSearchResults() {
            if (!debouncedKeyword || debouncedKeyword.length < 2) {
                setSearchResults([]);
                setFilterOptions({ types: [], regions: [], currencies: [] });
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/symbol-search?keyword=${encodeURIComponent(debouncedKeyword)}`);
                const data: SearchResponse = await response.json();

                if (response.status === 429) {
                    setError(data.error || 'Too many requests. Please try again later.');
                    setSearchResults([]);
                    setFilterOptions({ types: [], regions: [], currencies: [] });
                } else if (!response.ok) {
                    setError(data.error || 'Failed to fetch search results.');
                    setSearchResults([]);
                    setFilterOptions({ types: [], regions: [], currencies: [] });
                } else {
                    setSearchResults(data.testResult || []);
                    setFilterOptions(data.testFilterOptions || { types: [], regions: [], currencies: [] });
                    setShowResults(true);
                }
            } catch (err) {
                console.log(err)
                setError('An error occurred while fetching search results.');
                setSearchResults([]);
                setFilterOptions({ types: [], regions: [], currencies: [] });
            } finally {
                setIsLoading(false);
            }
        }

        fetchSearchResults();
    }, [debouncedKeyword]);

    // Filter search results based on active filters
    const filteredResults = searchResults.filter((result) => {
        // If no filters of a category are selected, consider it as "match all"
        const matchesType = activeFilters.types.length === 0 ||
            activeFilters.types.includes(result["3. type"]);
        const matchesRegion = activeFilters.regions.length === 0 ||
            activeFilters.regions.includes(result["4. region"]);
        const matchesCurrency = activeFilters.currencies.length === 0 ||
            activeFilters.currencies.includes(result["8. currency"]);

        return matchesType && matchesRegion && matchesCurrency;
    });

    function clearSearch() {
        setKeyword('');
        setSearchResults([]);
        setShowResults(false);
        setFilterOptions({ types: [], regions: [], currencies: [] });
        setActiveFilters({ types: [], regions: [], currencies: [] });
    }

    function handleFilterToggle() {
        setShowFilters(!showFilters);
    }

    function resetFilters() {
        setActiveFilters({ types: [], regions: [], currencies: [] });
    }

    // Count active filters
    const activeFilterCount = activeFilters.types.length +
        activeFilters.regions.length +
        activeFilters.currencies.length;

    return (
        <div className="w-full max-w-2xl mx-auto p-4" ref={searchContainerRef}>
            <div className="relative">
                <div className="flex items-center border-2 rounded-lg overflow-hidden shadow-sm focus-within:shadow-md focus-within:border-blue-500 transition-all bg-white">
                    <div className="pl-3 text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search for stocks, ETFs, or indices..."
                        className="w-full py-3 px-2 outline-none text-gray-800"
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowResults(true);
                            }
                        }}
                    />
                    {keyword && (
                        <button
                            onClick={clearSearch}
                            className="px-3 text-gray-400 hover:text-gray-600"
                            aria-label="Clear search"
                        >
                            <X size={20} />
                        </button>
                    )}
                    {searchResults.length > 0 && (
                        <div className="px-3 relative">
                            <button
                                onClick={handleFilterToggle}
                                className={`relative ${showFilters ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="Filter results"
                            >
                                <Filter size={20} />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {isLoading && (
                    <div className="absolute right-16 top-3.5 text-blue-500">
                        <Loader2 size={20} className="animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md flex items-start">
                        <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {showFilters && searchResults.length > 0 && (
                    <FilterPanel
                        options={filterOptions}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        resetFilters={resetFilters}
                    />
                )}

                {showResults && filteredResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200">
                        <ul className="py-1">
                            {filteredResults.map((result, index) => (
                                <li
                                    key={`${result["1. symbol"]}-${index}`}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0"
                                >
                                    <div>
                                        <div className="font-medium text-gray-800">{result["1. symbol"]}</div>
                                        <div className="text-sm text-gray-600">{result["2. name"]}</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="bg-blue-100 text-blue-700 font-medium text-xs px-3 py-1 rounded-full shadow-sm mb-1.5">
                                            {result["3. type"]}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <span className="font-medium">{result["8. currency"]}</span>
                                            <span className="mx-1.5">•</span>
                                            <span>{result["4. region"]}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showResults && keyword && filteredResults.length === 0 && searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-4 border border-gray-200">
                        <p className="text-gray-500 text-center">No results match the selected filters.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-2 w-full text-center text-sm text-blue-500 hover:text-blue-700"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {showResults && keyword && searchResults.length === 0 && !error && !isLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-4 border border-gray-200">
                        <p className="text-gray-500 text-center">{`No results found for "${keyword}"`}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}