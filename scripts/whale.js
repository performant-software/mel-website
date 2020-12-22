#!/usr/bin/env node

const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const {CETEI} = require("./CETEI")
const { pageTemplate } = require("./page-template")

function convertToHTML( sourcePath ) {
    const htmlDOM = new JSDOM()
    const ceTEI = new CETEI(htmlDOM.window)

    console.log(`Converting ${sourcePath}`)
    try {
        const xml = fs.readFileSync(sourcePath, "utf8")
        const xmlDOM = new JSDOM(xml, { contentType: "text/xml" })    
        const xmlDoc = xmlDOM.window.document
        const titleEl = xmlDoc.getElementsByTagName('title')[0]
        const data = ceTEI.domToHTML5(xmlDOM.window.document)
        return { title: titleEl.innerHTML, content: data.innerHTML }
    } catch( err ) {
        console.error(`ERROR ${err}: ${err.stack}`)  
    }

    return null
}

function mirrorDirs(sourcePath, targetPath) {
    const dirContents = fs.readdirSync(sourcePath, {withFileTypes: true});
    for( let i=0; i < dirContents.length; i++ ) {
        const sourceDirEnt = dirContents[i];
        const sourceFile = `${sourcePath}/${sourceDirEnt.name}`
        const targetFile = `${targetPath}/${sourceDirEnt.name}`
        if( sourceDirEnt.isDirectory() ) {
            if( !fs.existsSync(targetFile)) fs.mkdirSync(targetFile)
            mirrorDirs(sourceFile, targetFile)
        } else {
            if( fs.existsSync(targetFile)) fs.unlinkSync(targetFile)
        } 
    }
}

async function process(sourceDocsPath, targetPath) {
    // clear out target and match directory structure with source
    mirrorDirs(sourceDocsPath, targetPath)
    
    // Process the files listed in the index into HTML at target path
    const indexJSON = fs.readFileSync(`${sourceDocsPath}/__index__.json`, "utf8")
    const editionIndex = JSON.parse(indexJSON)
    const editionTitle = editionIndex.title
    const toc = []

    const chapters = []
    for( const chapterFile of editionIndex.chapters ) {
        const sourceFile = `${sourceDocsPath}/${chapterFile}`
        const chapter = convertToHTML(sourceFile)
        if( chapter ) {
            const xmlExtensionIndex = chapterFile.indexOf('.xml')
            chapter.id = chapterFile.substring(0,xmlExtensionIndex)
            const targetFile = `${targetPath}/${chapter.id}.html`
            chapters.push(chapter)
            toc.push({ path: targetFile, title: chapter.title})
        }    
    }

    for( const chapter of chapters ) {
        const html = pageTemplate(chapter, toc, editionTitle)
        const targetFile = `${targetPath}/${chapter.id}.html`
        fs.writeFileSync(targetFile, html, "utf8")    
    }
}

async function run() {
    // TODO mkdir editions if necessary
    await process('../xml/versions-of-moby-dick','../editions/versions-of-moby-dick')
}

function main() {
    run().then(() => {
        let date = new Date();
        console.info(`Whale surfaced at ${date.toLocaleTimeString()}.`)
    }, (err) => {
        let date = new Date();
        console.info(`Whale dove to the depths at ${date.toLocaleTimeString()}.`)
        console.error(`${err}: ${err.stack}`)  
    });
}

///// RUN THE SCRIPT
main()
