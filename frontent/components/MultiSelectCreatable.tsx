"use client";
import React from "react";
import CreatableSelect from "react-select/creatable";

type Option = { label: string; value: string };

interface MultiSelectCreatableProps {
  label: string;
  options: string[]; // suggestion list
  value: string[];   // selected skills
  onChangeAction: (vals: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectCreatable({
  label,
  options,
  value,
  onChangeAction,
  placeholder,
}: MultiSelectCreatableProps) {
  const opts: Option[] = options.map((o) => ({ label: o, value: o }));
  const selected = value.map((v) => ({ label: v, value: v }));

  const handleChange = (items: readonly Option[] | null) => {
    if (!items) return onChangeAction([]);
    onChangeAction(items.map((it: Option) => it.value));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <CreatableSelect
        isMulti
        options={opts}
        value={selected}
        onChange={handleChange}
        placeholder={placeholder ?? "Type or select skills..."}
        menuPlacement="auto"
        maxMenuHeight={240} // scrollable
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
          multiValue: () =>
            "bg-blue-100 dark:bg-blue-700 rounded-full px-2 flex items-center",
          multiValueLabel: () =>
            "text-blue-700 dark:text-white text-xs font-medium",
          multiValueRemove: () =>
            "ml-1 text-slate-500 hover:text-red-500 cursor-pointer",
          placeholder: () => "text-slate-400 dark:text-slate-500",
          input: () => "text-slate-900 dark:text-slate-100",
        }}
      />
    </div>
  );
}
