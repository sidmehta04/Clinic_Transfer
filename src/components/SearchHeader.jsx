import React from 'react';
import { Search, Database } from 'lucide-react';

const SearchHeader = ({ 
  selectedState, 
  states, 
  searchQuery, 
  onStateChange, 
  onSearchChange,
  showMatchedOnly,
  onMatchedChange
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-border mb-6">
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Select State
        </label>
        <select 
          className="w-full p-2 rounded-md border border-input bg-background"
          value={selectedState}
          onChange={onStateChange}
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Search Clinics
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            className="w-full pl-10 p-2 rounded-md border border-input bg-background"
            placeholder="Search by clinic code or name..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Inventory Filter
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMatchedChange(!showMatchedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
              showMatchedOnly 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-input bg-background text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Database className="h-4 w-4" />
            <span className="text-sm">
              {showMatchedOnly ? 'Showing Matched Only' : 'Show All Clinics'}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SearchHeader;