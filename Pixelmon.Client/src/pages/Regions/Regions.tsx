import { ErrorBoundary } from 'react-error-boundary';
import RegionStatusComponent from '../../components/RegionStatus/RegionStatus';
import type { RegionStatus } from '../../components/RegionStatus/RegionStatus.types';
import { Suspense, useEffect, useState } from 'react';

type DetailedRegionStatus = Record<string, RegionStatus>;

function Regions() {
  const [status, setStatus] = useState<DetailedRegionStatus>();

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  //   const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

  useEffect(() => {
    const response = fetch(`${apiBaseUrl}/RegionStatus/GetDetailedStatus`).then((res) => {
      return res.json();
    });

    response.then((data) => {
      console.log(data);
      return setStatus(data);
    });
  }, [apiBaseUrl]);

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong while loading the region status.</div>}>
        <Suspense fallback={<div>Loading region status...</div>}>
          <RegionStatusComponent regionName="Kanto" status={status?.Kanto ?? {}} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default Regions;
