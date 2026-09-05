import { ErrorBoundary } from 'react-error-boundary';
import StatusComponent from '../RegionStatus/RegionStatus';
import { Suspense } from 'react';

function Regions() {
  return (
    <>
      <h1>KANTO BABY</h1>
      <ErrorBoundary fallback={<div>Something went wrong while loading the region status.</div>}>
        <Suspense fallback={<div>Loading region status...</div>}>
          <StatusComponent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default Regions;
