
function renderTOC(toc) {
    const listItems = []
    for( const entry of toc ) {
        const {path, title} = entry
        listItems.push(
            `<li><a href="/${path}">${title}</a></li>`
        )
    }

    return `<ul>${listItems.join('\n')}</ul>`
}

const pageTemplate = function renderPage(chapter, toc, editionTitle, tl_leaf, iiif, MSPath, envs ) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/CETEIcean.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="/css/floating-window.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="/css/main.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/light-border.css"/>
    </head>
    <body onload="init(${!!tl_leaf},${!!iiif},'${MSPath}')">
        <div id="floating-window-container"></div>
        <div id="grid-container">
            <div id="header">
                <h1>Melville Electronic Library</h1>
                <p><a href="/editions.html">Melville Electronic Library</a> >> ${editionTitle}</p>
            </div>
            <div id="table-of-contents">
                <h2>Chapters</h2>
                ${ renderTOC(toc)}     
            </div>
            <div id="content">${chapter.content}</div>
            <div id="thumbnail-margin"></div>                    
            <div id="footer"></div>
        </div>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
        <script src="/js/floating-window.js"></script>
        <script src="/js/info-window.js"></script>
        <script src="/js/main.js"></script>
        <script>
            window.GoogleMapAPIKey = "${envs['GOOGLE_MAP_API']}"
        </script>
    </body>
    </html>`
}

// EXPORTS /////////////
module.exports.pageTemplate = pageTemplate;
