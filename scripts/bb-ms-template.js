
function bbMSPageTemplate(baseURL,dev) {
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
                <p><a href="/editions.html">Melville Electronic Library</a> >> <a href="${baseURL}/editions/versions-of-billy-budd/chapter-1.html">Versions of Billy Budd</a> >> Manuscript </p>
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
            documentName: 'Billy Budd MS',
            iiifManifest: '${baseURL}/${ecDir}/bb-ms/iiif/manifest.json',
            transcriptionTypes: {
              transcription: 'Transcription'
            }
        });               
    </script>
</html>    
    `
}

// EXPORTS /////////////
module.exports.bbMSPageTemplate = bbMSPageTemplate;
