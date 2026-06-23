import fs from 'fs';
import { DOMParser } from 'linkedom';

const OUTPUT_PATH = 'xml/hawthorne-and-his-mosses/mosses_tei.xml';
const INPUT_PATH = 'xml/hawthorne-and-his-mosses';
const HEADER_PATH = 'xml/hawthorne-and-his-mosses/metadata.xml';
const HEADER_BOOKENDS = ['<teiHeader>', '</teiHeader>'];
const FACS_PATH = 'xml/hawthorne-and-his-mosses/mossesFolios.xml';
const FACS_BOOKENDS = ['<facsimile sameAs="https://core-data-cloud-production-955ccda75add.herokuapp.com//core_data/public/v1/items/70a859e2-24de-43a7-95f1-8eb5d7bd452d/manifests/7b6c4ff6-df70-4ad6-af12-a0c4933c7a88">', '</facsimile>'];
const TEI_SKELETON = `
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
   <!-- header -->
   <!-- facsimile -->
   <!-- base -->
   <!-- diplomatic -->
   <!-- mel -->
   <!-- lw -->
</TEI>
`

const buildTEI = (output = OUTPUT_PATH) => {
    //we'll build the file in stages
    const withHeader = insertContent(TEI_SKELETON, getFileContents(HEADER_PATH, HEADER_BOOKENDS), '<!-- header -->');
    const withFacs = insertContent(withHeader, getFileContents(FACS_PATH, FACS_BOOKENDS), '<!-- facsimile -->');
    const withBase = insertContent(withFacs, buildTextResource('base', 'base'), '<!-- base -->');
    const withDiplo = insertContent(withBase, buildTextResource('diplomatic', 'diplo'), '<!-- diplomatic -->');
    const withMel = insertContent(withDiplo, buildTextResource('reading', 'mel'), '<!-- mel -->');
    const withReading = insertContent(withMel, buildTextResource('lw', 'lw'), '<!-- lw -->');

    fs.writeFileSync(output, withReading);
}

const getFileContents = (path, bookends) => {
    const text = fs.readFileSync(path).toString();
    return bookends[0] + text.split(bookends[0])[1].split(bookends[1])[0] + bookends[1];
}

const insertContent = (xml, content, placeholder) => {
    try {
        const chunks = xml.split(placeholder);
        //hopefully the placeholder only happens once; otherwise throw an error
        if (chunks.length !== 2) {
            throw new Error('Content slot not found.')
        }
        return chunks[0] + content + chunks[1];
    } catch (error) {
        console.log(error)
    }
}

const buildTextResource = (xmlId, fileSuffix) => {
    const xmlFiles = fs.readdirSync(INPUT_PATH).filter((f) => (f.endsWith(`_${fileSuffix}.xml`)));
    let str = `
    <text xml:id="${xmlId}">
      <body>
    `
    for (const file of xmlFiles) {
        try {
            const xml = fs.readFileSync(`${INPUT_PATH}/${file}`).toString();
            const content = xml.split('<body>')[1].split('</body>')[0];
            str += content;
        } catch (error) {
            console.log(error)
        }
    }
    str += `</body>
    </text>`
    return str;
}

buildTEI();

