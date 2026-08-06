import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    showTime?: boolean;
    triggerTestId?: string;
    disabled?: boolean;
}

export function DateTimePicker({ date, setDate, className, showTime = true, triggerTestId, disabled = false }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
    const [timeValue, setTimeValue] = React.useState<string>(
        date ? format(date, "HH:mm") : ""
    );

    React.useEffect(() => {
        setSelectedDate(date);
        setTimeValue(date ? format(date, "HH:mm") : "");
    }, [date]);

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            const currentTime = showTime ? (timeValue || "00:00") : "00:00";
            const [hours, minutes] = currentTime.split(":").map(Number);
            newDate.setHours(hours, minutes);
            setSelectedDate(newDate);
            setDate(newDate);
        } else {
            setSelectedDate(undefined);
            setDate(undefined);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTimeValue(newTime);
        if (selectedDate) {
            const [hours, minutes] = newTime.split(":").map(Number);
            const newDate = new Date(selectedDate);
            newDate.setHours(hours, minutes);
            setDate(newDate);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "h-10 w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                    data-testid={triggerTestId}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        <span className="truncate">{format(date, showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy")}</span>
                    ) : (
                        <span className="truncate">{showTime ? "Seleccionar fecha y hora" : "dd/MM/aaaa"}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden border-border p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                {showTime && (
                    <div className="bg-background p-3 border-t border-border">
                        <Input
                            type="time"
                            value={timeValue}
                            onChange={handleTimeChange}
                            className="w-full"
                            disabled={disabled}
                        />
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
