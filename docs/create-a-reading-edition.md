# How to add a new Edition to the website

This document will walk you step by step through adding a new reading text and EditionCrafter viewer to the website. Before you embark on this quest, you should be equipped with the following:
- A IIIF manifest for the set of images that make up the text(s) you wish to display in EditionCrafter;
- For each chapter of the reading edition, a TEI document containing the chapter's text and including tagged `<pb>` elements as needed to indicate the beginning of a new page/surface in the EditionCrafter edition. (See below for more detail about these `<pb>` elements.)

You should also make sure you have the EditionCrafter CLI installed. If you don't, you can install it with
```npm install @cu-mkp/editioncrafter-cli```

Finally, create a folder for your edition in the `xml` folder in this repository; this is where most of the relevant files will end up living.

## Preparing the EditionCrafter files

### Use EditionCrafter CLI to create a TEI file from your image manifest
Run the following command from the root directory of this repository:
```editioncrafter iiif -i <YOUR MANIFEST URL> -o <OUTPUT PATH>```

Here the output path should be something like `xml/my-new-edition/my-new-edition-ec.xml`. This will create a TEI file containing `surface` elements for each of the images in your manifest.

### Add transcriptions, annotations, etc. to your TEI file
Using the method of your choice (for example, the FairCopy editor), you can now take the file created in the previous text and add whatever markup or transcriptions you desire. Once you've added whatever text elements or metadata you want, update the file in the `xml` folder of this repo with the completed version. (If you are using FairCopy to do your editing, this can be done by exporting your project as XML and saving the exported file in the desired place.)

### Create EditionCrafter artifacts
Once you have your completed TEI file, run the following command to create the files necessary for EditionCrafter to render your edition:
```editioncrafter process -i <YOUR TEI FILE> -o ec -u https://melville.electroniclibrary.org/ec```

In the example from above, here `<YOUR TEI FILE>` would be `xml/my-new-edition/my-new-edition-ec.xml`, which you've edited in the previous step. Running this command will create a directory called `my-new-edition-ec` (that is, whatever the actual file name is) inside the `ec` folder. That folder contains everything the EditionCrafter viewer needs to display your edition.

## Preparing the reading text files and index

As mentioned, you will need one TEI file for each chapter of the reading text. These should live in `xml/my-new-edition` (again, obviously, substitute whatever your actual folder name is).

### Create the index file
In your `xml/my-new-edition` folder, create a file called `__index__.json` that looks like this:
```
{
    "title": "The Title of My New Edition!",
    "tl_leaf": true,
    "iiif": true,
    "chapters": [
        "intro.xml",
        "chapter1.xml",
        "epilogue.xml"
    ]
}
```
The chapters listed in this file are what will show up in your reading text. Make sure they all exist in the folder.

### Add `<pb>` elements to your chapter files

This is the key step to make the thumbnails in the margin of the reading edition work. In the TEI file for each chapter, use your favorite TEI editing tool to add a `<pb>` element at the appropriate points corresponding to the beginning of each page in the EditionCrafter edition, pointing to the image link and XML ID of the corresponding surface as follows:

If you have the following surface element in your EditionCrafter TEI file...
```
<surface xml:id="f000" ulx="0" uly="0" lrx="1560" lry="2560"
  sameAs="https://iiif-cloud-production.herokuapp.com/public/resources/cc1a92a1-5634-4b49-b618-9614aa1b4e37/page/1">
  <label xml:lang="en">001.tiff</label>
  <graphic mimeType="application/json"
      url="https://iiif.archivengine.com/iiif/3/xmvd680rsanz94duuo1e8rx1kn34;1" />
</surface>
```
...then in the TEI file for the relevant chapter you should add the page beginning element...
```
<pb facs="https://iiif.archivengine.com/iiif/3/xmvd680rsanz94duuo1e8rx1kn34;1" corresp="f000"/>
```

Note that the `facs` attribute should point to the `url` from the `graphic` element inside the surface.

