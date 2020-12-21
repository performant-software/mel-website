
function initNotes() {

    let nextID = 0
    const nextWindowAnchorID = () => nextID++

    // add loadInfoWindow callbacks 
    const teiRefEls = document.getElementsByTagName('tei-ref')
    for( const teiRefEl of teiRefEls ) {
        const type = teiRefEl.getAttribute('type')
        if( type === 'reference' ) {
            const target = teiRefEl.getAttribute('target')
            const anchorID = nextWindowAnchorID()
            teiRefEl.setAttribute("data-window-anchor", anchorID )
            teiRefEl.setAttribute("onclick", `loadInfoWindow("${target}",${anchorID})`)                     
        } 
    }

    // create callbacks for tei-name
    const teiNameEls = document.getElementsByTagName('tei-name')
    for( const teiNameEl of teiNameEls ) {
        const target = teiNameEl.getAttribute('ref')
        const anchorID = nextWindowAnchorID()
        teiNameEl.setAttribute("data-window-anchor", anchorID )
        teiNameEl.setAttribute("onclick", `loadInfoWindow("${target}",${anchorID})`)                     
    }

    // for tei-ref that are not references, create a popup tooltip 
    // that displays the associated tei-note
    for( const teiRefEl of teiRefEls ) {
        const type = teiRefEl.getAttribute('type')
        if( type !== 'reference' ) {
            tippy( teiRefEl, {
                content: (reference) => {
                    const id = reference.getAttribute('target').slice(1)
                    const note = document.getElementById(id)
                    return note.innerHTML 
                },
                allowHTML: true,
                interactive: true,
                theme: 'light-border'            
            })        
        }
    }
}

function loadInfoWindow(targetURL,anchorID) {
    axios.get(targetURL)
        .then(function (response) {
            createInfoWindow(response.data,anchorID)
        })
        .catch(function (error) {
            console.log(error);
    })
}

function createInfoWindow(data,anchorID) {
    const anchorEl = document.querySelector(`[data-window-anchor = "${anchorID}"]`)

    if( data.artworks ) {
        const artwork = data.artworks[0]
        createArtworkWindow(artwork,anchorEl)
    } else if( data.events ) {
        console.log('received event')
    } else if( data.people ) {
        console.log('received person')
    } else if( data.places ) {
        console.log('received place')
    } else if( data.texts ) {
        console.log('received text')
    }
}

function createArtworkWindow(artwork,anchorEl) {

    // title
    // artist
    // images[0].image_medium (add http:)
    // see_also[]

    const imageURL = artwork.images[0] ? `https:${artwork.images[0].image_medium}` : null
    const img = imageURL ? `<img src="${imageURL}"/>` : ""

    const infoWindowContent = `
        <h2>${artwork.title}</h2>
        <p>By: ${artwork.artist}</p>
        ${ img }
    `
    const windowID = `window-${Date.now()}`
    floatingWindow(windowID,infoWindowContent,anchorEl)
}

function createImageWindow(anchorID, url) {
    const imageWindowContent = `
        <img src="${url}"/>
    `
    const windowID = `window-${Date.now()}`
    const anchorEl = document.getElementById(anchorID)
    floatingWindow(windowID,imageWindowContent,anchorEl)
}

function initThumbs() {
    // go through all the facs attributes and render them to the sidebar 
    const thumbnailMarginEl = document.getElementById('thumbnail-margin')
    const facsEls = document.querySelectorAll('[facs]')
    let i = 0
    for( const facsEl of facsEls ) {
        const url = facsEl.getAttribute('facs')
        const imageEl = document.createElement('img')
        imageEl.id = `thumb-${i++}`
        imageEl.classList.add('thumbnail')
        imageEl.style.top = `${facsEl.offsetTop}px`
        imageEl.setAttribute('src',url) 
        imageEl.setAttribute('onclick',`createImageWindow("${imageEl.id}","${url}")`)
        thumbnailMarginEl.appendChild(imageEl)
    }
}

function init() {
    initNotes()
    initThumbs()
}
