"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (start: Date | null, end: Date | null) => void;
}

export function DateRangePicker({
    startDate,
    endDate,
    onChange,
}: DateRangePickerProps) {
    const [startTime, setStartTime] = React.useState(
        startDate ? format(startDate, "HH:mm") : "00:00",
    );
    const [endTime, setEndTime] = React.useState(
        endDate ? format(endDate, "HH:mm") : "23:59",
    );

    const applyTime = (date: Date | null, time: string): Date | null => {
        if (!date) return null;
        const [h, m] = time.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(h, m, 0, 0);
        return newDate;
    };

    const handleSelect = (range: DateRange | undefined) => {
        const from = range?.from
            ? applyTime(range.from, startTime)
            : null;
        const to = range?.to
            ? applyTime(range.to, endTime)
            : null;

        onChange(from, to);
    };

    const selectedRange: DateRange | undefined =
        startDate || endDate
            ? { from: startDate ?? undefined, to: endDate ?? undefined }
            : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date-range-picker-button"
                    className="justify-start px-2.5 font-normal w-90 bg-[#162033] text-[#92a1b6] hover:bg-[#1b2738] hover:text-[#808ea1]"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                        endDate ? (
                            <>
                                {format(startDate, "LLL dd, y HH:mm")} -{" "}
                                {format(endDate, "LLL dd, y HH:mm")}
                            </>
                        ) : (
                            format(startDate, "LLL dd, y HH:mm")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 bg-[#162033] text-white" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={startDate ?? new Date()}
                    selected={selectedRange}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                />

                {/* Time Pickers */}
                <div className="flex gap-4 border-t p-3">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white" />
                        <label className="text-sm">Start</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                onChange(
                                    applyTime(startDate, e.target.value),
                                    endDate,
                                );
                            }}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white" />
                        <label className="text-sm">End</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                onChange(
                                    startDate,
                                    applyTime(endDate, e.target.value),
                                );
                            }}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DateRangePicker;