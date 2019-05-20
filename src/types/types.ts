export type LocationName      = string
export type Distance          = number // Distance in meters
export type Coords            = [number, number] // Latitude, longitude

export type UnknownLocation   = {name: LocationName, address: null,   coordinates: null}
export type KnownLocation     = {name: LocationName, address: string, coordinates: Coords}
export type Location          = KnownLocation | UnknownLocation

export type UnknownNeighbor   = {name: LocationName, nearest_neighbor: null,         distance: null}
export type KnownNeighbor     = {name: LocationName, nearest_neighbor: LocationName, distance: Distance}
export type FmtdKnownNeighbor = {name: LocationName, nearest_neighbor: LocationName, distance: string} // Format distance with unit, ie '15km'
export type Neighbor          = KnownNeighbor | UnknownNeighbor
export type FmtdNeighbor      = FmtdKnownNeighbor | UnknownNeighbor

// Formatted data to be returned from the api
export type NeighborResponse = {
  neighbors: Array<FmtdNeighbor>,
  location_info: Array<Location>
}