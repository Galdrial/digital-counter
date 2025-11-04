// Constants
const MAX_COUNTER = 999999;
const DIGIT_COUNT = 6;

const body = document.querySelector( 'body' );
const firstContainer = document.createElement( 'div' );
firstContainer.className = 'first-container';
body.appendChild( firstContainer );
const secondContainer = document.createElement( 'div' );
secondContainer.className = 'second-container';
body.appendChild( secondContainer );
const title = document.createElement( 'h1' );
title.className = 'title';
title.textContent = 'WELCOME TO MY DIGITAL COUNTER';
firstContainer.appendChild( title );
const output = document.createElement( 'div' );
output.className = 'output';
firstContainer.appendChild( output );
const model = document.createElement('h2');
model.className = 'model';
model.textContent = 'SC-821M'
secondContainer.appendChild( model);


function createContainerDiv( ...classes ) {
	const div = document.createElement( 'div' );
	div.classList.add( ...classes );
	output.appendChild( div );
	return div;
}

const contDivs = [];
for ( let i = 0; i < DIGIT_COUNT; i++ ) {
	contDivs[i] = createContainerDiv( 'number' );
}

let counter = 0;

function modNum() {
	let strCounter = counter.toString().split( '' ).reverse().join( '' );
	for ( let i = 0; i < DIGIT_COUNT; i++ ) {
		contDivs[DIGIT_COUNT - 1 - i].textContent = strCounter[i] || '0';
	}
}

modNum();

const buttonContainer = document.createElement( 'div' );
buttonContainer.className = 'button-container';
secondContainer.appendChild( buttonContainer );

const buttons = [
	{
		text: '<i class="bi bi-caret-down"></i>', action: () => {
			removeAlert();
			if ( counter > 0 ) { counter--; } else {
				showAlert( 'Counter is already at zero!' );
			}; modNum();
		}
	},
	{
		text: '<i class="bi bi-caret-up"></i>', action: () => {
			removeAlert();
			if ( counter < MAX_COUNTER ) { counter++; } else {
				showAlert( 'Counter is already at maximum!' );
			}; modNum();
		}
	},
	{ text: '<i class="bi bi-arrow-counterclockwise"></i>', action: () => { removeAlert(); counter = 0; modNum(); } },
	{ text: '<i class="bi bi-shuffle"></i>', action: () => { removeAlert(); counter = Math.floor( Math.random() * ( MAX_COUNTER + 1 ) ); modNum(); } }
];

buttons.forEach( ( { text, action } ) => {
	const btn = document.createElement( 'button' );
	btn.innerHTML = text;
	btn.className = 'btn btn-primary';

	let timeoutId, intervalId;

	function increment() {
		action();
	}

	function startIncrement( event ) {
		// desktop: left mouse button only
		if ( event.type === 'mousedown' && event.button !== 0 ) return;
		// mobile: prevent selection/scroll
		if ( event.type === 'touchstart' ) event.preventDefault();
		increment();
		timeoutId = setTimeout( () => {
			intervalId = setInterval( increment, 100 );
		}, 300 );
	}

	function stopIncrement() {
		clearTimeout( timeoutId );
		clearInterval( intervalId );
	}

	if ( text.includes( 'caret-up' ) || text.includes( 'caret-down' ) ) {
		btn.addEventListener( 'mousedown', startIncrement );
		btn.addEventListener( 'mouseup', stopIncrement );
		btn.addEventListener( 'mouseleave', stopIncrement );
		btn.addEventListener( 'touchstart', startIncrement );
		btn.addEventListener( 'touchend', stopIncrement );
		btn.addEventListener( 'touchcancel', stopIncrement );
	} else {
		btn.addEventListener( 'click', action );
	}

	buttonContainer.appendChild( btn );
} );

// Unified alert function to eliminate duplication
function showAlert( message ) {
	removeAlert();
	const alert = document.createElement( 'div' );
	alert.className = "alert alert-danger fade show";

	// Apply styles
	Object.assign( alert.style, {
		position: "absolute",
		bottom: "-80px",
		left: "50%",
		transform: "translateX(-50%)",
		maxWidth: "100dvw",
		width: "max-content",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		boxSizing: "border-box",
		padding: "0.75rem 1rem",
		zIndex: "100"
	} );

	alert.innerHTML = `<strong>Warning!</strong> ${message}`;
	secondContainer.appendChild( alert );
}

function removeAlert() {
	const existingAlert = document.querySelector( '.alert' );
	if ( existingAlert ) {
		existingAlert.remove();
	}
}