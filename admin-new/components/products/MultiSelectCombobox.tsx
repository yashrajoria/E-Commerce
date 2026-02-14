"use client";

import * as React from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MultiSelectCombobox({
  value = [],
  onChange,
  categories,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  categories: { _id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-11 bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] rounded-xl transition-all duration-200"
          >
            <span
              className={
                value.length === 0
                  ? "text-muted-foreground/50"
                  : "text-foreground"
              }
            >
              {value.length === 0
                ? "Select categories"
                : `${value.length} selected`}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 glass-effect-strong border-white/[0.08] rounded-xl"
          align="start"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search categories..."
              className="border-white/[0.06]"
            />
            <CommandList>
              <CommandEmpty className="text-muted-foreground text-sm py-4">
                No category found.
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {categories.map((category) => {
                  const isSelected = value.includes(category.name);
                  return (
                    <CommandItem
                      key={category._id}
                      value={category.name}
                      onSelect={() => {
                        if (isSelected) {
                          onChange(
                            value.filter((item) => item !== category.name),
                          );
                        } else {
                          onChange([...value, category.name]);
                        }
                        setOpen(true);
                      }}
                      className="rounded-lg hover:bg-white/[0.04]"
                    >
                      <div
                        className={`h-4 w-4 rounded border mr-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-purple-500 border-purple-500"
                            : "border-white/[0.15] bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm">{category.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap mt-2.5 gap-1.5">
          {value.map((val: string) => (
            <Badge
              key={val}
              variant="secondary"
              className="px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/15 transition-colors"
            >
              {val}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== val))}
                className="ml-0.5 rounded hover:bg-purple-500/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
