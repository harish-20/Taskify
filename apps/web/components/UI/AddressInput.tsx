"use client";

import { useEffect, useRef, useState } from "react";
import TextInput from "@/components/UI/TextInput";
import { searchAddress } from "@/lib/services/api/external/address";

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface AddressInputProps {
  value: Address;
  onChange: (value: Address) => void;
}

interface Suggestion {
  display_name: string;
  address: any;
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const updateField = (key: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  const fetchSuggestions = async (search: string) => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);

      const data = await searchAddress({ query }, controller.signal);
      setSuggestions(data);
    } catch (error) {
      if ((error as any).name !== "AbortError") {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    const addr = suggestion.address;

    onChange({
      street: addr.road || addr.neighbourhood || addr.suburb || "",
      city: addr.city || addr.town || addr.village || "",
      state: addr.state || "",
      country: addr.country || "",
      zip: addr.postcode || "",
    });

    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="pt-4 relative">
      <TextInput
        label="Search Address"
        placeholder="Start typing address..."
        value={query}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {suggestions.length > 0 && (
        <div className="absolute z-50 bg-white border w-full mt-1 rounded-md shadow-md max-h-60 overflow-auto">
          {suggestions.map((s, index) => (
            <div
              key={index}
              className="p-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}

      {isLoading && <p className="text-xs text-gray-500 mt-1">Searching...</p>}

      <div className="mt-6 space-y-4">
        <TextInput
          label="Street Address"
          value={value.street}
          onChange={(e) => updateField("street", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="City"
            value={value.city}
            onChange={(e) => updateField("city", e.target.value)}
          />

          <TextInput
            label="State / Province"
            value={value.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </div>

        <TextInput
          label="Country"
          value={value.country}
          onChange={(e) => updateField("country", e.target.value)}
        />

        <TextInput
          label="Zip / Postal Code"
          value={value.zip}
          onChange={(e) => updateField("zip", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressInput;
