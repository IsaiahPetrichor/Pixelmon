import { ErrorBoundary } from 'react-error-boundary';
import RegionStatusComponent from '../../components/RegionStatus/RegionStatus';
import { Suspense } from 'react';

function Regions() {
  return (
    <>
      <h2>Kanto</h2>
      <ErrorBoundary fallback={<div>Something went wrong while loading the region status.</div>}>
        <Suspense fallback={<div>Loading region status...</div>}>
          <RegionStatusComponent regionId="Kanto" />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default Regions;
