const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

function createChoice(regContent,origContent,oldEl,xmlDoc) {
    const choiceEl = xmlDoc.createElement('choice')
    const origEl = xmlDoc.createElement('orig')
    if( origContent === null || regContent === null ) debugger
    origEl.innerHTML = origContent.replaceAll('&','&amp;')
    const regEl = xmlDoc.createElement('reg')
    regEl.innerHTML = regContent.replaceAll('&','&amp;')
    choiceEl.appendChild(origEl)
    choiceEl.appendChild(regEl)
    oldEl.parentNode.replaceChild(choiceEl,oldEl)
}

function addChoiceTags(xmlDoc) {
    const regEls = xmlDoc.getElementsByTagName('reg')
    const origEls = xmlDoc.getElementsByTagName('orig')
 
    if ( regEls.length === 0 && origEls.length === 0 ) return false

    // regEls and origEls are live queries, not arrays, 
    // so gather up all the choice els before making them

    const choices = []
    for( let i=0; i < regEls.length; i++ ) {
        const el = regEls[i]
        const regContent = el.innerHTML
        const origContent = el.getAttribute('originalText')
        choices.push([regContent,origContent,el])
    }    

    for( let i=0; i < origEls.length; i++ ) {
        const el = origEls[i]
        const regContent = el.getAttribute('regularizedText')
        const origContent = el.innerHTML
        choices.push([regContent,origContent,el])
    }        

    for( const choice of choices ) {
        createChoice(...choice,xmlDoc)
    }

    return true
}

function process(sourceDocsPath,targetDocsPath) {
    // Process the files listed in the index into HTML at target path
    const indexJSON = fs.readFileSync(`${sourceDocsPath}/__index__.json`, "utf8")
    const editionIndex = JSON.parse(indexJSON)
 
    for( const chapterFile of editionIndex.chapters ) {
        const sourceFile = `${sourceDocsPath}/${chapterFile}`
        const targetFile = `${targetDocsPath}/${chapterFile}`
        const xml = fs.readFileSync(sourceFile, "utf8")
        const xmlDOM = new JSDOM(xml, { contentType: "text/xml" })    
        const xmlDoc = xmlDOM.window.document
        try {
            if( addChoiceTags(xmlDoc) ) {
                let xmlContent = xmlDoc.documentElement.outerHTML.replaceAll('xmlns=""','')
                const targetXML = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`
                fs.writeFileSync(targetFile, targetXML, "utf8")            
            }
        } catch(e) {
            console.log(`Error processing ${sourceFile}:\n${e}`)
        }
    }
}

function dirExists( dir ) {
    if( !fs.existsSync(dir) ) {
      fs.mkdirSync(dir);
      if( !fs.existsSync(dir) ) {
        throw `ERROR: ${dir} not found and unable to create it.`;
      }
    }  
}

function main() {
    process('xml/versions-of-billy-budd','xml/versions-of-billy-budd')
}

///// RUN THE SCRIPT
main()
