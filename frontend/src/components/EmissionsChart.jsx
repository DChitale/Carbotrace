import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const round = (num, decimals = 1) => {
  if (num === null || num === undefined) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
};

export default function EmissionsChart({ codeCarbon, ciCarbon, infraCarbon }) {
  const data = [
    { name: 'Code-level', value: codeCarbon || 0, color: '#10b981', layer: 'Layer 1' },
    { name: 'CI/CD Pipeline', value: ciCarbon || 0, color: '#f59e0b', layer: 'Layer 2' },
    { name: 'Infrastructure', value: infraCarbon || 0, color: '#3b82f6', layer: 'Layer 3' }
  ];

  const totalCarbon = (codeCarbon || 0) + (ciCarbon || 0) + (infraCarbon || 0);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          Emissions Breakdown
        </h3>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
          Total: <strong className="text-slate-900 dark:text-slate-200">{round(totalCarbon, 1)} g CO2e</strong>
        </span>
      </div>

      <div className="h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255, 255, 255, 0.4)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(value) => [`${round(value, 2)} g CO2e/mo`, 'Emissions']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Structured Pill Legend */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
        {data.map((layer, index) => {
          const pct = totalCarbon > 0 ? ((layer.value / totalCarbon) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{layer.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">{pct}%</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">{round(layer.value, 1)} g</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
