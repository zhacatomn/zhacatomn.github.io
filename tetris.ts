// Setup 
let game = new library.map_create({
	w:cameraW,
	h:cameraH,
	x:0,
	y:0,
	id:"game",
	style:{
	}
});

//VARIABLES

let next_block = Math.floor(Math.random() * 7);
let current_block = Math.floor(Math.random() * 7);

let current_block_array = [];

let all_blocks = []; // a 1d array

let grid_array = []; // a 2d array which I should have used from the start but am now too lazy to change
for(var i = 0; i < 20; i++){
	grid_array[i] = [];
	for(var k = 0; k < 10; k++){
		grid_array[i][k] = 0;
	}
}

let block_id = [
	[0,2,4,6], // I
	[0,1,2,4], // L
	[0,1,3,5], // Reverse L
	[1,2,3,5], // T
	[1,2,3,4], // Z
	[0,2,3,5], // S
	[0,1,2,3] // Cube

];

let frame = 0; // frame counter

let unit_length = 600/20; // length of one square

var generate_first_block = 0; 

//only detect one key press at a time
var press_r = true; 
var press_a = 0;
var press_d = 0;

//speed of the block
let speed = 30;

//score
let score = 0;

let no_of_lines = 0;

////////////////////////

game.add_elements(function(){
	this.grid = new library.create({
		x:0,
		y:0,
		h:600,
		w:300,
		content:" ",
		style:{
			"backgroundColor": "grey",
			"border": "1px solid black"
		}
	}); 

	this.score = new library.create({
	 		x: 450,
	 		y: 100,
	 		h: 100,
	 		w: 200,
	 		content: 
	 			"<span style='text-align: center;'>Score: <br> 0 </span>",
	 		style:{
	 			"border": "1px solid black",
	 			"fontFamily": "Century Gothic",
	 			
	 			"display": "flex",
	 			"justifyContent": "center",
	 			"alignItems": "center"
	 		}
	});

	this.next_display = [];


	// generating the next_display
	for(var i = 0; i < 9; i++){

		if(i == 8){
			this.foo = new library.create({
				x: 520,
				y: 250,
				w: unit_length * 2,
				h: unit_length,
				content: "<span style='text-align: center;'>Next Piece</span>",
				style: { 
	 				"fontFamily": "Century Gothic",
	 			
	 				"display": "flex",
	 				"justifyContent": "center",
	 				"alignItems": "center"
				}	
			});
		}

		else {
			this.foo = new library.create({
				x: (i % 2) * unit_length + 520,
				y: Math.floor(i / 2) * unit_length + 300,
				w: unit_length,
				h: unit_length,
				content: " ",
				style: { 
					"boxSizing": "border-box",
				}
			});
		}

		this.next_display.push(this.foo);
	}

	this.generateBlock = () => { // generates the tetries block
		//random color generator
		let color = " ";
		if(current_block == 0) color = "cyan"; // I
		else if(current_block == 1)color = "orange"; // L
		else if(current_block == 2)color = "blue";  // J
		else if(current_block == 3)color = "purple"; // T
		else if(current_block == 4)color = "red"; // Z
		else if(current_block == 5)color = "lime"; // S
		else if(current_block == 6)color = "yellow"; // O

		for(var i = 0; i < this.next_display.length; i++){ // reset the hold display
			this.next_display[i].style["backgroundColor"] = "white";
			this.next_display[i].style["border"] = "";
		}

		for (var i = 0; i < 4; i++){
			current_block_array[i] = new library.create({
				w: unit_length,
				h: unit_length,
				x: Math.floor(block_id[current_block][i] % 2) * unit_length + 4 * unit_length,
				y: Math.floor(block_id[current_block][i] / 2) * unit_length,
				content: " ",
				style:{
					"backgroundColor": color,
					"boxSizing": "border-box",
					"border": "3px solid black"
				}

			});
		}

		// update the hold display
		if(next_block == 0) color = "cyan"; // I
		else if(next_block == 1)color = "orange"; // L
		else if(next_block == 2)color = "blue";  // J
		else if(next_block == 3)color = "purple"; // T
		else if(next_block == 4)color = "red"; // Z
		else if(next_block == 5)color = "lime"; // S
		else if(next_block == 6)color = "yellow"; // O

		for (var i = 0; i < 4; i++){
			this.next_display[block_id[next_block][i]].style["backgroundColor"] = color;
			this.next_display[block_id[next_block][i]].style["border"] = "3px solid black";
		}

	}

	this.rotate = () => { //rotates the block
		if(current_block == 6)return;
		var save_axis = [[],[],[],[]];

		for(var i = 0; i < 4; i++){
			if(i == 2)continue;
			var foo_x = current_block_array[2].y - current_block_array[i].y;
			var foo_y = current_block_array[2].x - current_block_array[i].x;

			save_axis[i][0] = current_block_array[2].x + foo_x;
			save_axis[i][1] = current_block_array[2].y - foo_y;

			 // prevent rotating off grid
			if(save_axis[i][0] >= this.grid.w || save_axis[i][0] < 0)return;
			if(save_axis[i][1] >= this.grid.h) return;

			for(var k = 0; k < all_blocks.length; k++){ //prevent rotating into a block
				if(save_axis[i][0] == all_blocks[k].x && save_axis[i][1] == all_blocks[k].y)return;
			}
		}

		for(var i = 0; i < 4; i++){ // update coordinates of the block
			if(i == 2)continue;
			current_block_array[i].x = save_axis[i][0];
			current_block_array[i].y = save_axis[i][1];
		}
	}

	//generate a new block
	this.newBlock = () => {	
		for(var i = 0; i < 4; i++){
			all_blocks.push(current_block_array[i]);
			grid_array[current_block_array[i].y / unit_length][current_block_array[i].x / unit_length] = 1;
		}
		current_block = next_block;
		next_block = Math.floor(Math.random() * 7);
		this.generateBlock();
	}

	//clear a line
	this.clearLine = (row) => {
		let row_y = row * unit_length;
		for(var i = 0; i < all_blocks.length; i++){
			if(all_blocks[i].style["display"] != "none"){ 

				if(all_blocks[i].y == row_y){ // clear the selected row of blocks
					all_blocks[i].style["display"] = "none";
					grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 0;
				}

				else if(all_blocks[i].y < row_y){ // if that block is in any of the above rows
					grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 0;
					all_blocks[i].y += unit_length;
				}
			}
		}

		for(var i = 0; i < all_blocks.length; i++){
			if(all_blocks[i].style["display"] == "none"){
				all_blocks.splice(all_blocks.indexOf(all_blocks[i]), 1);
				i -= 1;
			}
		}

		for(var i = 0; i < all_blocks.length; i++){ //update all the values properly
			grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 1; 
		}

		no_of_lines++;
	}

	this.movement = (direction) => { //checking if the block is not moving off screen or is inside a block
		var toggle_sign = 1;
		if(direction == "right")toggle_sign = -1;

		for (var i = 0; i < 4; i++){
			if(current_block_array[i].x <= 0 && direction == "left"){ // at extreme left
				return;
			}

			else if(current_block_array[i].x + unit_length >= this.grid.w && direction == "right"){ // at extreme right
				return;
			}

			//block on either side
			else if(grid_array[current_block_array[i].y / unit_length][current_block_array[i].x / unit_length - toggle_sign]){ 
				return;
			}

		}

		for (var i = 0; i < 4; i++){
			current_block_array[i].x -= toggle_sign * unit_length;
		}

	}

});

