import { Router } from 'express'
import asyncHandler from 'express-async-handler'

import geocode from './geocode'
import nearest_neighbors from './nearest_neighbors'
import { FmtdNeighbor, Location, LocationName, Neighbor, NeighborResponse } from './types/types'

const NEAREST_NEIGHBOR_ROUTE = '/nearest-neighbors'
const GET_ERR_MSG  = 'Error: Must define the locations query parameter as a pipe-separated list of locations, with at least two locations.'
const POST_ERR_MSG = 'Error: Request body must be a non-empty JSON-formatted array of strings representing the list of locations, with at least two locations.'

const api_router = Router()

// Receive the location names as a pipe-separated list in the "locations" query parameter, return the list of neighbors.
api_router.get(NEAREST_NEIGHBOR_ROUTE, asyncHandler(async (req, res) => {
  const location_str = req.query.locations
  const location_names = !location_str ? [] : location_str.split('|').filter(Boolean)
  if (location_names.length < 2) {
    res.status(400).send(GET_ERR_MSG)
  }
  res.json(await get_neighbor_response(location_names))
}))

// Receive the location names as a JSON array in a POST request body, return the list of neighbors.
// Could be part of the GET request instead to more closely follow REST guidelines,
// but sending a request body in a GET request is uncommon.
api_router.post(NEAREST_NEIGHBOR_ROUTE, asyncHandler(async (req, res) => {
  const location_names = req.body.constructor !== Array ? [] : req.body.filter(Boolean)
  if (location_names.length < 2 || !location_names.every((l: any) => typeof l === 'string')) {
    res.status(400).send(POST_ERR_MSG)
  }
  res.json(await get_neighbor_response(location_names))
}))

const get_neighbor_response = async (location_names: Array<LocationName>): Promise<NeighborResponse> => {
  const locations: Array<Location> = await geocode(location_names)
  const neighbors: Array<Neighbor> = nearest_neighbors(locations)
  return {neighbors: formatNeighbors(neighbors), location_info: locations}
}

// Change distance from number of meters to a string with number of kms and the unit
const formatNeighbors = (neighbors: Array<Neighbor>): Array<FmtdNeighbor> =>
  neighbors.map(n => ({...n, distance: `${(n.distance / 1000)}km`}))

export default api_router
