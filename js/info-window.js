
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
    if( data.artworks ) {
        const artwork = data.artworks[0]
        createArtworkWindow(artwork,anchorID)
    } else if( data.events ) {
        const eventObj = data.events[0]
        createEventWindow(eventObj,anchorID)
    } else if( data.people ) {
        const person = data.people[0]
        createPersonWindow(person,anchorID)
    } else if( data.places ) {
        const place = data.places[0]
        createPlaceWindow(place,anchorID)
    } else if( data.texts ) {
        const text = data.texts[0]
        createTextWindow(text,anchorID)
    }
}

function createArtworkWindow(artwork,anchorID) {
    const lines = []
    const image = renderImage(artwork)
    if( image ) lines.push(image)
    if( artwork.title.length > 0 ) lines.push(`<h2>${artwork.title}</h2>`)
    if( artwork.artist.length > 0 ) lines.push(`<p>${artwork.artist}</p>`)
    const seeAlso = renderSeeAlso(artwork)
    if( seeAlso ) lines.push(seeAlso)
    const infoWindowContent = lines.join('\n')
    floatingWindow(anchorID,infoWindowContent)
}

function createEventWindow(event,anchorID) {
    const lines = []
    const image = renderImage(event)
    if( image ) lines.push(image)
    if( event.name.length > 0 ) lines.push(`<h2>${event.name}</h2>`)
    const seeAlso = renderSeeAlso(event)
    if( seeAlso ) lines.push(seeAlso)
    const infoWindowContent = lines.join('\n')
    floatingWindow(anchorID,infoWindowContent)
}

function createPersonWindow(person,anchorID) {
    const lines = []
    const image = renderImage(person)
    if( image ) lines.push(image)
    if( person.display_name.length > 0 ) lines.push(`<h2>${person.display_name}</h2>`)
    if( person.description.length > 0 ) lines.push(`<p>${person.description}</p>`)
    const seeAlso = renderSeeAlso(person)
    if( seeAlso ) lines.push(seeAlso)
    const infoWindowContent = lines.join('\n')
    floatingWindow(anchorID,infoWindowContent)
}

function createPlaceWindow(place,anchorID) {
    const lines = []
    const map = renderMap(place.latitude,place.longitude)
    if( map ) lines.push(map)
    if( place.name.length > 0 ) lines.push(`<h2>${place.name}</h2>`)
    const seeAlso = renderSeeAlso(place)
    if( seeAlso ) lines.push(seeAlso)
    const infoWindowContent = lines.join('\n')
    floatingWindow(anchorID,infoWindowContent)
}

function createTextWindow(text,anchorID) {
    const lines = []
    const image = renderImage(text)
    if( image ) lines.push(image)
    if( text.name.length > 0 ) lines.push(`<h2>${text.name}</h2>`)
    if( text.author.length > 0 ) lines.push(`<p>Author: ${text.author}</p>`)
    if( text.name.publisher > 0 ) lines.push(`<p>Publisher: ${text.publisher} ${text.place_of_publication} ${text.publication_date}</p>`)
    const seeAlso = renderSeeAlso(text)
    if( seeAlso ) lines.push(seeAlso)
    const infoWindowContent = lines.join('\n')
    floatingWindow(anchorID,infoWindowContent)
}

function renderImage(entry) {
    const imageURL = entry.images[0] ? `https:${entry.images[0].image_medium}` : null
    return imageURL ? `<img class="right-img" src="${imageURL}"/>` : null
}

function renderSeeAlso(entry) {
    const lines = []
    for( const ref of entry.see_also ) {
        lines.push(`<p><a href="${ref.url}">${ref.description}</a></p>`)
    }
    return ( lines.length > 0 ) ? lines.join('\n') : null
}

function renderMap(lat,long) {
    const staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=10&size=180x180&maptype=satellite&key=${window.GoogleMapAPIKey}`
    return `<img class="right-img" src="${staticMapURL}"/>`
}