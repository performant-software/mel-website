const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

async function run() {
    // read in the file names for each edition
    const originalsPath = 'xml/versions-of-billy-budd'
    const xmlPath = 'temp/guppy-output'
    const dirContents = fs.readdirSync(originalsPath, {withFileTypes: true});

    // load the manuscript so we can crosswalk from the filenames to the xml:ids of surfaces
    const bbMSXML = fs.readFileSync(`${originalsPath}/bb-ms.xml`, "utf8");
    const bbMSDOM = new JSDOM(bbMSXML, { contentType: "text/xml" })
    const bbMSDoc = bbMSDOM.window.document

    // now go through all the chapter xmls, adding a @corresp attribute and removing @tl_leaf
    for( let i=0; i < dirContents.length; i++ ) {
        const sourceDirEnt = dirContents[i];
        const filename = sourceDirEnt.name

        if( filename.endsWith('.xml') && filename !== 'bb-ms.xml' ) {
            const sourcePath = `${originalsPath}/${filename}`
            console.log(`Converting ${sourcePath}`)
    
            // wrap the body contents in a div with the chapter ID and head that is the title
            const xml = fs.readFileSync(sourcePath, "utf8")
            const xmlDOM = new JSDOM(xml, { contentType: "text/xml" })
            const xmlDoc = xmlDOM.window.document
            
            const pbs = xmlDoc.getElementsByTagName('pb')
            for( let i=0; i < pbs.length; i++ ) {
                const pb = pbs[i]
                const imageURL = pb.getAttribute('facs')
                // find the graphic element pointing at this url
                const graphicEl = bbMSDoc.querySelectorAll(`graphic[url="${imageURL}"]`);
                if( graphicEl && graphicEl.length > 0) {
                    const surfaceEl = graphicEl[0].parentElement
                    const surfaceID = surfaceEl.getAttribute('xml:id')
                    pb.setAttribute('corresp',surfaceID)
                    const tlLeafAttr = pb.getAttributeNode('tl_leaf')
                    if( tlLeafAttr ) {
                        pb.removeAttributeNode(tlLeafAttr)
                    }
                }
            }    
            const targetPath = `${xmlPath}/${filename}`
            const xmlContent = xmlDoc.documentElement.outerHTML
            const content = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`
            fs.writeFileSync(targetPath, content, "utf8")        
        }
    }    
}

// Guppy remaps @tl_leaf attributes to @corresp
function main() {
    run().then(() => {
        let date = new Date();
        console.info(`Guppy finished at ${date.toLocaleTimeString()}.`)
    }, (err) => {
        let date = new Date();
        console.info(`Guppy stopped at ${date.toLocaleTimeString()}.`)
        console.error(`${err}: ${err.stack}`)  
    });
}

///// RUN THE SCRIPT
main()
