const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

// tranform file names into chapter IDs
function fileNameToID(fileName) {
    const xmlExtensionIndex = fileName.indexOf('.xml')
    if( xmlExtensionIndex != -1 ) {
        const name = fileName.substring(0,xmlExtensionIndex)
        return name.toLowerCase().replace(/[\s]/g,'-').replace(/[&']/g,'').replace('--','-')
    } 
    return null
}

// This is a one time conversion from Juxta Eds export file to MEL Textual Core XML
async function run() {
    // read in the file names for each edition
    const originalsPath = 'originals/versions-of-moby-dick'
    const xmlPath = 'xml/versions-of-moby-dick'
    const dirContents = fs.readdirSync(originalsPath, {withFileTypes: true});

    for( let i=0; i < dirContents.length; i++ ) {
        const sourceDirEnt = dirContents[i];
        const filename = sourceDirEnt.name
        if( !sourceDirEnt.isDirectory() ) {
            const chapterID = fileNameToID(filename)
            if( chapterID ) {
                const sourcePath = `${originalsPath}/${filename}`
                const targetPath = `${xmlPath}/${chapterID}.xml`

                // wrap the body contents in a div with the chapter ID and head that is the title
                const xml = fs.readFileSync(sourcePath, "utf8")
                const xmlDOM = new JSDOM(xml, { contentType: "text/xml" })
                const xmlDoc = xmlDOM.window.document
                const bodyEl = xmlDoc.getElementsByTagName('body')[0]
                const divEl = xmlDoc.createElement('div')
                divEl.setAttribute('id',chapterID)
                const headEl = xmlDoc.createElement('head')
                headEl.innerHTML = filename
                divEl.appendChild(headEl)
                for( let i=0; i < bodyEl.childNodes.length; i++ ) {
                    const child = bodyEl.childNodes[i]
                    divEl.appendChild(child.cloneNode(true))
                }
                const nextBodyEl = bodyEl.cloneNode(false)
                nextBodyEl.appendChild(divEl)
                bodyEl.parentNode.replaceChild(nextBodyEl,bodyEl)

                const xmlContent = xmlDoc.documentElement.outerHTML
                const content = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`
                fs.writeFileSync(targetPath, content, "utf8")    
            }
        }        
    }    
}

// Minnow converts Juxta Eds XML exports to MEL's XML 
function main() {
    run().then(() => {
        let date = new Date();
        console.info(`Minnow finished at ${date.toLocaleTimeString()}.`)
    }, (err) => {
        let date = new Date();
        console.info(`Minnow stopped at ${date.toLocaleTimeString()}.`)
        console.error(`${err}: ${err.stack}`)  
    });
}

///// RUN THE SCRIPT
main()
