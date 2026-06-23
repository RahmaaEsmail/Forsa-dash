// import React from "react";
// import { Controller } from "react-hook-form";
// import { Label } from "../ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";

// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "../ui/command";

// import { Check, ChevronDown, X } from "lucide-react";

// const cn = (...classes) => classes.filter(Boolean).join(" ");

// export default function CustomSelect({
//   control,
//   name,
//   label,
//   placeholder,
//   options = [],
//   isRequired,
//   errors,
//   disabled,
//   isLoading,
//   multiple = false,
// }) {
//   const isSelectDisabled = disabled || isLoading;

//   const finalPlaceholder = isLoading
//     ? "Loading..."
//     : placeholder || (multiple ? "Select options..." : "Select...");

//   const hasOptions = Array.isArray(options) && options.length > 0;

//   const getLabelByValue = (val) => {
//     const found = options.find((o) => String(o.value) === String(val));
//     return found ? found.label : String(val);
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       {label && (
//         <Label className="font-normal text-secondary text-lg">
//           {label} {isRequired ? <span className="text-red-500">*</span> : null}
//         </Label>
//       )}

//       <Controller
//         control={control}
//         name={name}
//         render={({ field }) => {
//           const singleValue =
//             field.value != null && !Array.isArray(field.value)
//               ? String(field.value)
//               : "";

//           const multiValue = Array.isArray(field.value)
//             ? field.value.map((v) => String(v))
//             : [];

//           if (!multiple) {
//             return (
//               <Select
//                 disabled={isSelectDisabled}
//                 value={singleValue}
//                 onValueChange={(val) => field.onChange(val)}
//               >
//                 <SelectTrigger className="w-full rounded-lg bg-input-bg p-6 h-12 border-none ring-0 focus:ring-0 relative pr-12">
//                   <SelectValue placeholder={finalPlaceholder} />
//                   {singleValue && (
//                     <div
//                       role="button"
//                       tabIndex={0}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         field.onChange("");
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           field.onChange("");
//                         }
//                       }}
//                       className="absolute right-10 p-1 hover:bg-muted rounded-full transition-colors z-[100] text-muted-foreground hover:text-danger flex items-center justify-center cursor-pointer"
//                     >
//                       <X className="h-4 w-4" />
//                     </div>
//                   )}
//                 </SelectTrigger>

//                 <SelectContent className="z-[9999]">
//                   <SelectGroup>
//                     {label && <SelectLabel>{label}</SelectLabel>}

//                     {isLoading ? (
//                       <SelectItem value="__loading__" disabled>
//                         Loading...
//                       </SelectItem>
//                     ) : hasOptions ? (
//                       options.map((item) => (
//                         <SelectItem
//                           key={String(item.value)}
//                           value={String(item.value)}
//                           textValue={item.textValue || String(item.label)}
//                         >
//                           {item.label}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="__empty__" disabled>
//                         No options found
//                       </SelectItem>
//                     )}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             );
//           }

//           // MULTI SELECT MODE
//           const toggleValue = (v) => {
//             const valueStr = String(v);
//             const exists = multiValue.includes(valueStr);
//             const next = exists
//               ? multiValue.filter((x) => x !== valueStr)
//               : [...multiValue, valueStr];

//             field.onChange(next);
//           };

//           const clearAll = (e) => {
//             e.stopPropagation();
//             field.onChange([]);
//           };

//           return (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   disabled={isSelectDisabled}
//                   className={cn(
//                     "w-full justify-between rounded-lg bg-input-bg p-6 h-12 border-none hover:bg-input-bg hover:text-current",
//                     !multiValue.length ? "text-muted-foreground" : ""
//                   )}
//                 >
//                   <div className="flex items-center gap-2 overflow-hidden mr-2">
//                     {isLoading ? (
//                       <span>Loading...</span>
//                     ) : multiValue.length ? (
//                       <div className="flex items-center gap-2 overflow-hidden">
//                         <Badge
//                           variant="secondary"
//                           className="px-2 py-0.5 bg-primary text-white border-none shrink-0"
//                         >
//                           {getLabelByValue(multiValue[0])}
//                         </Badge>
//                         {multiValue.length > 1 && (
//                           <span className="text-xs font-bold text-primary shrink-0">
//                             +{multiValue.length - 1} more
//                           </span>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="truncate">{finalPlaceholder}</span>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 shrink-0">
//                     {multiValue.length > 0 && (
//                       <div 
//                         onClick={clearAll}
//                         className="p-1 hover:bg-muted rounded-full transition-colors"
//                       >
//                         <X className="h-3 w-3 text-muted-foreground" />
//                       </div>
//                     )}
//                     <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                   </div>
//                 </Button>
//               </PopoverTrigger>

//               <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[9999] border-none shadow-2xl rounded-xl">
//                 <Command className="rounded-xl">
//                   <CommandInput placeholder="Search..." className="border-none focus:ring-0" />

//                   {!hasOptions && !isLoading ? (
//                     <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
//                       No options found
//                     </CommandEmpty>
//                   ) : null}

//                   <CommandGroup className="max-h-[300px] overflow-auto p-2">
//                     {isLoading ? (
//                       <div className="p-3 text-sm text-muted-foreground animate-pulse">
//                         Loading...
//                       </div>
//                     ) : (
//                       options.map((item) => {
//                         const v = String(item.value);
//                         const isSelected = multiValue.includes(v);

//                         return (
//                           <CommandItem
//                             key={v}
//                             value={item.textValue || String(item.label)}
//                             onSelect={() => toggleValue(v)}
//                             className={cn(
//                               "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1",
//                               isSelected ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
//                             )}
//                           >
//                             <div className={cn(
//                               "h-4 w-4 rounded border flex items-center justify-center transition-all",
//                               isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
//                             )}>
//                               {isSelected && <Check className="h-3 w-3 text-white stroke-[4]" />}
//                             </div>
//                             <span className="flex-1 truncate">{item.label}</span>
//                           </CommandItem>
//                         );
//                       })
//                     )}
//                   </CommandGroup>
                  
//                   {multiValue.length > 0 && (
//                     <div className="p-3 border-t bg-muted/10 flex items-center justify-between">
//                       <span className="text-[10px] font-black uppercase text-muted-foreground">
//                         {multiValue.length} Selected
//                       </span>
//                       <Button 
//                         variant="ghost" 
//                         size="sm" 
//                         className="h-7 text-xs text-danger hover:text-danger hover:bg-danger/10"
//                         onClick={() => field.onChange([])}
//                       >
//                         Clear All
//                       </Button>
//                     </div>
//                   )}
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           );
//         }}
//       />

//       {errors?.message ? (
//         <p className="text-sm text-red-500 font-medium px-1 mt-1">
//           {errors.message}
//         </p>
//       ) : null}
//     </div>
//   );
// }

// import React from "react";
// import { Controller } from "react-hook-form";
// import { Label } from "../ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";

// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "../ui/command";

// import { Check, ChevronDown, X } from "lucide-react";

// const cn = (...classes) => classes.filter(Boolean).join(" ");

// export default function CustomSelect({
//   control,
//   name,
//   label,
//   placeholder,
//   options = [],
//   isRequired,
//   errors,
//   disabled,
//   isLoading,
//   multiple = false,
// }) {
//   const isSelectDisabled = disabled || isLoading;

//   const finalPlaceholder = isLoading
//     ? "Loading..."
//     : placeholder || (multiple ? "Select options..." : "Select...");

//   const hasOptions = Array.isArray(options) && options.length > 0;

//   const getLabelByValue = (val) => {
//     const found = options.find((o) => String(o.value) === String(val));
//     return found ? found.label : String(val);
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       {label && (
//         <Label className="font-normal text-secondary text-lg">
//           {label} {isRequired ? <span className="text-red-500">*</span> : null}
//         </Label>
//       )}

//       <Controller
//         control={control}
//         name={name}
//         render={({ field }) => {
//           const singleValue =
//             field.value != null && !Array.isArray(field.value)
//               ? String(field.value)
//               : "";

//           const multiValue = Array.isArray(field.value)
//             ? field.value.map((v) => String(v))
//             : [];

//           // SINGLE SELECT MODE
//           if (!multiple) {
//             const handleUnselect = (e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               field.onChange("");
//             };

//             return (
//               <Select
//                 key={singleValue + "-" + options.length + "-" + (isLoading ? "loading" : "loaded")}
//                 disabled={isSelectDisabled}
//                 value={singleValue}
//                 onValueChange={(val) => {
//                   // Handle clear value
//                   if (val === "clear") {
//                     field.onChange("");
//                   } else {
//                     field.onChange(val);
//                   }
//                 }}
//               >
//                 <SelectTrigger className="w-full rounded-lg bg-input-bg p-6 h-12 border-none ring-0 focus:ring-0 relative pr-12">
//                   <SelectValue placeholder={finalPlaceholder} />
//                   {singleValue && (
//                     <div
//                       role="button"
//                       tabIndex={0}
//                       onClick={handleUnselect}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") {
//                           handleUnselect(e);
//                         }
//                       }}
//                       className="absolute right-10 p-1 hover:bg-muted rounded-full transition-colors z-[100] text-muted-foreground hover:text-danger flex items-center justify-center cursor-pointer"
//                     >
//                       {/* <X className="h-4 w-4" /> */}
//                     </div>
//                   )}
//                 </SelectTrigger>

//                 <SelectContent className="z-[9999]">
//                   <SelectGroup>
//                     {label && <SelectLabel>{label}</SelectLabel>}

//                     {isLoading ? (
//                       <SelectItem value="__loading__" disabled>
//                         Loading...
//                       </SelectItem>
//                     ) : hasOptions ? (
//                       <>
//                         {/* Add an option to clear selection - use "clear" instead of empty string */}
//                         {singleValue && (
//                           <SelectItem 
//                             value="clear"
//                             className="text-danger focus:text-danger"
//                           >
//                             <div className="flex items-center gap-2">
//                               <X className="h-3 w-3" />
//                               <span>Clear selection</span>
//                             </div>
//                           </SelectItem>
//                         )}
                        
//                         {options.map((item) => (
//                           <SelectItem
//                             key={String(item.value)}
//                             value={String(item.value)}
//                             textValue={item.textValue || String(item.label)}
//                           >
//                             {item.label}
//                           </SelectItem>
//                         ))}
//                       </>
//                     ) : (
//                       <SelectItem value="__empty__" disabled>
//                         No options found
//                       </SelectItem>
//                     )}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             );
//           }

//           // MULTI SELECT MODE
//           const toggleValue = (v) => {
//             const valueStr = String(v);
//             const exists = multiValue.includes(valueStr);
//             const next = exists
//               ? multiValue.filter((x) => x !== valueStr)
//               : [...multiValue, valueStr];

//             field.onChange(next);
//           };

//           const clearAll = (e) => {
//             e.stopPropagation();
//             field.onChange([]);
//           };

//           // Individual badge removal for multi-select
//           const removeItem = (valueToRemove, e) => {
//             e.stopPropagation();
//             const next = multiValue.filter((v) => v !== String(valueToRemove));
//             field.onChange(next);
//           };

//           return (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   disabled={isSelectDisabled}
//                   className={cn(
//                     "w-full justify-between rounded-lg bg-input-bg p-6 h-12 border-none hover:bg-input-bg hover:text-current",
//                     !multiValue.length ? "text-muted-foreground" : ""
//                   )}
//                 >
//                   <div className="flex items-center gap-2 overflow-hidden mr-2 flex-wrap">
//                     {isLoading ? (
//                       <span>Loading...</span>
//                     ) : multiValue.length ? (
//                       <div className="flex items-center gap-2 flex-wrap">
//                         {multiValue.map((val, idx) => (
//                           <Badge
//                             key={val}
//                             variant="secondary"
//                             className="px-2 py-0.5 bg-primary text-white border-none shrink-0 flex items-center gap-1"
//                           >
//                             {getLabelByValue(val)}
//                             <div
//                               onClick={(e) => removeItem(val, e)}
//                               className="ml-1 p-0.5 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
//                             >
//                               <X className="h-2.5 w-2.5" />
//                             </div>
//                           </Badge>
//                         ))}
//                       </div>
//                     ) : (
//                       <span className="truncate">{finalPlaceholder}</span>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 shrink-0">
//                     {multiValue.length > 0 && (
//                       <div 
//                         onClick={clearAll}
//                         className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
//                       >
//                         <X className="h-3 w-3 text-muted-foreground" />
//                       </div>
//                     )}
//                     <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                   </div>
//                 </Button>
//               </PopoverTrigger>

//               <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[9999] border-none shadow-2xl rounded-xl">
//                 <Command className="rounded-xl">
//                   <CommandInput placeholder="Search..." className="border-none focus:ring-0" />

//                   {!hasOptions && !isLoading ? (
//                     <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
//                       No options found
//                     </CommandEmpty>
//                   ) : null}

//                   <CommandGroup className="max-h-[300px] overflow-auto p-2">
//                     {isLoading ? (
//                       <div className="p-3 text-sm text-muted-foreground animate-pulse">
//                         Loading...
//                       </div>
//                     ) : (
//                       <>
//                         {/* Add "Clear all" option at the top of multi-select */}
//                         {multiValue.length > 0 && (
//                           <CommandItem
//                             onSelect={() => field.onChange([])}
//                             className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1 text-danger hover:text-danger hover:bg-danger/10"
//                           >
//                             <X className="h-4 w-4" />
//                             <span className="flex-1 truncate font-medium">Clear all selections</span>
//                           </CommandItem>
//                         )}
                        
//                         {options.map((item) => {
//                           const v = String(item.value);
//                           const isSelected = multiValue.includes(v);

//                           return (
//                             <CommandItem
//                               key={v}
//                               value={item.textValue || String(item.label)}
//                               onSelect={() => toggleValue(v)}
//                               className={cn(
//                                 "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1",
//                                 isSelected ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
//                               )}
//                             >
//                               <div className={cn(
//                                 "h-4 w-4 rounded border flex items-center justify-center transition-all",
//                                 isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
//                               )}>
//                                 {isSelected && <Check className="h-3 w-3 text-white stroke-[4]" />}
//                               </div>
//                               <span className="flex-1 truncate">{item.label}</span>
//                               {isSelected && (
//                                 <X 
//                                   className="h-3 w-3 text-muted-foreground hover:text-danger cursor-pointer" 
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     toggleValue(v);
//                                   }}
//                                 />
//                               )}
//                             </CommandItem>
//                           );
//                         })}
//                       </>
//                     )}
//                   </CommandGroup>
                  
//                   {multiValue.length > 0 && (
//                     <div className="p-3 border-t bg-muted/10 flex items-center justify-between">
//                       <span className="text-[10px] font-black uppercase text-muted-foreground">
//                         {multiValue.length} Selected
//                       </span>
//                       <Button 
//                         variant="ghost" 
//                         size="sm" 
//                         className="h-7 text-xs text-danger hover:text-danger hover:bg-danger/10"
//                         onClick={() => field.onChange([])}
//                       >
//                         Clear All
//                       </Button>
//                     </div>
//                   )}
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           );
//         }}
//       />

//       {errors?.message ? (
//         <p className="text-sm text-red-500 font-medium px-1 mt-1">
//           {errors.message}
//         </p>
//       ) : null}
//     </div>
//   );
// }

import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

import { Check, ChevronDown, X } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function CustomSelect({
  control,
  name,
  label,
  placeholder,
  options = [],
  isRequired,
  errors,
  disabled,
  isLoading,
  multiple = false,
}) {
  const isSelectDisabled = disabled || isLoading;

  const finalPlaceholder = isLoading
    ? "Loading..."
    : placeholder || (multiple ? "Select options..." : "Select...");

  const hasOptions = Array.isArray(options) && options.length > 0;

  const getLabelByValue = (val) => {
    const found = options.find((o) => String(o.value) === String(val));
    return found ? found.label : String(val);
  };

  // Limit how many badges show up inside the closed select container
  const MAX_VISIBLE_BADGES = 2;

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
          const singleValue =
            field.value != null && !Array.isArray(field.value)
              ? String(field.value)
              : "";

          const multiValue = Array.isArray(field.value)
            ? field.value.map((v) => String(v))
            : [];

          // ==============================
          // SINGLE SELECT MODE
          // ==============================
          if (!multiple) {
            const handleUnselect = (e) => {
              e.preventDefault();
              e.stopPropagation();
              field.onChange("");
            };

            return (
              <Select
                key={singleValue + "-" + options.length + "-" + (isLoading ? "loading" : "loaded")}
                disabled={isSelectDisabled}
                value={singleValue}
                onValueChange={(val) => {
                  if (val === "clear") {
                    field.onChange("");
                  } else {
                    field.onChange(val);
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-lg bg-input-bg p-6 h-12 border-none ring-0 focus:ring-0 relative pr-12">
                  <SelectValue placeholder={finalPlaceholder} />
                  {singleValue && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleUnselect}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleUnselect(e);
                        }
                      }}
                      className="absolute right-10 p-1 hover:bg-muted rounded-full transition-colors z-[100] text-muted-foreground hover:text-danger flex items-center justify-center cursor-pointer"
                    >
                      {/* <X className="h-4 w-4" /> */}
                    </div>
                  )}
                </SelectTrigger>

                <SelectContent className="z-[9999]">
                  <SelectGroup>
                    {label && <SelectLabel>{label}</SelectLabel>}

                    {isLoading ? (
                      <SelectItem value="__loading__" disabled>
                        Loading...
                      </SelectItem>
                    ) : hasOptions ? (
                      <>
                        {singleValue && (
                          <SelectItem 
                            value="clear"
                            className="text-danger focus:text-danger"
                          >
                            <div className="flex items-center gap-2">
                              <X className="h-3 w-3" />
                              <span>Clear selection</span>
                            </div>
                          </SelectItem>
                        )}
                        
                        {options.map((item) => (
                          <SelectItem
                            key={String(item.value)}
                            value={String(item.value)}
                            textValue={item.textValue || String(item.label)}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <SelectItem value="__empty__" disabled>
                        No options found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }

          // ==============================
          // MULTI SELECT MODE
          // ==============================
          const toggleValue = (v) => {
            const valueStr = String(v);
            const exists = multiValue.includes(valueStr);
            const next = exists
              ? multiValue.filter((x) => x !== valueStr)
              : [...multiValue, valueStr];

            field.onChange(next);
          };

          const clearAll = (e) => {
            e.stopPropagation();
            field.onChange([]);
          };

          const removeItem = (valueToRemove, e) => {
            e.stopPropagation();
            const next = multiValue.filter((v) => v !== String(valueToRemove));
            field.onChange(next);
          };

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSelectDisabled}
                  className={cn(
                    "w-full justify-between rounded-lg bg-input-bg p-6 h-12 border-none hover:bg-input-bg hover:text-current",
                    !multiValue.length ? "text-muted-foreground" : ""
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2 max-w-[85%]">
                    {isLoading ? (
                      <span>Loading...</span>
                    ) : multiValue.length ? (
                      <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                        {multiValue.slice(0, MAX_VISIBLE_BADGES).map((val) => (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="px-2 py-0.5 bg-primary text-white border-none shrink-0 flex items-center gap-1 max-w-[150px]"
                          >
                            <span className="truncate">{getLabelByValue(val)}</span>
                            <div
                              onClick={(e) => removeItem(val, e)}
                              className="ml-1 p-0.5 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
                            >
                              <X className="h-2.5 w-2.5" />
                            </div>
                          </Badge>
                        ))}
                        
                        {multiValue.length > MAX_VISIBLE_BADGES && (
                          <Badge 
                            variant="outline" 
                            className="bg-muted text-muted-foreground border-none shrink-0 text-xs px-2 py-0.5 font-normal"
                          >
                            +{multiValue.length - MAX_VISIBLE_BADGES} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="truncate">{finalPlaceholder}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {multiValue.length > 0 && (
                      <div 
                        onClick={clearAll}
                        className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[9999] border-none shadow-2xl rounded-xl">
                <Command className="rounded-xl">
                  <CommandInput placeholder="Search..." className="border-none focus:ring-0" />

                  {!hasOptions && !isLoading ? (
                    <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
                      No options found
                    </CommandEmpty>
                  ) : null}

                  <CommandGroup className="max-h-[300px] overflow-auto p-2">
                    {isLoading ? (
                      <div className="p-3 text-sm text-muted-foreground animate-pulse">
                        Loading...
                      </div>
                    ) : (
                      <>
                        {multiValue.length > 0 && (
                          <CommandItem
                            onSelect={() => field.onChange([])}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1 text-danger hover:text-danger hover:bg-danger/10"
                          >
                            <X className="h-4 w-4" />
                            <span className="flex-1 truncate font-medium">Clear all selections</span>
                          </CommandItem>
                        )}
                        
                        {options.map((item) => {
                          const v = String(item.value);
                          const isSelected = multiValue.includes(v);

                          return (
                            <CommandItem
                              key={v}
                              value={item.textValue || String(item.label)}
                              onSelect={() => toggleValue(v)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1",
                                isSelected ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
                              )}
                            >
                              <div className={cn(
                                "h-4 w-4 rounded border flex items-center justify-center transition-all",
                                isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                              )}>
                                {isSelected && <Check className="h-3 w-3 text-white stroke-[4]" />}
                              </div>
                              <span className="flex-1 truncate">{item.label}</span>
                              {isSelected && (
                                <X 
                                  className="h-3 w-3 text-muted-foreground hover:text-danger cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleValue(v);
                                  }}
                                />
                              )}
                            </CommandItem>
                          );
                        })}
                      </>
                    )}
                  </CommandGroup>
                  
                  {multiValue.length > 0 && (
                    <div className="p-3 border-t bg-muted/10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">
                        {multiValue.length} Selected
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => field.onChange([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {errors?.message ? (
        <p className="text-sm text-red-500 font-medium px-1 mt-1">
          {errors.message}
        </p>
      ) : null}
    </div>
  );
}