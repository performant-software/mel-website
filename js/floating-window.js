const windowMaxWidth = 400
const windowMaxHeight = 600

function floatingWindow(windowID,content,anchorEl) {

  const windowTemplate = `
    <div class="floating-window-close-x" onClick="closeFloatingWindow('${windowID}')">X</div>
    <div id="${windowID}header" class="floating-window-header"></div>
    <div class="floating-window-content">
        ${content}
    </div>
  `

  let offsetX = window.innerWidth/2 - windowMaxWidth/2
  let offsetY = anchorEl.offsetTop - windowMaxHeight/2
  offsetX = (offsetX < 0 ) ? 0 : offsetX
  offsetY = (offsetY < 0 ) ? 0 : offsetY

  const windowDiv = document.createElement('div')
  windowDiv.id = windowID
  windowDiv.classList.add('floating-window')
  windowDiv.style.opacity = '100%'
  windowDiv.style.left = `${offsetX}px`
  windowDiv.style.top = `${offsetY}px`
  windowDiv.innerHTML = windowTemplate
  const container = document.getElementById('floating-window-container')
  container.appendChild(windowDiv)
  fadeIn(windowDiv)
  dragElement(windowDiv);
  disappearOffscreen(windowDiv)
}

function fadeIn(el) {
  // TODO 
}

function disappearOffscreen(el) {
  // TODO
}

function closeFloatingWindow(windowID) {
  const windowDiv = document.getElementById(windowID)
  windowDiv.parentNode.removeChild(windowDiv)
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}