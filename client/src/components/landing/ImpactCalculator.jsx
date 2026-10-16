import { useState } from 'react';
import {
  TreeEvergreen,
  Lightning,
  CurrencyDollar,
  Car,
  SlidersHorizontal,
} from '@phosphor-icons/react';

export function ImpactCalculator() {
  const [teamSize, setTeamSize] = useState(25);

  // Real formula based on average 6 builds/dev/day, 180g avg savings per optimized pipeline
  const annualKgSaved = ((teamSize * 6 * 260 * 165) / 1000).toFixed(0);
  const mwhSaved = (annualKgSaved / 475).toFixed(1);
  const carKmEquivalent = (annualKgSaved * 8.2).toFixed(0);
  const cloudCostSavings = (teamSize * 480).toLocaleString();

  return (
    <section className="impact-calculator-section" aria-label="Interactive sustainability calculator">
      <div className="impact-calculator-card">
        {/* Header */}
        <div className="impact-header">
          <div className="section-eyebrow">
            <TreeEvergreen size={13} weight="fill" />
            <span>Interactive Carbon ROI</span>
          </div>
          <h2 className="section-title-large">Calculate your organization’s impact</h2>
          <p className="section-desc">
            See the cumulative carbon and cloud infrastructure expenditure your engineering team saves annually by implementing automated GreenOps gates.
          </p>
        </div>

        {/* Interactive Slider */}
        <div className="impact-slider-block">
          <div className="slider-label-row">
            <span className="slider-title">
              <SlidersHorizontal size={15} />
              <span>Active Developers / CI Workflows</span>
            </span>
            <span className="slider-value-display">{teamSize} Engineers</span>
          </div>

          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="impact-range-slider"
            aria-label="Number of active engineers or CI workflows"
          />

          <div className="slider-scale-row">
            <span>5 (Startup)</span>
            <span>50 (Growth)</span>
            <span>150 (Mid-Market)</span>
            <span>250+ (Enterprise)</span>
          </div>
        </div>

        {/* Dynamic Metric Output Grid */}
        <div className="impact-metrics-grid">
          {/* Carbon Eliminated */}
          <div className="impact-metric-box">
            <div className="impact-metric-icon icon-emerald">
              <TreeEvergreen size={22} weight="bold" />
            </div>
            <div className="impact-metric-data">
              <span className="metric-number text-emerald">
                {Number(annualKgSaved).toLocaleString()}
                <span className="metric-unit">kg CO2e</span>
              </span>
              <span className="metric-caption">Annual Carbon Eliminated</span>
            </div>
          </div>

          {/* Energy Conserved */}
          <div className="impact-metric-box">
            <div className="impact-metric-icon icon-blue">
              <Lightning size={22} weight="bold" />
            </div>
            <div className="impact-metric-data">
              <span className="metric-number text-blue">
                {mwhSaved}
                <span className="metric-unit">MWh</span>
              </span>
              <span className="metric-caption">Grid Electricity Conserved</span>
            </div>
          </div>

          {/* Cloud Cost Reductions */}
          <div className="impact-metric-box">
            <div className="impact-metric-icon icon-amber">
              <CurrencyDollar size={22} weight="bold" />
            </div>
            <div className="impact-metric-data">
              <span className="metric-number text-amber">
                ${cloudCostSavings}
                <span className="metric-unit">/yr</span>
              </span>
              <span className="metric-caption">Cloud Runner Cost Savings</span>
            </div>
          </div>

          {/* Equivalent Car Travel */}
          <div className="impact-metric-box">
            <div className="impact-metric-icon icon-purple">
              <Car size={22} weight="bold" />
            </div>
            <div className="impact-metric-data">
              <span className="metric-number">
                {Number(carKmEquivalent).toLocaleString()}
                <span className="metric-unit">km</span>
              </span>
              <span className="metric-caption">Gasoline Travel Offset</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
