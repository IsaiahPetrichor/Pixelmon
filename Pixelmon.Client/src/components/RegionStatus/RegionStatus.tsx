import { useState } from 'react';
import type { RegionStatusComponentProps } from './RegionStatus.types';
import './RegionStatus.css';

type ProgressBarProps = {
  label: string;
  percentage: number;
};

function ProgressBar({ label, percentage }: ProgressBarProps) {
  return (
    <div className="region-status-progress-bar">
      <div
        className="region-status-progress"
        role="progressbar"
        aria-label={`${label} completion`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        style={{
          backgroundImage: `linear-gradient(to right, var(--progress-full) ${percentage}%, var(--progress-empty) ${percentage ? percentage + 2 : 0}%)`,
        }}
      />
      <p>{percentage}%</p>
    </div>
  );
}

function RegionStatusComponent({ regionName, status }: RegionStatusComponentProps) {
  const [showRouteProgress, setShowRouteProgress] = useState(false);
  const routeCompletionRates = Object.entries(status).map(([routeName, workAreas]) => {
    const completionRates = Object.values(workAreas);

    return {
      routeName,
      completionRate:
        completionRates.length > 0
          ? completionRates.reduce((total, rate) => total + rate, 0) / completionRates.length
          : 0,
    };
  });
  const overallCompletionRate =
    routeCompletionRates.length > 0
      ? routeCompletionRates.reduce((total, route) => total + route.completionRate, 0) / routeCompletionRates.length
      : 0;
  const overallPercentage = Math.floor(overallCompletionRate * 100);
  const workAreaCompletionRates = Object.values(status).reduce<Record<string, number[]>>(
    (completionRatesByArea, workAreas) => {
      Object.entries(workAreas).forEach(([workAreaName, completionRate]) => {
        completionRatesByArea[workAreaName] ??= [];
        completionRatesByArea[workAreaName].push(completionRate);
      });

      return completionRatesByArea;
    },
    {},
  );

  return (
    <section className="region-status-detailed">
      <div className="region-header">
        <h2>{regionName}</h2>
        <ProgressBar label={regionName} percentage={overallPercentage} />
      </div>
      <div>
        <h3>{showRouteProgress ? 'Progress by Route' : 'Progress by Work Area'}</h3>
        <ul>
          {showRouteProgress
            ? routeCompletionRates.map(({ routeName, completionRate }) => (
                <li key={routeName}>
                  <span>{routeName}</span>
                  <ProgressBar label={routeName} percentage={Math.floor(completionRate * 100)} />
                </li>
              ))
            : Object.entries(workAreaCompletionRates).map(([workAreaName, completionRates]) => {
                const completionRate =
                  completionRates.reduce((total, rate) => total + rate, 0) / completionRates.length;

                return (
                  <li key={workAreaName}>
                    <span>{workAreaName}</span>
                    <ProgressBar label={workAreaName} percentage={Math.floor(completionRate * 100)} />
                  </li>
                );
              })}
        </ul>
        <button
          type="button"
          aria-expanded={showRouteProgress}
          className="secondary-button"
          onClick={() => setShowRouteProgress((isShowingRoutes) => !isShowingRoutes)}
        >
          {showRouteProgress ? 'Work Area Details' : 'Route Details'}
        </button>
      </div>
    </section>
  );
}

export default RegionStatusComponent;
