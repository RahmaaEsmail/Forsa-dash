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
import { Check, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../hooks/useDebounce";

const cn = (...classes) => classes.filter(Boolean).join(" ");

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
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeyPrefix, debouncedSearch],
    queryFn: ({ signal }) => fetchFn({ search: debouncedSearch, signal }),
  });

  // Extract options array depending on common API response shapes
  const options = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option.name === "object" && option.name !== null) {
      return option.name.en || option.name.ar || "Unnamed Option";
    }
    return option.name || option.company_name || `Option ${option.id}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label className="font-normal text-secondary text-lg">
          {label} {isRequired ? <span className="text-red-500">*</span> : null}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find((opt) => String(opt.id) === String(field.value));

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between rounded-lg bg-input-bg p-6 h-5 font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? getOptionLabel(selectedOption) || "Selected"
                    : placeholder || "Select..."}
                  <span className="opacity-50">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={String(option.id)}
                        onSelect={(currentValue) => {
                          field.onChange(currentValue === String(field.value) ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            String(field.value) === String(option.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {getOptionLabel(option)}
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
        }}
      />
      {errors?.message ? (
        <p className="text-sm text-red-500">{errors.message}</p>
      ) : null}
    </div>
  );
}
