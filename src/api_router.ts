import asyncHandler from 'express-async-handler'
import { Router } from 'express'

import geocode from './geocode'
import nearest_neighbors from './nearest_neighbors'
import { Location, LocationRef, NeighborPair } from './types'

const NEAREST_NEIGHBOR_ROUTE = '/nearest-neighbors'

const api_router = Router()

// Receive the location references as a pipe-separated list in the "locations" query parameter, return the list of neighbors.
api_router.get(NEAREST_NEIGHBOR_ROUTE, asyncHandler(async (req, res) => {
  const location_str = req.query.locations
  if (!location_str) {
    res.status(400)
    res.send('Error: Must define the locations query parameter as a pipe-separated list of locations.')
    return
  }
  const locations: Array<string> = location_str.split('|')
  const neighbors = await get_neighbors(locations)
  res.json({neighbors})
}))

// Receive the location references as a JSON array in a POST request body, return the list of neighbors.
// Could be part of the GET request instead to more closely follow REST guidelines,
// but sending a request body in a GET request is uncommon.
api_router.post(NEAREST_NEIGHBOR_ROUTE, asyncHandler(async (req, res) => {
  const locations = req.body
  if (locations.constructor !== Array || !locations.length || !locations.every((l: any) => typeof l === 'string')) {
    res.status(400)
    res.send('Error: Request body must be a non-empty JSON-formatted array of strings representing the list of locations.')
    return
  }
  const neighbors = await get_neighbors(locations)
  res.json({neighbors})
}))

const get_neighbors = async (location_refs: Array<LocationRef>): Promise<Array<NeighborPair>> => {
  const locations: Array<Location> = await geocode(location_refs)
  console.log(locations)
  return nearest_neighbors(locations)
}

export default api_router
