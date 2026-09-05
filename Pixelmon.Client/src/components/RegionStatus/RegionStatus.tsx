import { use } from 'react';
import type { RegionStatus } from './RegionStatus.types';

const statusPromise = fetch(`http://localhost:5172/KantoStatus`).then((res) => res.json());

function StatusComponent() {
  const status: RegionStatus = use(statusPromise);

  return <div>Current Kanto status is: {status.message}</div>;
}

export default StatusComponent;
