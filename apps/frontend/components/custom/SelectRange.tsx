"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface SelectRangeProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SelectRange({ value, onChange }: SelectRangeProps) {
  return (
    <div className="flex justify-end">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Time Range</SelectLabel>
            <SelectItem value="1m">1 minute</SelectItem>
            <SelectItem value="5m">5 minutes</SelectItem>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="1d">24 hours</SelectItem>
            <SelectItem value="1mo">1 Month</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
