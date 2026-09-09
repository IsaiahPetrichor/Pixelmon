export type WorkItem = {
  id: number;
  regionId: number;
  routeId: number;
  assignedToId: number;
  workAreaId: number;
  statusId: number;
  shortDescription: string;
  longDescription: string | null;
};
