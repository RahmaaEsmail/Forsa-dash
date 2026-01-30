"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

function formatDate(date) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePickerInput({label , placeholder ,}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(
    new Date("2025-06-01")
  )
  const [month, setMonth] = React.useState(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <Field className={"flex flex-col gap-2"}>
      <FieldLabel className={"font-normal my-0 py-0 text-secondary text-lg"} htmlFor="date-required">{label || "Subscription Date"}</FieldLabel>
      <InputGroup className={"rounded-lg! bg-input-bg p-6"}>
        <InputGroupInput
          id="date-required"
          value={value}
          className={" placeholder:text-[#858B9E]"}
          placeholder="June 01, 2025"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon 
        // className={"rounded-lg! bg-input-bg p-4 placeholder:text-[#858B9E]"}
        align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
              
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <img src="/images/lets-icons_date-range-fill.svg" className="w-5 h-5"/>
                {/* <CalendarIcon /> */}
                <span className="sr-only">{placeholder || "Select date"}</span>
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
                selected={date}
                month={month}
                className={"rounded-lg! bg-input-bg p-6 placeholder:text-[#858B9E]"}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  setDate(date)
                  setValue(formatDate(date))
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
