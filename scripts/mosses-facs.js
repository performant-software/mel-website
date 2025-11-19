const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

async function run() {
    // read in the file
    const originalsPath = 'xml/hawthorne-and-his-mosses/mosses_mel_reading.xml'
    const facsPath = 'xml/hawthorne-and-his-mosses/mossesFolios.xml'
    const xmlPath = 'xml/hawthorne-and-his-mosses/mosses_mel.xml'
    const fileContents = fs.readFileSync(originalsPath, "utf8")

    // load the facs data so we can crosswalk from the xml:ids to URLs of surfaces
    const facsXML = fs.readFileSync(facsPath, "utf8");
    const facsDOM = new JSDOM(facsXML, { contentType: "text/xml" })
    const facsDoc = facsDOM.window.document

    // wrap the body contents in a div with the chapter ID and head that is the title
    const xmlDOM = new JSDOM(fileContents, { contentType: "text/xml" })
    const xmlDoc = xmlDOM.window.document
    
    const pbs = xmlDoc.getElementsByTagName('pb')
    for( let i=0; i < pbs.length; i++ ) {
        const pb = pbs[i]
        const imageID = pb.getAttribute('facs')
        // find the corresponding facsimile
        const surfaceEl = facsDoc.querySelectorAll(`surface[xml:id="${imageID.replaceAll('#', '')}"]`);
        console.log(surfaceEl);
        if( surfaceEl && surfaceEl.length > 0) {
            const graphicEl = surfaceEl[0].querySelector('graphic')
            const imageURL = graphicEl.getAttribute('url')
            console.log(imageID, imageURL)
            pb.setAttribute('corresp', imageID.replaceAll('#', ''))
            pb.setAttribute('facs', imageURL)
        }
    }    
    const xmlContent = xmlDoc.documentElement.outerHTML
    const content = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`
    fs.writeFileSync(xmlPath, content, "utf8")        
}

// Guppy remaps @tl_leaf attributes to @corresp
function main() {
    run().then(() => {
        let date = new Date();
        console.info(`Finished at ${date.toLocaleTimeString()}.`)
    }, (err) => {
        let date = new Date();
        console.info(`Stopped at ${date.toLocaleTimeString()}.`)
        console.error(`${err}: ${err.stack}`)  
    });
}

///// RUN THE SCRIPT
main()
