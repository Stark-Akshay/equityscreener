// app/components/FilterPanel.tsx
import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { ActiveFilters } from '../types/types';

type FilterPanelProps = {
    options: {
        types: string[];
        regions: string[];
        currencies: string[];
    };
    activeFilters: ActiveFilters;
    setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
    resetFilters: () => void;
};

export default function FilterPanel({
    options,
    activeFilters,
    setActiveFilters,
    resetFilters,
}: FilterPanelProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (dropdown: string) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };

    const handleFilterSelect = (category: keyof ActiveFilters, value: string) => {
        setActiveFilters((prev) => {
            const currentFilters = [...prev[category]];
            const index = currentFilters.indexOf(value);

            if (index === -1) {
                // Add the value if it doesn't exist
                return {
                    ...prev,
                    [category]: [...currentFilters, value]
                };
            } else {
                // Remove the value if it exists
                currentFilters.splice(index, 1);
                return {
                    ...prev,
                    [category]: currentFilters
                };
            }
        });
    };

    const handleClearFilter = (category: keyof ActiveFilters, value?: string) => {
        if (value) {
            // Remove specific filter value
            setActiveFilters((prev) => ({
                ...prev,
                [category]: prev[category].filter(item => item !== value)
            }));
        } else {
            // Clear all filters for this category
            setActiveFilters((prev) => ({
                ...prev,
                [category]: []
            }));
        }
    };

    const getFilterCount = (category: keyof ActiveFilters) => {
        return activeFilters[category].length;
    };

    const getFilterLabel = (category: keyof ActiveFilters) => {
        const count = getFilterCount(category);
        if (count === 0) return 'Any';
        if (count === 1) return activeFilters[category][0];
        return `${count} selected`;
    };

    return (
        <div className="mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Filter Results</h3>
                <button
                    onClick={resetFilters}
                    className="text-xs text-blue-500 hover:text-blue-700"
                >
                    Reset All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Type Filter */}
                <div className="relative">
                    <div
                        className="w-full flex items-center justify-between bg-gray-50 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleDropdown('types')}
                    >
                        <span className="flex items-center">
                            <span className="text-gray-700 mr-1">Type:</span>
                            <span className="truncate max-w-[100px] text-gray-900 font-medium">
                                {getFilterLabel('types')}
                            </span>
                        </span>
                        <div className="flex items-center">
                            {getFilterCount('types') > 0 && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearFilter('types');
                                    }}
                                    className="mr-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <X size={14} />
                                </span>
                            )}
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform ${openDropdown === 'types' ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </div>

                    {openDropdown === 'types' && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                                {options.types.map((type) => (
                                    <div
                                        key={type}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleFilterSelect('types', type)}
                                    >
                                        <span className="text-gray-800 font-medium">{type}</span>
                                        {activeFilters.types.includes(type) && (
                                            <Check size={16} className="text-blue-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Region Filter */}
                <div className="relative">
                    <div
                        className="w-full flex items-center justify-between bg-gray-50 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleDropdown('regions')}
                    >
                        <span className="flex items-center">
                            <span className="text-gray-700 mr-1">Region:</span>
                            <span className="truncate max-w-[100px] text-gray-900 font-medium">
                                {getFilterLabel('regions')}
                            </span>
                        </span>
                        <div className="flex items-center">
                            {getFilterCount('regions') > 0 && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearFilter('regions');
                                    }}
                                    className="mr-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <X size={14} />
                                </span>
                            )}
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform ${openDropdown === 'regions' ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </div>

                    {openDropdown === 'regions' && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                                {options.regions.map((region) => (
                                    <div
                                        key={region}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleFilterSelect('regions', region)}
                                    >
                                        <span className="text-gray-800 font-medium">{region}</span>
                                        {activeFilters.regions.includes(region) && (
                                            <Check size={16} className="text-blue-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Currency Filter */}
                <div className="relative">
                    <div
                        className="w-full flex items-center justify-between bg-gray-50 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleDropdown('currencies')}
                    >
                        <span className="flex items-center">
                            <span className="text-gray-700 mr-1">Currency:</span>
                            <span className="truncate max-w-[100px] text-gray-900 font-medium">
                                {getFilterLabel('currencies')}
                            </span>
                        </span>
                        <div className="flex items-center">
                            {getFilterCount('currencies') > 0 && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearFilter('currencies');
                                    }}
                                    className="mr-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <X size={14} />
                                </span>
                            )}
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform ${openDropdown === 'currencies' ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                    </div>

                    {openDropdown === 'currencies' && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                                {options.currencies.map((currency) => (
                                    <div
                                        key={currency}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleFilterSelect('currencies', currency)}
                                    >
                                        <span className="text-gray-800 font-medium">{currency}</span>
                                        {activeFilters.currencies.includes(currency) && (
                                            <Check size={16} className="text-blue-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filter Chips */}
            <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                    {activeFilters.types.length === 0 &&
                        activeFilters.regions.length === 0 &&
                        activeFilters.currencies.length === 0 ? (
                        <div className="text-xs text-gray-500">No active filters</div>
                    ) : (
                        <>
                            {activeFilters.types.map((type) => (
                                <div
                                    key={`type-${type}`}
                                    className="bg-blue-100 text-blue-700 font-medium text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                                >
                                    <span className="text-blue-500 mr-1.5">Type:</span>
                                    {type}
                                    <span
                                        onClick={() => handleClearFilter('types', type)}
                                        className="ml-1.5 text-blue-700 hover:text-blue-900 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </span>
                                </div>
                            ))}

                            {activeFilters.regions.map((region) => (
                                <div
                                    key={`region-${region}`}
                                    className="bg-blue-100 text-blue-700 font-medium text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                                >
                                    <span className="text-blue-500 mr-1.5">Region:</span>
                                    {region}
                                    <span
                                        onClick={() => handleClearFilter('regions', region)}
                                        className="ml-1.5 text-blue-700 hover:text-blue-900 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </span>
                                </div>
                            ))}

                            {activeFilters.currencies.map((currency) => (
                                <div
                                    key={`currency-${currency}`}
                                    className="bg-blue-100 text-blue-700 font-medium text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                                >
                                    <span className="text-blue-500 mr-1.5">Currency:</span>
                                    {currency}
                                    <span
                                        onClick={() => handleClearFilter('currencies', currency)}
                                        className="ml-1.5 text-blue-700 hover:text-blue-900 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}