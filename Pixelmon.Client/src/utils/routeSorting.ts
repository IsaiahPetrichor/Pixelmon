export function compareRouteNames(firstRouteName: string, secondRouteName: string): number {
  const firstRoute = firstRouteName.match(/^route\s+(\d+)$/i);
  const secondRoute = secondRouteName.match(/^route\s+(\d+)$/i);

  if (firstRoute && secondRoute) {
    return Number(firstRoute[1]) - Number(secondRoute[1]);
  }

  return firstRouteName.localeCompare(secondRouteName);
}
