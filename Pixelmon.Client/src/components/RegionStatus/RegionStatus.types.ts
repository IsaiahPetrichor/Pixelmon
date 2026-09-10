export type RegionStatus = Record<string, Record<string, number>>;

export type RegionStatusComponentProps = {
  regionName: string;
  status: RegionStatus;
};
