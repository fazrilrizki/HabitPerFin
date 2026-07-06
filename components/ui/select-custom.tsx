import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select";

export type SelectOption = {
    value: string;
    label: string;
}

interface SelectCustomProps {
    options: SelectOption[];
    placeholder?: string;
    name?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export default function SelectCustom({
    options,
    placeholder = "Select an option",
    name,
    value,
    onValueChange,
    className = "w-full"
}: SelectCustomProps) {
  return (
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            {
                options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))
            }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
