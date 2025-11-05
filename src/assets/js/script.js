// Constants
const MAX_COUNTER = 999999;
const DIGIT_COUNT = 6;

// Use the main element for better semantic structure
const main = document.querySelector('main');
const firstContainer = document.createElement('div');
firstContainer.className = 'first-container';
main.appendChild(firstContainer);
const secondContainer = document.createElement('div');
secondContainer.className = 'second-container';
main.appendChild(secondContainer);

// Add proper heading structure and ARIA labels
const title = document.createElement('h1');
title.className = 'title';
title.textContent = 'WELCOME TO MY DIGITAL COUNTER';
title.setAttribute('aria-label', 'Digital Counter Application');
firstContainer.appendChild(title);

const output = document.createElement('div');
output.className = 'output';
output.setAttribute('role', 'group');
output.setAttribute('aria-label', 'Counter display');
output.setAttribute('aria-live', 'polite');
output.setAttribute('aria-atomic', 'true');
firstContainer.appendChild(output);

const model = document.createElement('h2');
model.className = 'model';
model.textContent = 'SC-821M';
model.setAttribute('aria-label', 'Counter model SC-821M');
secondContainer.appendChild(model);


function createContainerDiv( ...classes ) {
	const div = document.createElement( 'div' );
	div.classList.add( ...classes );
	div.setAttribute('role', 'img');
	div.setAttribute('aria-label', 'Counter digit');
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
		const digit = strCounter[i] || '0';
		contDivs[DIGIT_COUNT - 1 - i].textContent = digit;
		contDivs[DIGIT_COUNT - 1 - i].setAttribute('aria-label', `Digit ${DIGIT_COUNT - i}: ${digit}`);
	}
	
	// Update the main counter announcement for screen readers
	output.setAttribute('aria-label', `Current counter value: ${counter.toLocaleString()}`);
}

modNum();

const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
buttonContainer.setAttribute('role', 'group');
buttonContainer.setAttribute('aria-label', 'Counter controls');
secondContainer.appendChild(buttonContainer);

const buttons = [
	{
		text: '<i class="bi bi-caret-down" aria-hidden="true"></i>',
		label: 'Decrease counter by one',
		action: () => {
			removeAlert();
			if (counter > 0) {
				counter--;
			} else {
				showAlert('Counter is already at zero!');
			}
			modNum();
		}
	},
	{
		text: '<i class="bi bi-caret-up" aria-hidden="true"></i>',
		label: 'Increase counter by one',
		action: () => {
			removeAlert();
			if (counter < MAX_COUNTER) {
				counter++;
			} else {
				showAlert('Counter is already at maximum!');
			}
			modNum();
		}
	},
	{
		text: '<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>',
		label: 'Reset counter to zero',
		action: () => {
			removeAlert();
			counter = 0;
			modNum();
		}
	},
	{
		text: '<i class="bi bi-shuffle" aria-hidden="true"></i>',
		label: 'Set counter to random value',
		action: () => {
			removeAlert();
			counter = Math.floor(Math.random() * (MAX_COUNTER + 1));
			modNum();
		}
	}
];

buttons.forEach(({ text, label, action }) => {
	const btn = document.createElement('button');
	btn.innerHTML = text;
	btn.className = 'btn btn-dark';
	btn.setAttribute('aria-label', label);
	btn.setAttribute('type', 'button');
	
	// Add keyboard support
	btn.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			action();
		}
	});

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

// Unified alert function with accessibility improvements
function showAlert(message) {
	removeAlert();
	const alert = document.createElement('div');
	alert.className = "alert alert-danger fade show";
	alert.setAttribute('role', 'alert');
	alert.setAttribute('aria-live', 'assertive');
	alert.setAttribute('aria-atomic', 'true');
	alert.setAttribute('tabindex', '-1');

	// Apply styles
	Object.assign(alert.style, {
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
	});

	alert.innerHTML = `<strong>Warning!</strong> ${message}`;
	secondContainer.appendChild(alert);
	
	// Focus the alert for screen readers
	alert.focus();
	
	// Auto-remove after 5 seconds for better UX
	setTimeout(() => {
		removeAlert();
	}, 5000);
}

function removeAlert() {
	const existingAlert = document.querySelector('.alert');
	if (existingAlert) {
		existingAlert.remove();
	}
}