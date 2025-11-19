
function mossesMSPageTemplate(baseURL,dev) {
    const ecDir = dev ? 'ec-dev' : 'ec'
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/CETEIcean.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/light-border.css"/>
    </head>
    <body>
        <div id="floating-window-container"></div>
        <div>
            <div id="header">
                <h1>Melville Electronic Library</h1>
                <p><a href="/editions.html">Melville Electronic Library</a> >> <a href="${baseURL}/editions/hawthorne-and-his-mosses/chapter-1.html">Hawthorne and his Mosses</a> >> Manuscript </p>
            </div>
            <div id="ec-container">
                <div id="ec"></div>
	        </div>
            <div id="footer"></div>
        </div>
    </body>
    <script type="text/javascript" src="https://www.unpkg.com/@cu-mkp/editioncrafter-umd" ></script>
               
    <script type="text/javascript">               
        EditionCrafter.viewer({
            id: 'ec',
            documentName: 'Hawthorne and his Mosses',
            iiifManifest: '${baseURL}/${ecDir}/mosses_tei/iiif/manifest.json',
            transcriptionTypes: {
              base: 'Base Text',
              lw: 'LW',
              transcription: 'Diplomatic Transcription',
              reading: 'Reading Text'
            }
        });               
    </script>
</html>    
    `
}

// EXPORTS /////////////
module.exports.mossesMSPageTemplate = mossesMSPageTemplate;