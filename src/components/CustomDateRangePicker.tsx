import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Calendar as CalendarLucide } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomDateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export const CustomDateRangePicker = ({ dateRange, onDateRangeChange, className }: CustomDateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    {
      label: "今天",
      value: "today", 
      getRange: (): DateRange => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: "7天",
      value: "7days",
      getRange: (): DateRange => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return { from: sevenDaysAgo, to: today };
      },
    },
    {
      label: "1个月",
      value: "1month",
      getRange: (): DateRange => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return { from: oneMonthAgo, to: today };
      },
    },
    {
      label: "3个月",
      value: "3months",
      getRange: (): DateRange => {
        const today = new Date();
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return { from: threeMonthsAgo, to: today };
      },
    },
    {
      label: "6个月",
      value: "6months",
      getRange: (): DateRange => {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        return { from: sixMonthsAgo, to: today };
      },
    },
    {
      label: "1年",
      value: "1year",
      getRange: (): DateRange => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return { from: oneYearAgo, to: today };
      },
    },
  ];

  const handlePresetSelect = (value: string) => {
    const preset = presetRanges.find(p => p.value === value);
    if (preset) {
      const range = preset.getRange();
      onDateRangeChange(range);
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "选择时间段";
    if (!dateRange.to) return format(dateRange.from, "yyyy/MM/dd");
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "yyyy/MM/dd");
    }
    return `${format(dateRange.from, "yyyy/MM/dd")} - ${format(dateRange.to, "yyyy/MM/dd")}`;
  };

  const getCurrentPreset = () => {
    if (!dateRange?.from || !dateRange.to) return "";
    
    for (const preset of presetRanges) {
      const presetRange = preset.getRange();
      if (presetRange.from && presetRange.to && dateRange.from && dateRange.to) {
        const isSameFrom = Math.abs(presetRange.from.getTime() - dateRange.from.getTime()) < 24 * 60 * 60 * 1000;
        const isSameTo = Math.abs(presetRange.to.getTime() - dateRange.to.getTime()) < 24 * 60 * 60 * 1000;
        if (isSameFrom && isSameTo) {
          return preset.value;
        }
      }
    }
    return "custom";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <CalendarLucide className="w-4 h-4" />
        <span>数据统计时间段:</span>
      </div>
      
      <Select value={getCurrentPreset()} onValueChange={handlePresetSelect}>
        <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-600 text-slate-200">
          <SelectValue placeholder="选择时间段" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          {presetRanges.map((preset) => (
            <SelectItem 
              key={preset.value} 
              value={preset.value}
              className="text-slate-200 focus:bg-slate-700 focus:text-white"
            >
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem 
            value="custom"
            className="text-slate-200 focus:bg-slate-700 focus:text-white"
          >
            自定义
          </SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50",
              !dateRange?.from && "text-slate-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange(range);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-slate-200",
              caption_label: "text-sm font-medium text-slate-200",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 text-slate-400 hover:text-slate-200",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal text-slate-200 hover:bg-slate-700 hover:text-white rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-slate-700 text-slate-200",
              day_outside: "text-slate-500",
              day_disabled: "text-slate-600",
              day_range_middle: "aria-selected:bg-slate-700 aria-selected:text-slate-200",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};