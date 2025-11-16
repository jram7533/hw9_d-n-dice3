/** roll.js
 * Author:				Jack
 * Date:					2024-06-28
 * Last revised: 	2024-07-27
 * 
 * Description:  	JS for calculator project. User first selects
 * # of dice to roll, then the type (# of sides) of dice to
 * roll. 
 * 
 * On error (e.g., user selects two number of roll values
 * or die type w/o # of rolls), alert window displays 
 * and operation is reset
 * 
 * User can either clear the display between rolls or just
 * start next roll by selecting new # of dice value
 */

"use strict";

// page elements (arrays of inputs, buttons, and dice (buttons))
const inputArr 	= Array.from(document.querySelectorAll("input")),
 			btnArr 		= Array.from(document.querySelectorAll("button")),
			diceArr 	= Array.from(document.getElementsByClassName("dice"));

// variables 
let numDice 	= 0,	// number of dice
	  numSides 	= 0,	// dice sides
		rollTotal = 0,	// total value for roll
		lastNumDice,		// last value for re-roll
		lastNumSides;		// last value for re-roll

/**
 *  Assign a click event listener to each button.
 *  Main logic for the app
 */
btnArr.forEach(button => {
	button.addEventListener("click", (e) => {
		const rollWindow = document.getElementById("roll-window");

		// if CLEAR button is clicked, reset & return
		if (e.target.innerHTML == "CLEAR") {
			clearOutput();
			rollWindow.innerHTML = "";
			lastNumDice = 0;  // reset last roll
			lastNumSides = 0; // reset last roll
			return;
		}

		/**
		 * User has to start with # of dice. Clicking die type
		 * first won't do anything. Have to make sure user hasn't
		 * clicked CLEAR w/o numDice selected (or it will display
		 * "x D" in roll window)
		 */
		// re-roll the last roll
		if (e.target.innerHTML == "RE-ROLL") {
			if (lastNumDice && lastNumSides) {
				roll(lastNumSides, lastNumDice);
			}
		}
		// start -> no # of dice selected
		else if (!numDice && e.target.classList.contains("num-rolls")) {
			clearOutput();
			// get # of dice
			numDice = parseInt(e.target.innerHTML);
			// update roll window
			rollWindow.innerHTML = e.target.innerHTML;
		} 
		// if user selects # of dice twice or die type w/o
		// selecting # of dice
		else if (
			(numDice && e.target.classList.contains("num-rolls")) ||
			(!numDice && e.target.classList.contains("operator"))
		) {
			alert(e);
		} 
		// parse die type & roll dice
		else if (numDice && e.target.classList.contains("operator")) {
			numSides = parseInt(e.target.value);
			// save current values for re-rolls
			lastNumDice = numDice;
			lastNumSides = numSides;
			// display roll in roll window
			rollWindow.innerHTML += " x d" + e.target.value;
			// roll the dice
			roll(numSides, numDice);
		}
	}); // end of 'click' event listener
}); // end of forEach() loop

/**
 * roll the dice
 * 
 * @param {numSides} s 
 * @param {numDice} r 
 * @returns nothing (updates display)
 */
const roll = (s, r) => {
	let currRoll = 0,
			highRoll = 0;
	rollTotal = 0;
	clearOutput();

	// roll each die
	for (let i = 0; i < r; i++) {
		setTimeout( () => {  // QOL - slight delay
			currRoll = Math.floor(Math.random() * s + 1);
			inputArr[i].value = currRoll;
			rollTotal += parseInt(currRoll);
			currRoll > highRoll ? highRoll = currRoll : highRoll;
			document.getElementById("total").value = rollTotal.toString();
			document.getElementById("highest").value = highRoll.toString();
		}, 400);
	}
	return;
};

// clear output display
const clearOutput = () => {
	// clear inputs' displays
	inputArr.forEach(input => {
		input.value = "";
	});
	
	// reset dice values
	numDice = 0;
	numSides = 0;
}

/**
 * Display the alert modal
 * @param {event} e 
 */
const alert = (e) => {
	// prevent default action for window.alert() method
	e.preventDefault(); 
	// update CSS to display window
	document.getElementById("alert").style.transition = ".5s";
	document.getElementById("alert").style.opacity = "1";
	document.getElementById("alert").style.zIndex = "10";
}

// Alert OK button
document.getElementById("ok").addEventListener("click", () => {
	// update CSS to hide window
	document.getElementById("alert").style.transition = ".5s";
	document.getElementById("alert").style.opacity = "0";
	document.getElementById("alert").style.zIndex = "-10";
	// reset operation
	clearOutput();
	document.getElementById("roll-window").innerHTML = "";
});