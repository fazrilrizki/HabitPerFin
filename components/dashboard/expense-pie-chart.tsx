"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

interface ExpensePieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  totalExpense: number;
}

// Vibrant modern color palette
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full shadow-sm" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="font-semibold text-sm text-foreground">{data.name}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground ml-5">
          Rp {Number(data.value).toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpensePieChart({ data, totalExpense }: ExpensePieChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <Card className="col-span-1 lg:col-span-3 shadow-md border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">Kategori Pengeluaran</CardTitle>
        <CardDescription>Distribusi pengeluaran bulan ini</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length > 0 ? (
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="none"
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80"
                      style={{
                        transform: activeIndex === index ? 'scale(1.03)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Total Amount */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                Rp {totalExpense >= 1000000 ? (totalExpense / 1000000).toFixed(1) + 'Jt' : totalExpense.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[350px] items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl m-4">
            <div className="p-4 bg-muted/50 rounded-full mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-sm font-medium">Belum ada data bulan ini</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