#### If you are using the variorum feature of EditionCrafter

A quick note that if you are using the variorum feature of EditionCrafter to display multiple different resources in the same viewer, then you should preface the `corresp` attribute accordingly using the ID of whichever resource it corresponds to. For example if your `documentInfo` prop in EditionCrafter will look like...
```
documentInfo: {
  manuscript: {
    ...
  },
  print: {
    ...
  }
}
```
...then your `pb` element would become, say, `<pb corresp="manuscript_f000"/>`.

## Adding your edition to the website

We now have all the ingredients ready to actually put the edition on the website.

### Create a new template file
In the `scripts` directory, make a copy of `bb-ms-template.js`, naming it with reference to your new edition. In the new file, change the name of the function by replacing `bbMS` with some identifier of your new edition, and update the export at the bottom of the file accordingly to match. Edit line 17 of the file to contain the link and title of the new edition; for example the new line might read
```<p><a href="/editions.html">Melville Electronic Library</a> >> <a href="${baseURL}/editions/my-new-edition/intro.html">My New Edition</a> >> Manuscript </p>```

Finally, edit lines 30-35 to pass the correct information for your edition to the EditionCrafter viewer. The `iiifManifest` should point to the `/iiif/manifest.json` file inside the `ec` directory that you created earlier. The keys of the `transcriptionTypes` object should be the `xml:id`s of the text resources you added. See EditionCrafter documentation for more details.

### Update `whale.js` script
The script `scripts/whale.js` runs when the site is built, and it will do the work of actually creating the HTML page for each chapter of the reading text, as well as the page that displays the EditionCrafter viewer. Mimic what's been done for the Billy Budd and Mosses editions to add your new edition to this script:
- Near line 11, add the function you exported from the template file to the list of imports:
```
const { bbMSPageTemplate } = require("./bb-ms-template")
const { mossesMSPageTemplate } = require("./mosses-template")
const { newMSPageTemplate } = require("./new-ed-template")
```
- Around line 85, add a method for creating the EditionCrafter viewer page for your edition:
```
async function addNewEditionCrafterPage() {
    const baseURL = process.env.DEPLOY_PRIME_URL
    const dev = !!process.env.DEV_MODE
    const html = newMSPageTemplate(baseURL,dev)
    fs.writeFileSync("editions/my-new-edition/new-ed-ms.html", html, "utf8")
}
```
Again, of course, replacing my placeholders of `new` or `new-ed` with the identifier of your edition.

- Around line 119, update the `run()` method to have it create the pages for your edition:
```
async function run() {
    dirExists('editions')
    dirExists('editions/versions-of-billy-budd')
    dirExists('editions/battle-pieces')
    dirExists('editions/versions-of-moby-dick')
    dirExists('editions/hawthorne-and-his-mosses')
    dirExists('editions/my-new-edition') //for consistency this should match the folder name for your edition inside the xml folder, but doesn't technically have to
    await processDocs('xml/versions-of-billy-budd','editions/versions-of-billy-budd', 'billy-budd-ms.html')
    await processDocs('xml/battle-pieces','editions/battle-pieces')
    await processDocs('xml/versions-of-moby-dick','editions/versions-of-moby-dick')
    await processDocs('xml/hawthorne-and-his-mosses','editions/hawthorne-and-his-mosses', 'mosses-ms.html')
    await processDocs('xml/my-new-edition', 'editions/my-new-edition', 'new-ed-ms.html') //the third parameter here should match the file name from the last line of your addEditionCrafterPage function above
    await addBBEditionCrafterPage()
    await addMossesEditionCrafterPage()
    await addNewEditionCrafterPage() //or whatever you named this function in the previous step
}
```

### Update various site menus to point at your edition
You can add links to the new edition by editing the `_includes/section-editions-banner.html` file accordingly.

## Deploy your changes
You're done! Simply commit all of these changes to the `master` branch of the repo and push your changes to GitHub. The site will automatically be redeployed on Netlify and your changes will be live.



