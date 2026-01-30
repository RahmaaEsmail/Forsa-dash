"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

import { useController } from "react-hook-form"

function formatDate(date) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

/**
 * Accepts:
 * - control (required)
 * - name (required)
 * - label, placeholder
 * - required (optional)
 */
export function DatePickerInput({
  control,
  name,
  label,
  placeholder = "June 01, 2025",
  required,
}) {
  const [open, setOpen] = React.useState(false)

  const {
    field,      // { value, onChange, onBlur, ref }
    fieldState, // { error }
  } = useController({
    name,
    control,
    rules: required ? { required: "This field is required" } : undefined,
  })

  // ensure value is Date|null
  const selectedDate = React.useMemo(() => {
    return field.value instanceof Date ? field.value : field.value ? new Date(field.value) : null
  }, [field.value])

  const [displayValue, setDisplayValue] = React.useState(formatDate(selectedDate))
  const [calendarMonth, setCalendarMonth] = React.useState(selectedDate ?? new Date())

  // keep input text synced if form value changes externally
  React.useEffect(() => {
    setDisplayValue(formatDate(selectedDate))
    setCalendarMonth(selectedDate ?? new Date())
  }, [selectedDate])

  return (
    <Field className="flex flex-col gap-2">
      <FieldLabel
        className="font-normal my-0 py-0 text-secondary text-lg"
        htmlFor={name}
      >
        {label || "Date"}
        {required ? <span className="ms-1 text-red-500">*</span> : null}
      </FieldLabel>

      <InputGroup className="rounded-lg! bg-input-bg p-6">
        <InputGroupInput
          id={name}
          value={displayValue}
          placeholder={placeholder}
          className="placeholder:text-[#858B9E]"
          onBlur={field.onBlur}
          ref={field.ref}
          onChange={(e) => {
            const raw = e.target.value
            setDisplayValue(raw)

            // try parse user input
            const parsed = new Date(raw)
            if (isValidDate(parsed)) {
              field.onChange(parsed)
              setCalendarMonth(parsed)
            } else {
              // allow user to type freely; don't overwrite form value with invalid date
              // If you prefer clearing it when invalid, uncomment:
              // field.onChange(null)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />

        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id={`${name}-date-picker`}
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
                type="button"
              >
                <img
                  src="/images/lets-icons_date-range-fill.svg"
                  className="w-5 h-5"
                  alt=""
                />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                className="rounded-lg! bg-input-bg p-6"
                onSelect={(d) => {
                  if (!d) return
                  field.onChange(d)
                  setDisplayValue(formatDate(d))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {fieldState.error?.message ? (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      ) : null}
    </Field>
  )
}
