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
            <SelectItem value="10m">10minute</SelectItem>
            <SelectItem value="30m">30minutes</SelectItem>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="24h">24 hours</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
