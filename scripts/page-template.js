
function renderTOC(toc) {
    const listItems = []
    for( const entry of toc ) {
        const {title, html} = entry
        const path = `${html}.html`
        listItems.push(
            `<li><a href="/${path}">${title}</a></li>`
        )
    }

    return `<ul>${listItems.join('\n')}</ul>`
}

const pageTemplate = function renderPage(content) {
    const { body, metadata } = content
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/CETEIcean.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="/css/floating-window.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="/css/main.css" media="screen" charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/light-border.css"/>
    </head>
    <body onload="init()">
        <div id="floating-window-container"></div>
        <div id="grid-container">
            <div id="header">
                <h1>Melville Electronic Library</h1>
                <p><a href="/editions.html">Melville Electronic Library</a> >> Versions of Moby-Dick</p>
            </div>
            <div id="table-of-contents">
                <h2>Chapters</h2>
                ${ renderTOC(metadata.toc)}     
            </div>
            <div id="content">${body}</div>
            <div id="thumbnail-margin"></div>                    
            <div id="footer"></div>
        </div>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
        <script src="/js/floating-window.js"></script>
        <script src="/js/main.js"></script>
    </body>
    </html>`
}

// EXPORTS /////////////
module.exports.pageTemplate = pageTemplate;