//SETUP END

//GAME LOOP

game.run(function(){
	frame++; // add frames

	no_of_lines = 0; 

	if(!generate_first_block){ // generate first block
		this.generateBlock();
		console.log(all_blocks);
		generate_first_block = 1;
	}

	if (library.keyPress(83)){
		speed = 5;
		score++;
	}
	else speed = 30

	for(var i = 0; i < 4; i++){
		if(current_block_array[i].y + current_block_array[i].h >= this.grid.h){ // check if the block has reached the bottom
			if(library.keyPress(82))this.rotate(); //last minute rotation

			 //last minute moving
			 if(library.keyPress(65)){
			 	this.movement("left");
			 }

			 else if(library.keyPress(68)){
			 	this.movement("right");
			 }

			this.newBlock();
			break;
		}

		// check if land on another block
		else if(grid_array[current_block_array[i].y / unit_length + 1][current_block_array[i].x / unit_length]){

			//last minute moving
			 if(library.keyPress(65)){
			 	this.movement("left");
			 }

			 else if(library.keyPress(68)){
			 	this.movement("right");
			 }

			 // after last min moving, if there's a space underneath, continue with that block
			 if(!grid_array[current_block_array[i].y / unit_length + 1][current_block_array[i].x / unit_length]) break;

			this.newBlock();
			break;
		}
	}

	if(frame % speed == 0){ // move the block down every 1/2 a second
		for(var i = 0; i < 4; i++){
			current_block_array[i].y += unit_length;
		}
	}

	// MOVEMENT

	// rotate (R)
	if(library.keyPress(82) && press_r){
		press_r = false;
		this.rotate();
	}

	if(!library.keyPress(82))press_r = true;


	//Move left and right
	if(library.keyPress(65)){ // Press A to move left
		if(press_a % 5 == 0) this.movement("left");
		press_a++;
	}

	if(!library.keyPress(65)) press_a = 0

	if(library.keyPress(68)){ // Press D to move right
		if(press_d % 5 == 0) this.movement("right");
		press_d++;
	}

	if(!library.keyPress(68)) press_d = 0;

	//CHECK IF THERE'S A FULL ROW 
	var sum_of_row = 0;
	for(var i = 0; i < 20; i++){

		sum_of_row = 0;

		for(var k = 0; k < 10; k++){

			if(!grid_array[i][k]) break;
			sum_of_row += grid_array[i][k];

			if(sum_of_row == 10){
				this.clearLine(i);
			}
		}
	}

	// awarding points
	if(no_of_lines == 1)score += 40;
	else if (no_of_lines == 2)score += 100;
	else if (no_of_lines == 3)score += 300;
	else if (no_of_lines == 4)score += 1200; 

	this.score.content = "<span style='text-align: center;'>Score: <br>" + score + "</span>";

});

map.value = "game";