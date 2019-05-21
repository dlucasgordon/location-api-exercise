# Location API Exercise

This project is a solution to the exercise given here: https://hastebin.com/podujequme.md. The instructions are repeated below.

## Instructions

##### Description

Create a single endpoint API using Node.js, and the framework of your choice, that allows you to perform the following operations:

1. Call the endpoint and pass an array of locations
2. For every location in the array, calculate which location from the same array is closest
3. Return the list of pairs


##### Requirements

- Build a performant, clean, and well-structured solution
- Make your API public. Deploy it using the service of your choice (e.g. Zeit, AWS, Heroku, GCP)
- Create a **README.md** that explains the project, its features, and how to run it
- Host the project on Github
- Commit early and often. We want to be able to see your progress


##### Other considerations

- One or more locations might not exist
- Speed of the endpoint
- Payloads can contain 50-100 locations
- Locations might not be formatted. e.g. "The Statue of Liberty"
- Feel free to add additional features if you have the time and inspiration


## Explanation of Solution

This solution was written in TypeScript, and uses Express.js. It is hosted with Heroku.

It goes slightly beyond the requirements of the assignment by giving the distance (in kilometers) between each pair of neighbors, as well as providing the coordinates and formatted address for each location. TypeScript was also not a requirement.

At a high-level, each api call triggers the following steps:

1. Receive a list of string locations. These can be addresses, names such as "The Statue of Liberty", or even state codes such as "CA". The locations are submitted to the api endpoint at `/api/nearest-neighbors`, in either a GET or POST request. If submitted via a POST request, they are sent in JSON format in the request body. To test this for example, you could run: 

    ```
    curl -X POST -d '["San Francisco, CA", "New York, NY"]' -H "Content-Type: application/json" http://localhost:5000/api/nearest-neighbors
    ```

    If submitted via a GET request, they are sent as a pipe-separated list of values in the `locations` query parameter, ie this url:

    ```
    localhost:5000/api/nearest-neighbors?locations=San%20Francisco,%20CA|New%20York,%20NY
    ```

2. Geocode each location via the Google Maps geocoding API, to obtain latitude and longitude coordinates, as well as a formatted address string. Note that some locations will not be able to be geocoded, and will have `null` values for their coordinates and formatted address.

3. Using the coordinates, calculate the [nearest neighbor](https://en.wikipedia.org/wiki/Nearest_neighbor_search) for each location. Locations which could not be geocoded will be ignored, and given null values for their nearest neighbor and distance. To calculate the distance between two sets of geographical coordinates, the project uses a geodistance calculation provided by the [geolib](https://github.com/manuelbieh/Geolib) module. A naive approach to calculating each nearest neighbor would be to simply calculate the distance from every location to every other location, which would take O(n^2) time. A more performant solution can be achieved however using a [k-d-tree](https://en.wikipedia.org/wiki/K-d_tree). Constructing the tree containing all locations takes O(n log n) time on average. Looking up the nearest neighbors in the tree for a given location is O(log n) on average, so finding the nearest neighbors for all the locations is O(n log n) on average. The project uses a k-d-tree implementation provided by the [k-d-tree](https://github.com/csbrandt/kd-tree-javascript) module.

4. Return the list of neighbors, and the geocoding information for each location. Here is a sample response:
    ```
    {  
      "neighbors":[  
        {  
          "name":"San Francisco, CA",
          "nearest_neighbor":"New York, NY",
          "distance":"4139.148km"
        },
        {  
          "name":"New York, NY",
          "nearest_neighbor":"Boston, MA",
          "distance":"306.491km"
        },
        {  
          "name":"Boston, MA",
          "nearest_neighbor":"New York, NY",
          "distance":"306.491km"
        }
      ],
      "location_info":[  
        {  
          "name":"San Francisco, CA",
          "address":"San Francisco, CA, USA",
          "coordinates":[  
            37.7749295,
            -122.4194155
          ]
        },
        {  
          "name":"New York, NY",
          "address":"New York, NY, USA",
          "coordinates":[  
            40.7127753,
            -74.0059728
          ]
        },
        {  
          "name":"Boston, MA",
          "address":"Boston, MA, USA",
          "coordinates":[  
            42.3600825,
            -71.0588801
          ]
        }
      ]
    }
    ```

## Setup

The project relies on two environment variables, `PORT`, and `GOOGLE_GEOCODE_KEY`, which are loaded via the `dotenv` package from a `.env` file. This file is not part of the project, and must be created. A template `.env` file is provided to assist this, `dotenv_template`. You must obtain and provide your own [Google Maps geocoding](https://developers.google.com/maps/documentation/geocoding/start) api key.

After creating the `.env` file, you can run the project by first running `yarn build` to transpile the TypeScript code to JavaScript, then `yarn start` to run the transpiled application. You can also use `yarn dev` to dynamically transpile and reload the code each time the code changes, which is useful during development.

The project can also be easily served via Heroku, with the included `Procfile`. In this case you will not create a `.env` file manually. Heroku will automatically set the `PORT` variable, but you will have to set the `GOOGLE_GEOCODE_KEY` environment variable manually in the Heroku dashboard. You will also have to set the `YARN_PRODUCTION` environment variable to `false` in the dashboard to prevent Heroku from pruning the dev dependencies during deployment, which will break TypeScript transpilation.

## Possible Improvements

- The main performance bottleneck of the application is in obtaining the geocode data from Google. Google does not provide a way to request geocoding info in batch, so the information for each location must be requested separately. There are other providers which do offer this ability, however their accuracy is generally not as good, for example they will not be able to locate "The Statue of Liberty". The Bing Maps geocoding service may be a good alternative, with good accuracy, and ability to request in batch. There is significant overhead in doing this however, as one must send several separate requests to start a job, check its status, and finally get the results. So for the limited size of this project, 50-100 addresses, Google Maps seemed to be the best solution.
- Error handling could be improved.
- If the project design was changed to work with much larger datasets, and a batch geocoding solution was used such as Bing Maps, then the k-d-tree nearest neighbor algorithm may be a bottleneck, as the library used in the project is written in JavaScript. More performant solutions are available, such as [this one](https://github.com/justinethier/node-kdtree), which is a node wrapper for the kdtree C library.

