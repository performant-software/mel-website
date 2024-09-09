

# Melville Electronic Library (MEL)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b90121c1-dd40-44a8-b1ad-f7047aadfa06/deploy-status)](https://app.netlify.com/sites/mel/deploys)

This is the code repository for the [Melville Electronic Library website](https://melville.electroniclibrary.org/), originally developed at Hofstra University. 

## Installing locally

Requires Ruby 3.1.2. Uses [Jekyll](https://jekyllrb.com/) for static site rendering. Currently deployed via [Netlify](netlify.com). To deploy locally, setup a ruby environment, duplicate `.env.example` and rename it `.env`. Then run:

```
bundle
yarn
```

## Running locally

To run the site locally, run the following commands:

```
yarn build
yarn start
```

## Updating XML

Once the site is running locally, you can view changes to the local XML files by running `yarn build`. The XML sources are stored in the `xml` directory. The `originals` directory contains the XML output from Juxta Editions and should not be changed.
 
## Updating Versions of Billy Budd MS

The "Versions of Billy Budd" manuscript is encoded in TEI/XML originally produced using TextLab. It uses EditionCrafter for display of the text and requires a command line tool to be run in order to generate the necessary artifacts, which are checked into the project repository. To update the text, work with the xml in this file: `xml/versions-of-billy-budd/bb-ms.xml`. Once you have made your changes, regenerate the artifacts using the following command from the base directory of the repository:

`editioncrafter process xml/versions-of-billy-budd/bb-ms.xml ec https://melville.electroniclibrary.org/ec`

Because of the large number of files this generates, when you go to commit them using git, you may encounter an error. To fix this, increase the POST buffer size for git:

`git config http.postBuffer 524288000`

Expect this command to take several seconds to run on a text of this size and complexity. The output of this script can be found in the `ec` directory.