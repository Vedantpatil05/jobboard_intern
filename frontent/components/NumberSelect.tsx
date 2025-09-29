"use client";
import React from "react";
import ReactSelect, { SingleValue } from "react-select";

type Option = { label: string; value: number };

interface NumberSelectProps {
  label: string;
  options: number[];     // e.g. [0,1,2,3,4,5...]
  value: number | null;
  onChangeAction: (val: number | null) => void;
  placeholder?: string;
}

export default function NumberSelect({
  label,
  options,
  value,
  onChangeAction,
  placeholder,
}: NumberSelectProps) {
  const opts: Option[] = options.map((n) => ({
    label: `${n} ${n === 1 ? "year" : "years"}`,
    value: n,
  }));
  const selected = opts.find((o) => o.value === value) ?? null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <ReactSelect
        options={opts}
        value={selected}
        onChange={(opt: SingleValue<Option>) => onChangeAction(opt ? opt.value : null)}
        placeholder={placeholder ?? `Select ${label}`}
        isSearchable
        isClearable
        menuPlacement="auto"
        maxMenuHeight={200} // scrollable
        classNames={{
          control: ({ isFocused }) =>
            `rounded-lg border min-h-[44px] shadow-sm text-sm ${
              isFocused
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-slate-300 dark:border-slate-600"
            }`,
          menu: () =>
            "rounded-lg bg-white dark:bg-slate-800 shadow-lg z-50 text-sm",
          option: ({ isSelected, isFocused }) =>
            `px-3 py-2 cursor-pointer ${
              isSelected
                ? "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white"
                : isFocused
                ? "bg-slate-100 dark:bg-slate-700"
                : ""
            }`,
          placeholder: () => "text-slate-400 dark:text-slate-500",
          input: () => "text-slate-900 dark:text-slate-100",
          singleValue: () => "text-slate-900 dark:text-slate-100",
        }}
      />
    </div>
  );
}
