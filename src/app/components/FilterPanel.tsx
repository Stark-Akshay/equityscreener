// app/components/FilterPanel.tsx
import { useState, useRef, useEffect } from 'react';
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
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
        types: null,
        regions: null,
        currencies: null
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (openDropdown &&
                dropdownRefs.current[openDropdown] &&
                !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

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

    const filterCategories = [
        { id: 'types', label: 'Type', options: options.types },
        { id: 'regions', label: 'Region', options: options.regions },
        { id: 'currencies', label: 'Currency', options: options.currencies }
    ];

    return (
        <div className="mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4" role="region" aria-label="Filter options">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700" id="filter-heading">Filter Results</h3>
                <button
                    onClick={resetFilters}
                    className="text-xs text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Reset all filters"
                >
                    Reset All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-labelledby="filter-heading">
                {filterCategories.map(category => (
                    <div
                        className="relative"
                        key={category.id}
                        ref={(el) => { dropdownRefs.current[category.id] = el; }}
                    >
                        <div
                            className="w-full flex items-center justify-between bg-gray-50 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                            onClick={() => toggleDropdown(category.id)}
                            tabIndex={0}
                            role="button"
                            aria-expanded={openDropdown === category.id}
                            aria-controls={`${category.id}-dropdown`}
                            id={`${category.id}-button`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleDropdown(category.id);
                                }
                            }}
                        >
                            <span className="flex items-center">
                                <span className="text-gray-700 mr-1">{category.label}:</span>
                                <span className="truncate max-w-[100px] text-gray-900 font-medium">
                                    {getFilterLabel(category.id as keyof ActiveFilters)}
                                </span>
                            </span>
                            <div className="flex items-center">
                                {getFilterCount(category.id as keyof ActiveFilters) > 0 && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClearFilter(category.id as keyof ActiveFilters);
                                        }}
                                        className="mr-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Clear all ${category.label} filters`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleClearFilter(category.id as keyof ActiveFilters);
                                            }
                                        }}
                                    >
                                        <X size={14} aria-hidden="true" />
                                    </span>
                                )}
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform ${openDropdown === category.id ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        {openDropdown === category.id && (
                            <div
                                className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto"
                                id={`${category.id}-dropdown`}
                                role="listbox"
                                aria-labelledby={`${category.id}-button`}
                            >
                                <div className="py-1">
                                    {category.options.map((option) => (
                                        <div
                                            key={option}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                            onClick={() => handleFilterSelect(category.id as keyof ActiveFilters, option)}
                                            role="option"
                                            aria-selected={activeFilters[category.id as keyof ActiveFilters].includes(option)}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleFilterSelect(category.id as keyof ActiveFilters, option);
                                                }
                                            }}
                                        >
                                            <span className="text-gray-800 font-medium">{option}</span>
                                            {activeFilters[category.id as keyof ActiveFilters].includes(option) && (
                                                <Check size={16} className="text-blue-500" aria-hidden="true" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Active Filter Chips */}
            <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2" id="active-filters-heading">Active Filters:</h4>
                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby="active-filters-heading"
                >
                    {activeFilters.types.length === 0 &&
                        activeFilters.regions.length === 0 &&
                        activeFilters.currencies.length === 0 ? (
                        <div className="text-xs text-gray-500" aria-live="polite">No active filters</div>
                    ) : (
                        <>
                            {Object.entries(activeFilters).map(([category, values]) => (
                                values.map((value) => (
                                    <div
                                        key={`${category}-${value}`}
                                        className="bg-blue-100 text-blue-700 font-medium text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm"
                                    >
                                        <span className="text-blue-500 mr-1.5">{category.charAt(0).toUpperCase() + category.slice(1, -1)}:</span>
                                        {value}
                                        <span
                                            onClick={() => handleClearFilter(category as keyof ActiveFilters, value)}
                                            className="ml-1.5 text-blue-700 hover:text-blue-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full p-0.5"
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Remove ${category.slice(0, -1)} filter: ${value}`}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleClearFilter(category as keyof ActiveFilters, value);
                                                }
                                            }}
                                        >
                                            <X size={14} aria-hidden="true" />
                                        </span>
                                    </div>
                                ))
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}