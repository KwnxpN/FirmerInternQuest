import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type MultiSelectOption<T> = {
    label: string;
    value: T;
};

type MultiSelectProps<T> = {
    options: MultiSelectOption<T>[];
    selected: T[];
    onChange: (selected: T[]) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    selectAllLabel?: string;
};

export function MultiSelect<T>({
    options,
    selected,
    onChange,
    placeholder = "Select items",
    disabled = false,
}: MultiSelectProps<T>) {

    const handleSelect = (value: T) => {
        const nextSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];

        onChange(nextSelected);
    };

    const handleClearAll = () => {
        onChange([]);
    };

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map((option) => option.value));
        }
    };

    const handleRemove = (value: T, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents the popover from toggling
        onChange(selected.filter((item) => item !== value));
    };

    const selectedLabels = options
        .filter((option) => selected.includes(option.value))
        .map((option) => option.label);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    id="select-actions-button"
                    disabled={disabled}
                    className="border border-[#1e293b] justify-start px-2.5 font-normal w-full bg-[#1e293b]
                        text-[#92a1b6] hover:bg-[#1b2738] hover:text-[#808ea1] h-auto">
                    <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedLabels.map((label, idx) => (
                                <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-[#137fec] text-white hover:bg-[#137fec]/90"
                                >
                                    {label}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => handleRemove(selected[idx], e)}
                                        className="ml-1 rounded-full hover:bg-white/20"
                                    >
                                        <X className="h-3 w-3" />
                                    </span>
                                </Badge>
                            ))
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-[#162033]">
                <div className="max-h-70 overflow-auto bg-[#162033] text-white border border-[#334561] rounded-md">
                    {options.length === 0 ? (
                        <div className="p-2">
                            <p className="text-sm text-[#637289]">No options available.</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            <button
                                key="select-all"
                                type="button"
                                onClick={() => handleSelectAll()}
                                className={cn(
                                    "w-full flex items-center justify-between px-2 py-2 text-sm rounded-sm hover:bg-[#1b2738] transition-colors",
                                    selected.length === options.length && "bg-[#137fec]/10",
                                )}
                            >
                                <span className={cn("font-medium")}>
                                    {selected.length === options.length ? "Deselect All" : "Select All"}
                                </span>
                                <div className={cn(
                                    "h-4 w-4 border-2 rounded flex items-center justify-center shrink-0",
                                    selected.length === options.length ? "border-[#137fec] bg-[#137fec]" : "border-gray-300"
                                )}>
                                    {selected.length === options.length && <Check className="h-3 w-3 text-white" />}
                                </div>
                            </button>
                            {options.map((option, idx) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-2 py-2 text-sm rounded-sm hover:bg-[#1b2738] transition-colors",
                                            isSelected && "bg-[#137fec]/10",
                                        )}
                                    >
                                        <span className={cn(isSelected && "font-medium")}>
                                            {option.label}
                                        </span>
                                        <div className={cn(
                                            "h-4 w-4 border-2 rounded flex items-center justify-center shrink-0",
                                            isSelected ? "border-[#137fec] bg-[#137fec]" : "border-gray-300"
                                        )}>
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
                {selected.length > 0 && (
                    <div className="m-2 border-t border-[#334561]" >
                        <Button variant="secondary" className="w-full justify-center rounded-b-md"
                            onClick={handleClearAll}>
                            Clear All
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover >
    )

}
export default MultiSelect;