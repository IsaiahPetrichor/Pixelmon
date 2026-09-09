import { useEffect, useState } from 'react';
import type { RegionStatus } from './RegionStatus.types';

function RegionStatusComponent({ regionId }: { regionId: string }) {
  const [status, setStatus] = useState<RegionStatus>();

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  //   const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;

  useEffect(() => {
    const response: Promise<RegionStatus> = fetch(`${apiBaseUrl}/RegionStatus/GetKantoStatus`).then((res) => {
      return res.json();
    });

    response.then((data) => setStatus(data));
  }, [apiBaseUrl, regionId]);

  return (
    <div>
      Current {status?.regionName} status is: {status?.message}
    </div>
  );
}

export default RegionStatusComponent;
