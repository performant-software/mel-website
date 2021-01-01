
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
    const imageURL = artwork.images[0] ? `https:${artwork.images[0].image_medium}` : null
    const img = imageURL ? `<img src="${imageURL}"/>` : ""

    const infoWindowContent = `
        <h2>${artwork.title}</h2>
        <p>By: ${artwork.artist}</p>
        ${ img }
    `
    floatingWindow(anchorID,infoWindowContent)
}

function createEventWindow(event,anchorID) {
    const infoWindowContent = `
        <h2>${event.name}</h2>
    `
    floatingWindow(anchorID,infoWindowContent)
}

function createPersonWindow(person,anchorID) {
    const imageURL = person.images[0] ? `https:${person.images[0].image_medium}` : null
    const img = imageURL ? `<img src="${imageURL}"/>` : ""

    const infoWindowContent = `
        <h2>${person.authoritative_name}</h2>
        <p>${person.description}</p>
        ${ img }
    `
    floatingWindow(anchorID,infoWindowContent)
}

function createPlaceWindow(place,anchorID) {
    const infoWindowContent = `
        <h2>${place.name}</h2>
    `
    floatingWindow(anchorID,infoWindowContent)
}

function createTextWindow(text,anchorID) {

    const infoWindowContent = `
        <h2>${text.name}</h2>
        <p>${text.author}</p>
    `
    floatingWindow(anchorID,infoWindowContent)
}