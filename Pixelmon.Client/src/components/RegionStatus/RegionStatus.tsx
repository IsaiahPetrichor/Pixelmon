import { useEffect, useState } from 'react';
import type { RegionStatus } from './RegionStatus.types';

function RegionStatusComponent({ regionId }: { regionId: string }) {
  const [status, setStatus] = useState<RegionStatus>();

  useEffect(() => {
    const response: Promise<RegionStatus> = fetch(`http://localhost:5172/RegionStatus/GetKantoStatus`).then((res) => {
      return res.json();
    });

    response.then((data) => setStatus(data));
  }, [regionId]);

  return (
    <div>
      Current {status?.regionName} status is: {status?.message}
    </div>
  );
}

export default RegionStatusComponent;
