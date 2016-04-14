Servo Console
=============

## Web Console
This is the UI that communicates with `servo-gateway` and presents everything in a readable way.

It is a static website so it can be uploaded to S3 and served directly from there. There is no special set-up here other than configuring constants under `lib/constants/orgs.js` & `/lib/constants/regions.js`. There are `.sample` files to guide you on how they should be set-up. These files will map particular org+regions to the proper endpoints.

## Setup local development environment
To setup a local development environment simply run the following commands
and then access the site at http://localhost:4000
```
npm install
npm run develop
```

## Build static app
When ready to deploy the app on a static web server, run `npm run build` and
copy the assets from the /build directory to the web server.

## [Contributors](https://github.com/dowjones/servo-docs/blob/master/Contributors.md)

## Related Repos
* [servo-docs](https://github.com/dowjones/servo-docs)
* [servo-core](https://github.com/dowjones/servo-core)
* [servo-gateway](https://github.com/dowjones/servo-gateway)

## License
[MIT](LICENSE)
