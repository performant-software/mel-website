#!/usr/bin/env node

const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom
require('dotenv').config();

const {CETEI} = require("./CETEI")
const { pageTemplate } = require("./page-template")
const { bbMSPageTemplate } = require("./bb-ms-template")
const { mossesMSPageTemplate } = require("./mosses-template")

function dirExists( dir ) {
    if( !fs.existsSync(dir) ) {
      fs.mkdirSync(dir);
      if( !fs.existsSync(dir) ) {
        throw `ERROR: ${dir} not found and unable to create it.`;
      }
    }  
}

function getEnvs() {
    // in development use .env, which is .gitignored
    if( fs.existsSync('.env') ) {
        const envData = fs.readFileSync('.env', "utf8")
        const envs = {}
        for( const line of envData.split('\n') ) {
            const eqIdx = line.indexOf('=')          
            const key = line.slice(0,eqIdx).trim()
            const val = line.slice(eqIdx+1).trim()
            if( key && key.length > 0 ) envs[key] = val
        }
        return envs
    } else {
        return process.env
    }
}

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

async function addBBEditionCrafterPage() {
    const baseURL = process.env.DEPLOY_PRIME_URL
    const dev = !!process.env.DEV_MODE
    const html = bbMSPageTemplate(baseURL,dev)
    fs.writeFileSync("editions/versions-of-billy-budd/billy-budd-ms.html", html, "utf8")
}

async function addMossesEditionCrafterPage() {
    const baseURL = process.env.DEPLOY_PRIME_URL
    const dev = !!process.env.DEV_MODE
    const html = mossesMSPageTemplate(baseURL,dev)
    fs.writeFileSync("editions/hawthorne-and-his-mosses/mosses-ms.html", html, "utf8")
}

async function processDocs(sourceDocsPath, targetPath, MSFile = 'index.html') {
    // clear out target and match directory structure with source
    mirrorDirs(sourceDocsPath, targetPath)
    
    // Process the files listed in the index into HTML at target path
    const indexJSON = fs.readFileSync(`${sourceDocsPath}/__index__.json`, "utf8")
    const envs = getEnvs()
    const editionIndex = JSON.parse(indexJSON)
    const editionTitle = editionIndex.title
    const { tl_leaf, iiif } = editionIndex
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
        const html = pageTemplate(chapter, toc, editionTitle, tl_leaf, iiif, `${targetPath}/${MSFile}`, envs )
        const targetFile = `${targetPath}/${chapter.id}.html`
        fs.writeFileSync(targetFile, html, "utf8")    
    }
}

async function run() {
    dirExists('editions')
    dirExists('editions/versions-of-billy-budd')
    dirExists('editions/battle-pieces')
    dirExists('editions/versions-of-moby-dick')
    dirExists('editions/hawthorne-and-his-mosses')
    await processDocs('xml/versions-of-billy-budd','editions/versions-of-billy-budd', 'billy-budd-ms.html')
    await processDocs('xml/battle-pieces','editions/battle-pieces')
    await processDocs('xml/versions-of-moby-dick','editions/versions-of-moby-dick')
    await processDocs('xml/hawthorne-and-his-mosses','editions/hawthorne-and-his-mosses', 'mosses-ms.html')
    await addBBEditionCrafterPage()
    await addMossesEditionCrafterPage()
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
