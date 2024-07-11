import React, { useState, useEffect } from "react";

interface Lignes {
  id: number;
  name: string;
}

interface MultiSelectDropDownProps {
  options: Lignes[];
  formFieldName: string;
  selected: number[];
  onChange: (selectedIds: number[]) => void;
}

const MultiSelectDropDown: React.FC<MultiSelectDropDownProps> = ({
  options,
  formFieldName,
  selected,
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(selected);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    const selectedNames = options
      .filter((option) => selectedOptions.includes(option.id))
      .map((option) => option.name);
    const namesText = selectedNames.join(", ");
    setDisplayText(
      namesText.length > 10 ? `${namesText.slice(0, 10)}...` : namesText
    );
  }, [selectedOptions, options]); // Only update effect when selectedOptions or options change

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const numericValue = Number(value);
    setSelectedOptions((prevSelected) =>
      checked
        ? [...prevSelected, numericValue]
        : prevSelected.filter((option) => option !== numericValue)
    );
  };

  useEffect(() => {
    // Call onChange prop to update parent state
    onChange(selectedOptions);
  }, [selectedOptions]); // Update parent state when selectedOptions change

  return (
    <label className="relative ">
      <input type="checkbox" className="hidden peer" />
      {displayText || "Cliquez ici pour choisir"}
      <div className="fixed bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
        <ul>
          {options.map((option) => (
            <li key={option.id}>
              <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                <input
                  type="checkbox"
                  name={formFieldName}
                  value={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={handleCheckboxChange}
                  className="cursor-pointer"
                />
                <span className="ml-1">{option.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
};

export default MultiSelectDropDown;
