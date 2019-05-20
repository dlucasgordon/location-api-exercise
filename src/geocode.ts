import gmaps from '@google/maps'

import { Location, LocationName } from './types/types'

const client = gmaps.createClient({
  key: process.env.GOOGLE_GEOCODE_KEY,
  Promise,
})

// Given a array of location names, which could be names, addresses, etc, query the google maps geocoding api
// and return an array of tuples containing both the original location name and a tuple containing the lat and lng
const geocode = async (location_names: Array<LocationName>): Promise<Array<Location>> => {
  const promises: Array<Promise<any>> = location_names.map(name =>
    client.geocode({address: name}).asPromise()
  )
  return await Promise.all(promises)
  .catch(err => { 
      console.error(err)
      throw new Error(err.json.error_message)
  })
  .then(responses =>
    responses.map((res, i) => {
      if (!res.json.results.length) {
        return {name: location_names[i], address: null, coordinates: null} 
      }
      const result = res.json.results[0]
      const {lat, lng} = result.geometry.location
      return {name: location_names[i], address: result.formatted_address, coordinates: [lat, lng]} 
    })
  )
}

export default geocode
