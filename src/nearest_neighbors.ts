import { getDistance, PositionAsDecimal } from 'geolib'
import KDTree from 'k-d-tree'

import { KnownLocation, Location, Neighbor } from './types/types'

// To find the nearest neighbor of each location, we first construct a k-d-tree (en.wikipedia.org/wiki/K-d_tree) containing all
// the locations, which takes O(n log n) time on average. Looking up the nearest neighbors in the tree for a given location
// is O(log n) on average, so finding the nearest neighbors for all the locations is O(n log n) on average.
// If the location is an UnknownLocation, then return an UnknownNeighbor.
const nearest_neighbors = (locations: Array<Location>): Array<Neighbor> => {
  const known_locations: Array<KnownLocation> = locations.filter(l => l.coordinates)
  const tree = new KDTree(known_locations, geodistance)
  const neighbors: Array<Neighbor> = locations.map(l => {
    if (!l.coordinates) {
      return {name: l.name, nearest_neighbor: null, distance: null}
    }
    // Since the location is already in the tree, we need to get the second-closest, and results are ranked from far to near,
    // so the 0th result is usually the correct one. However if there are multiple locations with the same coordinates, then
    // we'll need to check which one is the correct one.
    const neighbors = tree.nearest(l, 2)
    const [nearest, distance] = neighbors[0][0].name !== l.name ? neighbors[0] : neighbors[1]
    return {name: l.name, nearest_neighbor: nearest.name, distance}
  })
  return neighbors
}

// Calculate distance in meters between two locations
const geodistance = (p1: Location, p2: Location): number => {
  const formatCoords = (p: Location): PositionAsDecimal => {
    const [latitude, longitude] = p.coordinates
    return {latitude, longitude}
  }
  return getDistance(formatCoords(p1), formatCoords(p2))
}

export default nearest_neighbors
