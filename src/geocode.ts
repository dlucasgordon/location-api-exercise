import gmaps from '@google/maps'

import { Location, LocationRef } from './types'

const client = gmaps.createClient({
  key: process.env.GOOGLE_GEOCODE_KEY,
  Promise,
})

// Given a array of location references in string format, which could be names, addresses, etc, query the google maps geocoding
// api and return an array of tuples containing both the original location ref and a tuple containing the lat and lng
const geocode = async (location_refs: Array<LocationRef>): Promise<Array<Location>> => {
  const promises: Array<Promise<any>> = location_refs.map(ref =>
    client.geocode({address: ref}).asPromise()
  )
  return await Promise.all(promises).then(responses =>
    responses.map((res, i) => {
      const {lat, lng} = res.json.results[0].geometry.location
      return [location_refs[i], [lat, lng]]
    })
  )
}

export default geocode
