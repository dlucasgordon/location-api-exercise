import geocode from './geocode'

const nearest_neighbors = (locations: Array<string>): Array<[string, string]> => {
  const loc_coords: Array<[string, number, number]> = geocode(locations)
  const neighbors: Array<[string, string]> = []
  return neighbors
}

export default nearest_neighbors
