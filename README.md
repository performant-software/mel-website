

# Melville Electronic Library (MEL)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b90121c1-dd40-44a8-b1ad-f7047aadfa06/deploy-status)](https://app.netlify.com/sites/mel/deploys)

This is the code repository for the [Melville Electronic Library website](https://melville.electroniclibrary.org/), originally developed at Hofstra University. 

## Installing locally

Require Ruby 2.3 or higher. Uses [Jekyll](https://jekyllrb.com/) for static site rendering. Currently deployed via [Netlify](netlify.com). To deploy locally, setup a ruby environment and then run:

```
bundle
yarn
```

## Running locally

To run the site locally:

```
yarn build
yarn start
```

## Updating XML

Once the site is running locally, you can view changes to the local XML files by running `yarn build`. The XML sources are stored in the `xml` directory. The `originals` directory contains the XML output from Juxta Editions and should not be changed.
 
