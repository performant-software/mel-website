

# Melville Electronic Library (MEL)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b90121c1-dd40-44a8-b1ad-f7047aadfa06/deploy-status)](https://app.netlify.com/sites/mel/deploys)

This is the MEL website, originally developed at Hofstra University. 

## Running site locally

Require Ruby 2.3 or higher. Uses [Jekyll](https://jekyllrb.com/) for static site rendering. Currently deployed via [Netlify](netlify.com). To deploy locally, setup a ruby environment, obtain the Netlify CLI tool and then run:

```
bundle
netlify dev
```

## Running whale.js

In the scripts directory, `whale.js` takes the XML chapter files and creates static HTML versions of them. 

To install, go to the scripts dir and run `yarn`. 

To run, place the XML in the `xml` folder and then run `yarn start`. The HTML versions will output in the `editions` dir. 

