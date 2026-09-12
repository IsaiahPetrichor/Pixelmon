import { useState } from 'react';
import type { RegionStatusComponentProps } from './RegionStatus.types';
import './RegionStatus.css';
import { compareRouteNames } from '../../utils/routeSorting';

type ProgressBarProps = {
  label: string;
  percentage: number;
  fillColor?: string;
  emptyColor?: string;
};

type WorkAreaRouteProgress = {
  routeName: string;
  completionRate: number;
};

function ProgressBar({ label, percentage, fillColor, emptyColor }: ProgressBarProps) {
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
          backgroundImage: `linear-gradient(to right, var(${fillColor ? fillColor : '--progress-full'}) ${percentage}%, var(${emptyColor ? emptyColor : '--progress-empty'}) ${percentage ? percentage + 2 : 0}%)`,
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
  const workAreaRouteProgress = Object.entries(status).reduce<Record<string, WorkAreaRouteProgress[]>>(
    (progressByArea, [routeName, workAreas]) => {
      Object.entries(workAreas).forEach(([workAreaName, completionRate]) => {
        progressByArea[workAreaName] ??= [];
        progressByArea[workAreaName].push({ routeName, completionRate });
      });

      return progressByArea;
    },
    {},
  );
  const sortedWorkAreaRouteProgress = Object.entries(workAreaRouteProgress)
    .sort(([firstWorkArea], [secondWorkArea]) => firstWorkArea.localeCompare(secondWorkArea))
    .map(
      ([workAreaName, routeProgress]) =>
        [
          workAreaName,
          [...routeProgress].sort((firstRoute, secondRoute) =>
            compareRouteNames(firstRoute.routeName, secondRoute.routeName),
          ),
        ] as const,
    );
  const sortedRouteWorkAreaProgress = Object.entries(status)
    .sort(([firstRoute], [secondRoute]) => compareRouteNames(firstRoute, secondRoute))
    .map(
      ([routeName, workAreas]) =>
        [
          routeName,
          Object.entries(workAreas).sort(([firstWorkArea], [secondWorkArea]) =>
            firstWorkArea.localeCompare(secondWorkArea),
          ),
        ] as const,
    );

  return (
    <section className="region-status-detailed">
      <div className="region-header">
        <h2>{regionName}</h2>
        <ProgressBar label={regionName} percentage={overallPercentage} />
      </div>
      <div>
        <h3>{showRouteProgress ? 'Progress by Route' : 'Progress by Work Area'}</h3>
        <ul className={showRouteProgress ? 'region-status-route-list' : undefined}>
          {showRouteProgress
            ? sortedRouteWorkAreaProgress.map(([routeName, workAreas]) => {
                const completionRates = workAreas.map(([, completionRate]) => completionRate);
                const completionRate =
                  completionRates.reduce((total, rate) => total + rate, 0) / completionRates.length;

                return (
                  <li key={routeName} className="region-status-route">
                    <details>
                      <summary>
                        <span>{routeName}</span>
                        <ProgressBar label={routeName} percentage={Math.floor(completionRate * 100)} />
                      </summary>
                      <ul className="region-status-route-work-areas">
                        {workAreas.map(([workAreaName, workAreaCompletionRate]) => (
                          <li key={workAreaName}>
                            <span>{workAreaName}</span>
                            <ProgressBar
                              label={`${routeName} ${workAreaName}`}
                              percentage={Math.floor(workAreaCompletionRate * 100)}
                              fillColor="--accent-border"
                              emptyColor="--accent-border2"
                            />
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              })
            : sortedWorkAreaRouteProgress.map(([workAreaName, routeProgress]) => {
                const completionRates = routeProgress.map(({ completionRate }) => completionRate);
                const completionRate =
                  completionRates.reduce((total, rate) => total + rate, 0) / completionRates.length;

                return (
                  <li key={workAreaName} className="region-status-work-area">
                    <details>
                      <summary>
                        <span>{workAreaName}</span>
                        <ProgressBar label={workAreaName} percentage={Math.floor(completionRate * 100)} />
                      </summary>
                      <ul className="region-status-work-area-routes">
                        {routeProgress.map(({ routeName, completionRate: routeCompletionRate }) => (
                          <li key={routeName}>
                            <span>{routeName}</span>
                            <ProgressBar
                              label={`${workAreaName} ${routeName}`}
                              percentage={Math.floor(routeCompletionRate * 100)}
                              fillColor="--accent-border"
                              emptyColor="--accent-border2"
                            />
                          </li>
                        ))}
                      </ul>
                    </details>
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
