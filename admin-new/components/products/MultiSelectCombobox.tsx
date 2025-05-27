"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function MultiSelectCombobox({
  form,
  name,
  categories,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  categories: [];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>Categories</FormLabel>
          <FormControl>
            <div className="relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between bg-white dark:bg-gray-950"
                  >
                    Select categories
                    <span className="ml-2 rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs font-medium">
                      {field.value.length}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 glass-effect">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {categories.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={() => {
                              if (field.value.includes(category)) {
                                field.onChange(
                                  field.value.filter(
                                    (item: string) => item !== category
                                  )
                                );
                              } else {
                                field.onChange([...field.value, category]);
                              }
                              // Keep the popover open after selection
                              setOpen(true);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                field.value.includes(category)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Show selected items */}
              <div className="flex flex-wrap mt-3 gap-2">
                {field.value.map((val: string) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="px-2 py-1 text-sm rounded-full flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange(
                          field.value.filter((item: string) => item !== val)
                        )
                      }
                      className="ml-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/30 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
