import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selectedValues: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  onSearch,
  placeholder = 'Select items...',
  className = '',
  disabled = false,
  maxHeight = '300px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch]);

  const filteredOptions = onSearch
    ? options
    : options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleToggle = (value: string | number) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'hover:border-gray-400'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-1.5 items-center">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded border border-blue-200"
                >
                  <span className="font-medium">{option.label}</span>
                  {!disabled && (
                    <button
                      onClick={(e) => handleRemove(option.value, e)}
                      className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{ maxHeight }}
        >
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 60px)` }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <span className={`text-sm flex-1 ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                No items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
export function DemoApp() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [searchResults] = useState<MultiSelectOption[]>([
    { value: 1, label: 'React' },
    { value: 2, label: 'TypeScript' },
    { value: 3, label: 'JavaScript' },
    { value: 4, label: 'Tailwind CSS' },
    { value: 5, label: 'Next.js' },
    { value: 6, label: 'Vue.js' },
    { value: 7, label: 'Angular' },
    { value: 8, label: 'Node.js' },
    { value: 9, label: 'Python' },
    { value: 10, label: 'Java' },
  ]);

  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
    // Here you can make an API call or filter data
    // For demo, we're just logging
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Multi-Select Dropdown
          </h1>
          <p className="text-gray-600 mb-6">
            Professional, reusable component with built-in search
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Technologies
              </label>
              <MultiSelectDropdown
                options={searchResults}
                selectedValues={selected}
                onChange={setSelected}
                onSearch={handleSearch}
                placeholder="Choose technologies..."
              />
            </div>

            {selected.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Selected Items ({selected.length}):
                </p>
                <p className="text-sm text-blue-700">
                  {selected.map(val => 
                    searchResults.find(opt => opt.value === val)?.label
                  ).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Usage Example
          </h2>
          <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
{`<MultiSelectDropdown
  options={options}
  selectedValues={selected}
  onChange={setSelected}
  onSearch={handleSearch}
  placeholder="Select items..."
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default MultiSelectDropdown;