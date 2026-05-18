import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Check, Plus, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../hooks/useDebounce";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const SelectContentInternal = ({ 
  field, 
  options, 
  open, 
  setOpen, 
  disabled, 
  placeholder, 
  searchTerm, 
  setSearchTerm, 
  isLoading, 
  onCreateNew, 
  createLabel, 
  renderOption, 
  getOptionLabel,
  getOptionValue,
  onSelectOption
}) => {
  const selectedOption = options.find((opt) => String(getOptionValue(opt)) === String(field.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between rounded-lg bg-input-bg p-6 h-5 font-normal border-none",
            !field.value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {field.value
              ? getOptionLabel(selectedOption) || "Selected"
              : placeholder || "Select..."}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[9999]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty className="p-2 text-center text-sm text-muted-foreground">
            {isLoading ? "Loading..." : "No items found."}
            {!isLoading && onCreateNew && (
              <Button
                variant="ghost"
                className="w-full mt-2 justify-start text-primary"
                onClick={() => {
                  setOpen(false);
                  onCreateNew(searchTerm);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {createLabel}
              </Button>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.id || getOptionValue(option)}
                value={String(getOptionValue(option))}
                onSelect={(currentValue) => {
                  const isSelected = currentValue === String(field.value);
                  const newValue = isSelected ? "" : currentValue;
                  field.onChange(newValue);
                  setOpen(false);
                  if (onSelectOption) {
                    onSelectOption(isSelected ? null : option);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    String(field.value) === String(getOptionValue(option)) ? "opacity-100" : "opacity-0"
                  )}
                />
                {renderOption ? renderOption(option) : getOptionLabel(option)}
              </CommandItem>
            ))}
            {options.length > 0 && onCreateNew && (
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onCreateNew(searchTerm);
                }}
                className="text-primary font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createLabel}
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function SearchableAsyncSelect({
  control,
  name,
  label,
  placeholder,
  isRequired,
  errors,
  disabled,
  fetchFn,
  queryKeyPrefix,
  onCreateNew,
  createLabel = "Create New",
  valueKey = "id",
  renderOption,
  getOptionLabel: customGetOptionLabel,
  getOptionValue: customGetOptionValue,
  hideLabel = false,
  value,
  onChange,
  className,
  onSelectOption,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeyPrefix, debouncedSearch],
    queryFn: ({ signal }) => fetchFn({ search: debouncedSearch, signal }),
  });

  const options = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  
  const getOptionValue = (option) => {
    if (!option) return "";
    if (customGetOptionValue) return customGetOptionValue(option);
    return String(option[valueKey]);
  };

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (customGetOptionLabel) return customGetOptionLabel(option);
    if (typeof option.name === "object" && option.name !== null) {
      return option.name.en || option.name.ar || "Unnamed Option";
    }
    return option.name || option?.first_name || option.company_name || `Option ${option.id}`;
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && !hideLabel && (
        <Label className="font-normal text-secondary text-lg">
          {label} {isRequired ? <span className="text-red-500">*</span> : null}
        </Label>
      )}

      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <SelectContentInternal 
              field={field} 
              options={options} 
              open={open} 
              setOpen={setOpen} 
              disabled={disabled}
              placeholder={placeholder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoading={isLoading}
              onCreateNew={onCreateNew}
              createLabel={createLabel}
              renderOption={renderOption}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onSelectOption={onSelectOption}
            />
          )}
        />
      ) : (
        <SelectContentInternal 
          field={{ value, onChange }} 
          options={options} 
          open={open} 
          setOpen={setOpen} 
          disabled={disabled}
          placeholder={placeholder}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          onCreateNew={onCreateNew}
          createLabel={createLabel}
          renderOption={renderOption}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          onSelectOption={onSelectOption}
        />
      )}
      {errors?.message ? (
        <p className="text-sm text-red-500">{errors.message}</p>
      ) : null}
    </div>
  );
}
