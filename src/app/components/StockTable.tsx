// app/components/StockTable.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StockSymbolMatch } from '../types/types';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Check, BarChart2 } from 'lucide-react';
import { generateBloombergTicker, getCountryFromRegion } from '@/app/constants/mockdata';

type StockTableProps = {
    data: StockSymbolMatch[];
    pageSize?: number;
    onSelectionChange?: (selectedItems: StockSymbolMatch[]) => void;
    onViewDashboard?: () => void;
};

type SortDirection = 'asc' | 'desc' | null;
type SortField =
    | '1. symbol'
    | '2. name'
    | 'bloombergTicker'
    | '3. type'
    | '4. region'
    | 'country'
    | '8. currency'
    | '9. matchScore';

export default function StockTable({ data, pageSize = 5, onSelectionChange, onViewDashboard }: StockTableProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const selectAllRef = useRef<HTMLInputElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    // Update the indeterminate state when the component renders
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = isSomePageSelected();
        }
    }, [selectedItems]);

    // Handle keyboard navigation in the table
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!tableRef.current || !document.activeElement) return;

            // Check if focus is within the table
            if (!tableRef.current.contains(document.activeElement)) return;

            switch (e.key) {
                case 'ArrowRight':
                    if (currentPage < totalPages) {
                        goToPage(currentPage + 1);
                        e.preventDefault();
                    }
                    break;
                case 'ArrowLeft':
                    if (currentPage > 1) {
                        goToPage(currentPage - 1);
                        e.preventDefault();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentPage]);

    // Check if adding this item would exceed the limit
    const isAtSelectionLimit = () => selectedItems.size >= 5;

    // Calculate total pages
    const totalPages = Math.ceil(data.length / pageSize);

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        if (!sortField || !sortDirection) return 0;

        let aValue: string | number = '';
        let bValue: string | number = '';

        // Special handling for derived fields
        if (sortField === 'bloombergTicker') {
            aValue = generateBloombergTicker(a['1. symbol'], a['4. region']);
            bValue = generateBloombergTicker(b['1. symbol'], b['4. region']);
        } else if (sortField === 'country') {
            aValue = getCountryFromRegion(a['4. region']);
            bValue = getCountryFromRegion(b['4. region']);
        } else if (sortField === '9. matchScore') {
            // Convert match score to number for proper sorting
            aValue = parseFloat(a[sortField]);
            bValue = parseFloat(b[sortField]);
        } else {
            aValue = a[sortField];
            bValue = b[sortField];
        }

        // Return comparison based on direction
        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Get current page data
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Handle sort click
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction or reset
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortField(null);
                setSortDirection(null);
            }
        } else {
            // Set new field and direction
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle pagination
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Get sort indicator
    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc' ?
            <ArrowUp size={16} className="ml-1" aria-hidden="true" /> :
            <ArrowDown size={16} className="ml-1" aria-hidden="true" />;
    };

    // Handle individual item selection
    const handleItemSelect = (e: React.MouseEvent, symbol: string) => {
        e.stopPropagation(); // Prevent row click when checkbox is clicked

        const newSelected = new Set(selectedItems);
        if (newSelected.has(symbol)) {
            newSelected.delete(symbol);
        } else {
            // Check if adding would exceed limit
            if (newSelected.size >= 5) {
                return; // Don't add more if limit is reached
            }
            newSelected.add(symbol);
        }
        setSelectedItems(newSelected);

        // Get selected items data
        const selectedData = data.filter(item => newSelected.has(item["1. symbol"]));
        onSelectionChange?.(selectedData);
    };

    // Handle select all
    const handleSelectAll = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click

        if (selectedItems.size === paginatedData.length &&
            paginatedData.every(item => selectedItems.has(item["1. symbol"]))) {
            // All current page items are selected, deselect all
            const newSelected = new Set(selectedItems);
            paginatedData.forEach(item => newSelected.delete(item["1. symbol"]));
            setSelectedItems(newSelected);
            const selectedData = data.filter(item => newSelected.has(item["1. symbol"]));
            onSelectionChange?.(selectedData);
        } else {
            // Not all current page items are selected, select up to the limit
            const newSelected = new Set(selectedItems);
            paginatedData.forEach(item => {
                if (!newSelected.has(item["1. symbol"]) && newSelected.size < 5) {
                    newSelected.add(item["1. symbol"]);
                }
            });
            setSelectedItems(newSelected);
            const selectedData = data.filter(item => newSelected.has(item["1. symbol"]));
            onSelectionChange?.(selectedData);
        }
    };

    // Handle row click to navigate to stock detail page
    const handleRowClick = (symbol: string) => {
        router.push(`/stock/${symbol}`);
    };

    // Handle keyboard row activation
    const handleRowKeyDown = (e: React.KeyboardEvent, symbol: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowClick(symbol);
        }
    };

    // Check if item is selected
    const isItemSelected = (symbol: string) => selectedItems.has(symbol);

    // Check if all current page items are selected
    const isAllPageSelected = () => {
        return paginatedData.length > 0 &&
            paginatedData.every(item => selectedItems.has(item["1. symbol"]));
    };

    // Check if some current page items are selected
    const isSomePageSelected = () => {
        return paginatedData.some(item => selectedItems.has(item["1. symbol"])) &&
            !isAllPageSelected();
    };

    // Get sort description for screen readers
    const getSortDescription = (field: SortField) => {
        if (sortField !== field) return 'Not sorted';
        return `Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md w-full">
            {/* Selection toolbar */}
            {selectedItems.size > 0 && (
                <div
                    className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div className="flex items-center gap-6">
                        <div className="text-sm font-medium text-blue-700">
                            {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
                            {selectedItems.size >= 5 && (
                                <span className="ml-2 text-blue-600">(Maximum reached)</span>
                            )}
                        </div>
                        <button
                            onClick={onViewDashboard}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="View selected items in dashboard"
                        >
                            <BarChart2 size={16} className="mr-2" aria-hidden="true" />
                            View in Dashboard
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedItems(new Set());
                            onSelectionChange?.([]);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                        aria-label="Clear all selections"
                    >
                        Clear selection
                    </button>
                </div>
            )}

            {/* Horizontal scroll wrapper */}
            <div className="overflow-x-auto" role="region" aria-label="Scrollable stock data table">
                <div className="min-w-[1000px]">
                    <table
                        className="w-full divide-y divide-gray-200"
                        ref={tableRef}
                        aria-label="Stock symbols and details table"
                    >
                        <caption className="sr-only">
                            Table of stock symbols with details and selection options.
                            {selectedItems.size > 0 && `${selectedItems.size} items selected.`}
                            {sortField && `Table is sorted by ${sortField} in ${sortDirection} order.`}
                        </caption>
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="relative px-6 py-3 text-left"
                                >
                                    <span className="sr-only">Select all rows</span>
                                    <div className="flex items-center">
                                        <label className="custom-checkbox">
                                            <input
                                                ref={selectAllRef}
                                                type="checkbox"
                                                className="hidden"
                                                checked={isAllPageSelected()}
                                                onChange={() => { }}
                                                onClick={(e) => handleSelectAll(e)}
                                                aria-label={`${isAllPageSelected() ? 'Deselect' : 'Select'} all items on this page`}
                                            />
                                            <span
                                                className={`w-4 h-4 border-2 rounded flex items-center justify-center ${isAllPageSelected() ? 'bg-blue-600 border-blue-600' :
                                                    isSomePageSelected() ? 'bg-blue-600 border-blue-600' :
                                                        'border-gray-300'
                                                    }`}
                                                aria-hidden="true"
                                            >
                                                {isAllPageSelected() && <Check size={12} className="text-white" />}
                                                {isSomePageSelected() && !isAllPageSelected() && (
                                                    <div className="w-2 h-0.5 bg-white"></div>
                                                )}
                                            </span>
                                        </label>
                                    </div>
                                </th>
                                {[
                                    { id: '1. symbol', label: 'Symbol' },
                                    { id: '2. name', label: 'Company Name' },
                                    { id: 'bloombergTicker', label: 'Bloomberg Ticker' },
                                    { id: '3. type', label: 'Asset Class' },
                                    { id: '4. region', label: 'Region' },
                                    { id: 'country', label: 'Country' },
                                    { id: '8. currency', label: 'Currency' },
                                    { id: '9. matchScore', label: 'Match Score' }
                                ].map((column) => (
                                    <th
                                        key={column.id}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                        onClick={() => handleSort(column.id as SortField)}
                                        aria-sort={sortField === column.id ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        tabIndex={0}
                                        role="columnheader"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleSort(column.id as SortField);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center">
                                            {column.label}
                                            {getSortIndicator(column.id as SortField)}
                                            <span className="sr-only">{getSortDescription(column.id as SortField)}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map((stock, index) => (
                                <tr
                                    key={`${stock["1. symbol"]}-${index}`}
                                    className={`hover:bg-gray-50 ${isItemSelected(stock["1. symbol"]) ? 'bg-blue-50' : ''} cursor-pointer`}
                                    onClick={() => handleRowClick(stock["1. symbol"])}
                                    onKeyDown={(e) => handleRowKeyDown(e, stock["1. symbol"])}
                                    tabIndex={0}
                                    role="row"
                                    aria-selected={isItemSelected(stock["1. symbol"])}
                                >
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                        onClick={(e) => e.stopPropagation()}
                                        role="cell"
                                    >
                                        <label
                                            className={`custom-checkbox ${isAtSelectionLimit() && !isItemSelected(stock["1. symbol"]) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            aria-label={`${isItemSelected(stock["1. symbol"]) ? 'Deselect' : 'Select'} ${stock["1. symbol"]}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isItemSelected(stock["1. symbol"])}
                                                onChange={() => { }}
                                                onClick={(e) => handleItemSelect(e, stock["1. symbol"])}
                                                disabled={isAtSelectionLimit() && !isItemSelected(stock["1. symbol"])}
                                                aria-label={`${isItemSelected(stock["1. symbol"]) ? 'Deselect' : 'Select'} ${stock["2. name"]}`}
                                            />
                                            <span
                                                className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${isItemSelected(stock["1. symbol"]) ? 'bg-blue-600 border-blue-600' :
                                                    isAtSelectionLimit() && !isItemSelected(stock["1. symbol"]) ? 'border-gray-200' :
                                                        'border-gray-300'
                                                    }`}
                                                aria-hidden="true"
                                            >
                                                {isItemSelected(stock["1. symbol"]) && <Check size={12} className="text-white" />}
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" role="cell">
                                        {stock["1. symbol"]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {stock["2. name"]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {generateBloombergTicker(stock["1. symbol"], stock["4. region"])}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {stock["3. type"]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {stock["4. region"]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {getCountryFromRegion(stock["4. region"])}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {stock["8. currency"]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800" role="cell">
                                        {parseFloat(stock["9. matchScore"]).toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" role="cell">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-700" aria-live="polite">
                                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, data.length)}
                                </span>{' '}
                                of <span className="font-medium">{data.length}</span> results
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-20"
                                    aria-label="Previous page"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-20 ${page === currentPage
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        aria-label={`Page ${page}`}
                                        aria-current={page === currentPage ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-20"
                                    aria-label="Next page"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}