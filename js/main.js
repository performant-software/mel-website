
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
            teiRefEl.setAttribute("onclick", `window.open("${target}", "_blank")`)
        }
        else if( type === 'external-link') {
          const target = teiRefEl.getAttribute('target')
          teiRefEl.setAttribute("onclick", `window.open("${target}", "_blank")`)
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
                maxWidth: 500,
                interactive: true,
                theme: 'light-border'
            })
        }
    }

    // create popup tooltips for choice elements
    const teiChoiceEls = document.getElementsByTagName('tei-choice')
    for( const teiChoiceEl of teiChoiceEls ) {
        const teiOrigEl = teiChoiceEl.getElementsByTagName('tei-orig')[0]
        const teiRegEl = teiChoiceEl.getElementsByTagName('tei-reg')[0]
        // display reg inline and hide orig
        teiOrigEl.style.display = 'none'
        teiRegEl.style.textDecoration = 'underline'
        teiRegEl.style.color = '#5f0000'
        tippy( teiChoiceEl, {
            content: () => {
                // content of tooltip is the orig
                return `<i>MS:</i> ${teiOrigEl.innerHTML}`
            },
            allowHTML: true,
            interactive: true,
            theme: 'light-border'
        })
    }
}

function createImageWindow(anchorID, url) {
    const imageWindowContent = `
        <img src="${url}"/>
    `
    floatingWindow(`image-window-${anchorID}`,imageWindowContent)
}

function highlightImage( on, id ) {
    if( on ) {
        document.getElementById(id).classList.add("highlight-image")
    } else {
        document.getElementById(id).classList.remove("highlight-image")
    }
}

//helper function
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initThumbs(tlLeaf,iiif,MSPath) {
    // go through all the facs attributes and render them to the sidebar
    const thumbnailMarginEl = document.getElementById('thumbnail-margin')
    const facsEls = document.querySelectorAll('tei-pb')
    let i = 0
    let minOffset = 0
    for( const facsEl of facsEls ) {
        if (!facsEl.getAttribute('facs')) {
            continue;
        }
        const url = iiif ? `${ facsEl.getAttribute('facs')}/full/120,/0/default.jpg` : facsEl.getAttribute('facs')
        const topOffset = Math.max(facsEl.offsetTop, minOffset)
        const imageEl = document.createElement('img')
        imageEl.id = `thumb-${i++}`
        facsEl.id = `inline-${imageEl.id}`
        imageEl.classList.add('thumbnail')
        imageEl.style.top = `${topOffset}px`
        imageEl.setAttribute('src',url)
        const surfaceID = facsEl.getAttribute('corresp') || facsEl.getAttribute('sameAs')
        const ecURL = `${window.location.origin}/${MSPath}#/ec/${surfaceID}/f/${surfaceID}/transcription`
        const onClickFn = tlLeaf ? `window.open("${ecURL}")` : `createImageWindow("${imageEl.id}","${url}")`
        imageEl.setAttribute('onclick',onClickFn)
        imageEl.setAttribute('onmouseenter',`highlightImage( true, "${facsEl.id}"); highlightImage( true, "${imageEl.id}")`)
        imageEl.setAttribute('onmouseleave',`highlightImage( false, "${facsEl.id}"); highlightImage( false, "${imageEl.id}")`)
        thumbnailMarginEl.appendChild(imageEl)
        
        // create an icon which is linked to the image
        facsEl.innerHTML=`<img onclick='${onClickFn}' style="padding-top: 2px" height="15" width="12" src="/images/pb.png"/>`
        facsEl.setAttribute('onmouseenter',`highlightImage( true, "${imageEl.id}"); highlightImage( true, "${facsEl.id}")`)
        facsEl.setAttribute('onmouseleave',`highlightImage( false, "${imageEl.id}"); highlightImage( false, "${facsEl.id}")`)

        await delay(10)
        minOffset = topOffset + imageEl.offsetHeight + 8
    }
}

function adjustThumbs(num) {
    const thumbnails = document.querySelectorAll('.thumbnail')
    let minOffset = 0;
    for (const el of thumbnails) {
        if (el.offsetHeight === 0 && num < 100) {
            setTimeout(() => {
                adjustThumbs(num + 1)
            }, 50)
            break;
        } else {
            if (el.offsetTop >= minOffset) {
                minOffset = el.offsetTop + el.offsetHeight + 8
                continue;
            } else {
                el.style.top = `${minOffset}px`
                minOffset = minOffset + el.offsetHeight + 8
            }
        }
    }
}

function init(tl_leaf,iiif,MSPath) {
    initNotes()
    initThumbs(tl_leaf,iiif,MSPath)
    setTimeout(() => {
        adjustThumbs(0)
    }, 50)
}
