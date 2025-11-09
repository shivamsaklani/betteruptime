"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {  LucideIcon } from "lucide-react";

export interface MetricType {
  title: string;
  Icon: LucideIcon; // Correct type for Lucide icons
  heading: string;
  subheading: string; // e.g. "+0.2%", "-2", "+12ms"
  subheading_description: string;
  icon_classname:string
}
const getChangeInfo = (subheading: string) => {
  const trimmed = subheading.trim();
  const firstChar = trimmed.charAt(0);

  const isPositive = firstChar === "+" || (firstChar !== "-" && !isNaN(+trimmed));
  const isNegative = firstChar === "-";

  return {
    text: trimmed,
    colorClass: isPositive
      ? "text-green-600"
      : isNegative
      ? "text-red-600"
      : "text-muted-foreground",
  };
};

const MetricBox = ({
  title,
  Icon,
  heading,
  subheading,
  subheading_description,
  icon_classname
}: MetricType) => {
  const { text: changeText, colorClass } = getChangeInfo(subheading);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* Icon inherits same color as subheading */}
        <Icon className={`h-4 w-4 ${icon_classname}`} />
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{heading}</div>
        <p className="text-xs text-muted-foreground">
          <span className={colorClass}>{changeText}</span>{" "}
          {subheading_description}
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricBox;
