
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

function createImageWindow(anchorID, url) {
    const imageWindowContent = `
        <img src="${url}"/>
    `
    floatingWindow(`image-window-${anchorID}`,imageWindowContent)
}

function initThumbs(tlLeaf,iiif) {
    // go through all the facs attributes and render them to the sidebar 
    const thumbnailMarginEl = document.getElementById('thumbnail-margin')
    const facsEls = document.querySelectorAll('[facs]')
    let i = 0
    for( const facsEl of facsEls ) {
        const url = iiif ? `${ facsEl.getAttribute('facs')}/full/120,/0/default.jpg` : facsEl.getAttribute('facs')
        const imageEl = document.createElement('img')
        imageEl.id = `thumb-${i++}`
        imageEl.classList.add('thumbnail')
        imageEl.style.top = `${facsEl.offsetTop}px`
        imageEl.setAttribute('src',url) 
        if( tlLeaf ) {
            imageEl.setAttribute('onclick',`window.open("${facsEl.getAttribute('tl_leaf')}")`)
        } else {
            imageEl.setAttribute('onclick',`createImageWindow("${imageEl.id}","${url}")`)
        }
        thumbnailMarginEl.appendChild(imageEl)
    }
}

function init(tl_leaf,iiif) {
    initNotes()
    initThumbs(tl_leaf,iiif)
}
