import express from 'express'

import nearest_neighbors from './nearest_neighbors'

const NEAREST_NEIGHBOR_ROUTE = '/nearest-neighbors'

const api_router = express.Router()

// Receive the locations as a pipe-separated list in the "locations" query parameter, return the list of neighbors.
api_router.get(NEAREST_NEIGHBOR_ROUTE, (req, res) => {
  const location_str = req.query.locations
  if (!location_str) {
    res.status(400)
    res.send('Error: Must define the locations query parameter as a pipe-separated list of locations.')
    return
  }
  const locations: Array<string> = location_str.split('|')
  res.json({neighbors: nearest_neighbors(locations)})
})

// Receive the locations as a JSON array in a POST request body, return the list of neighbors.
// Could be part of the GET request instead to more closely follow REST guidelines,
// but sending request bodies in a GET request is uncommon.
api_router.post(NEAREST_NEIGHBOR_ROUTE, (req, res) => {
  const locations = req.body
  if (locations.constructor !== Array || !locations.length || !locations.every((l: any) => typeof l === 'string')) {
    res.status(400)
    res.send('Error: Request body must be a non-empty JSON-formatted array of strings representing the list of locations.')
    return
  }
  res.json({neighbors: nearest_neighbors(locations)})
})

export default api_router
