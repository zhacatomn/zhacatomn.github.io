function update() {
    currentMap.run.call(currentMap);
    library.update();
    requestAnimationFrame(function () { update.call(currentMap); });
}
var camera = document.getElementById("screen"); //link to the screen
var cameraW = 800;
var cameraH = 600;
var currentMapDIV; //linking to the current map container
var currentMap;
var stopRecurring = false;
var idGenerator = 1;
camera.style.width = cameraW + "px";
camera.style.height = cameraH + "px";
camera.style.overflow = "hidden";
camera.style.position = "absolute";
var map = {
    set value(v) {
        this._value = v; //change value of map
        //check if the id aligns with one of the maps
        for (var i = 0; i < mapContainer.length; i++) {
            if (mapContainer[i].id == this._value) {
                currentMapDIV = document.getElementById(mapContainer[i].id); //set current map div to the new map
                currentMap = mapContainer[i]; //set currentMap to the new map
                for (var i = 0; i < mapContainer.length; i++) {
                    document.getElementById(mapContainer[i].id).style.display = "none"; //set all map to have no display
                }
                currentMapDIV.style.display = "inline"; //set only current map to have a display
                console.log("test");
                if (!stopRecurring) {
                    stopRecurring = true;
                    update(); //run the update function (only once so that the functions do not overlap)
                }
            }
        }
    },
    get value() {
        return this._value;
    }
};
var mapContainer = [];
var keyDown = [];
window.addEventListener("keydown", function (e) {
    keyDown[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
    keyDown[e.keyCode] = false;
});
var library;
(function (library) {
    var map_create = (function () {
        function map_create(object) {
            var _this = this;
            this.objectContainer = [];
            this.add_elements = function (elements) {
                var prev_container = currentMapDIV;
                var prev_map = currentMap;
                currentMapDIV = document.getElementById(_this.id);
                currentMap = _this;
                elements.call(_this);
                currentMapDIV = prev_container;
                currentMap = prev_map;
            };
            this.run = function (new_run) {
                _this.run = new_run;
            };
            for (var i in object) {
                this[i] = object[i];
            }
            camera.innerHTML += "<div id = '" + this.id + "'></div>"; //adding the div, and linking it to a div
            var created = document.getElementById(this.id);
            for (var i in object.style) {
                created.style[i] = object.style[i];
            }
            created.style.position = "absolute";
            created.style.width = this.w + "px";
            created.style.height = this.h + "px";
            created.style.left = this.x + "px";
            created.style.top = this.y + "px";
            mapContainer.push(this); //pushing the map into an array
        }
        return map_create;
    }());
    library.map_create = map_create;
    var create = (function () {
        function create(object) {
            var _this = this;
            this.on = function (event, code1, code2) {
                if (code2 === void 0) { code2 = function () { }; }
                if (event == "hover") {
                    document.getElementById(_this.id).addEventListener("mouseover", function () {
                        code1.call(currentMap);
                    });
                    document.getElementById(_this.id).addEventListener("mouseout", function () {
                        code2.call(currentMap);
                    });
                }
                if (event == "click") {
                    document.getElementById(_this.id).addEventListener("click", function () {
                        code1.call(currentMap);
                    });
                }
            };
            //setting x, y, id and style
            for (var i in object) {
                this[i] = object[i];
            }
            this.id = idGenerator + " ";
            idGenerator++;
            //creating the div
            currentMapDIV.innerHTML += "<div id = '" + this.id + "'></div>";
            var created = document.getElementById(this.id);
            //style object
            for (var i in object.style) {
                created.style[i] = object.style[i];
            }
            //setting position and text of objects
            created.style.position = "absolute";
            created.style.left = this.x + "px";
            created.style.top = this.y + "px";
            created.style.width = this.w + "px";
            created.style.height = this.h + "px";
            created.innerHTML = object.content;
            //store all te objects in an array
            currentMap.objectContainer.push(this);
        }
        return create;
    }());
    library.create = create;
    function update() {
        for (var i = 0; i < currentMap.objectContainer.length; i++) {
            var updating = document.getElementById(currentMap.objectContainer[i].id);
            //change x and y positions
            updating.style.left = currentMap.objectContainer[i].x + "px";
            updating.style.top = currentMap.objectContainer[i].y + "px";
            updating.style.width = currentMap.objectContainer[i].w + "px";
            updating.style.height = currentMap.objectContainer[i].h + "px";
            //change the style
            for (var k in currentMap.objectContainer[i].style) {
                updating.style[k] = currentMap.objectContainer[i].style[k];
            }
            // updating the content
            updating.innerHTML = currentMap.objectContainer[i].content;
        }
        //change x and y positions
        currentMapDIV.style.left = currentMap.x + "px";
        currentMapDIV.style.top = currentMap.y + "px";
    }
    library.update = update;
    function collide(obj1, obj2) {
        var foo1 = obj1;
        var foo2 = obj2;
        for (var i = 0; i < 2; i++) {
            if (foo1.x >= foo2.x && foo1.x <= foo2.x + foo2.w ||
                foo1.x + foo1.w >= foo2.x && foo1.x + foo1.w <= foo2.x + foo2.w) {
                if (foo1.y >= foo2.y && foo1.y <= foo2.y + foo2.h ||
                    foo1.y + foo1.h >= foo2.y && foo1.y + foo1.h <= foo2.y + foo2.h) {
                    return true;
                }
            }
            foo1 = obj2;
            foo2 = obj1;
        }
        return false;
    }
    library.collide = collide;
    function keyPress(x) {
        if (keyDown[x])
            return true;
        else
            return false;
    }
    library.keyPress = keyPress;
    function trajectory(x, angle, intialV) {
        var radToDeg = Math.PI / 180;
        var result = (x * Math.tan(angle * radToDeg)) - ((9.80 * Math.pow(x, 2)) /
            (2 * Math.pow(intialV, 2) * Math.pow(Math.cos(angle * radToDeg), 2)));
        if (result > 0)
            return result;
        else
            return 0;
    }
    library.trajectory = trajectory;
})(library || (library = {}));
// Setup 
var game = new library.map_create({
    w: cameraW,
    h: cameraH,
    x: 0,
    y: 0,
    id: "game",
    style: {}
});
//VARIABLES
var next_block = Math.floor(Math.random() * 7);
var current_block = Math.floor(Math.random() * 7);
var current_block_array = [];
var all_blocks = []; // a 1d array
var grid_array = []; // a 2d array which I should have used from the start but am now too lazy to change
for (var i = 0; i < 20; i++) {
    grid_array[i] = [];
    for (var k = 0; k < 10; k++) {
        grid_array[i][k] = 0;
    }
}
var block_id = [
    [0, 2, 4, 6],
    [0, 1, 2, 4],
    [0, 1, 3, 5],
    [1, 2, 3, 5],
    [1, 2, 3, 4],
    [0, 2, 3, 5],
    [0, 1, 2, 3] // Cube
];
var frame = 0; // frame counter
var unit_length = 600 / 20; // length of one square
var generate_first_block = 0;
//only detect one key press at a time
var press_r = true;
var press_a = 0;
var press_d = 0;
//speed of the block
var speed = 30;
//score
var score = 0;
var no_of_lines = 0;
////////////////////////
game.add_elements(function () {
    var _this = this;
    this.grid = new library.create({
        x: 0,
        y: 0,
        h: 600,
        w: 300,
        content: " ",
        style: {
            "backgroundColor": "grey",
            "border": "1px solid black"
        }
    });
    this.score = new library.create({
        x: 450,
        y: 100,
        h: 100,
        w: 200,
        content: "<span style='text-align: center;'>Score: <br> 0 </span>",
        style: {
            "border": "1px solid black",
            "fontFamily": "FFF Forward",
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center"
        }
    });
    this.next_display = [];
    // generating the next_display
    for (var i = 0; i < 9; i++) {
        if (i == 8) {
            this.foo = new library.create({
                x: 520,
                y: 250,
                w: unit_length * 2,
                h: unit_length,
                content: "<span style='text-align: center;'>Next Piece</span>",
                style: {
                    "fontFamily": "FFF Forward",
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
    this.generateBlock = function () {
        //random color generator
        var color = " ";
        if (current_block == 0)
            color = "cyan"; // I
        else if (current_block == 1)
            color = "orange"; // L
        else if (current_block == 2)
            color = "blue"; // J
        else if (current_block == 3)
            color = "purple"; // T
        else if (current_block == 4)
            color = "red"; // Z
        else if (current_block == 5)
            color = "lime"; // S
        else if (current_block == 6)
            color = "yellow"; // O
        for (var i = 0; i < _this.next_display.length; i++) {
            _this.next_display[i].style["backgroundColor"] = "white";
            _this.next_display[i].style["border"] = "";
        }
        for (var i = 0; i < 4; i++) {
            current_block_array[i] = new library.create({
                w: unit_length,
                h: unit_length,
                x: Math.floor(block_id[current_block][i] % 2) * unit_length + 4 * unit_length,
                y: Math.floor(block_id[current_block][i] / 2) * unit_length,
                content: " ",
                style: {
                    "backgroundColor": color,
                    "boxSizing": "border-box",
                    "border": "3px solid black"
                }
            });
        }
        // update the hold display
        if (next_block == 0)
            color = "cyan"; // I
        else if (next_block == 1)
            color = "orange"; // L
        else if (next_block == 2)
            color = "blue"; // J
        else if (next_block == 3)
            color = "purple"; // T
        else if (next_block == 4)
            color = "red"; // Z
        else if (next_block == 5)
            color = "lime"; // S
        else if (next_block == 6)
            color = "yellow"; // O
        for (var i = 0; i < 4; i++) {
            _this.next_display[block_id[next_block][i]].style["backgroundColor"] = color;
            _this.next_display[block_id[next_block][i]].style["border"] = "3px solid black";
        }
    };
    this.rotate = function () {
        if (current_block == 6)
            return;
        var save_axis = [[], [], [], []];
        for (var i = 0; i < 4; i++) {
            if (i == 2)
                continue;
            var foo_x = current_block_array[2].y - current_block_array[i].y;
            var foo_y = current_block_array[2].x - current_block_array[i].x;
            save_axis[i][0] = current_block_array[2].x + foo_x;
            save_axis[i][1] = current_block_array[2].y - foo_y;
            // prevent rotating off grid
            if (save_axis[i][0] >= _this.grid.w || save_axis[i][0] < 0)
                return;
            if (save_axis[i][1] >= _this.grid.h)
                return;
            for (var k = 0; k < all_blocks.length; k++) {
                if (save_axis[i][0] == all_blocks[k].x && save_axis[i][1] == all_blocks[k].y)
                    return;
            }
        }
        for (var i = 0; i < 4; i++) {
            if (i == 2)
                continue;
            current_block_array[i].x = save_axis[i][0];
            current_block_array[i].y = save_axis[i][1];
        }
    };
    //generate a new block
    this.newBlock = function () {
        for (var i = 0; i < 4; i++) {
            all_blocks.push(current_block_array[i]);
            grid_array[current_block_array[i].y / unit_length][current_block_array[i].x / unit_length] = 1;
        }
        current_block = next_block;
        next_block = Math.floor(Math.random() * 7);
        _this.generateBlock();
    };
    //clear a line
    this.clearLine = function (row) {
        var row_y = row * unit_length;
        for (var i = 0; i < all_blocks.length; i++) {
            if (all_blocks[i].style["display"] != "none") {
                if (all_blocks[i].y == row_y) {
                    all_blocks[i].style["display"] = "none";
                    grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 0;
                }
                else if (all_blocks[i].y < row_y) {
                    grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 0;
                    all_blocks[i].y += unit_length;
                }
            }
        }
        for (var i = 0; i < all_blocks.length; i++) {
            if (all_blocks[i].style["display"] == "none") {
                all_blocks.splice(all_blocks.indexOf(all_blocks[i]), 1);
                i -= 1;
            }
        }
        for (var i = 0; i < all_blocks.length; i++) {
            grid_array[all_blocks[i].y / unit_length][all_blocks[i].x / unit_length] = 1;
        }
        no_of_lines++;
    };
    this.movement = function (direction) {
        var toggle_sign = 1;
        if (direction == "right")
            toggle_sign = -1;
        for (var i = 0; i < 4; i++) {
            if (current_block_array[i].x <= 0 && direction == "left") {
                return;
            }
            else if (current_block_array[i].x + unit_length >= _this.grid.w && direction == "right") {
                return;
            }
            else if (grid_array[current_block_array[i].y / unit_length][current_block_array[i].x / unit_length - toggle_sign]) {
                return;
            }
        }
        for (var i = 0; i < 4; i++) {
            current_block_array[i].x -= toggle_sign * unit_length;
        }
    };
});
//SETUP END
//GAME LOOP
game.run(function () {
    frame++; // add frames
    no_of_lines = 0;
    if (!generate_first_block) {
        this.generateBlock();
        console.log(all_blocks);
        generate_first_block = 1;
    }
    if (library.keyPress(83)) {
        speed = 5;
        score++;
    }
    else
        speed = 30;
    for (var i = 0; i < 4; i++) {
        if (current_block_array[i].y + current_block_array[i].h >= this.grid.h) {
            if (library.keyPress(82))
                this.rotate(); //last minute rotation
            //last minute moving
            if (library.keyPress(65)) {
                this.movement("left");
            }
            else if (library.keyPress(68)) {
                this.movement("right");
            }
            this.newBlock();
            break;
        }
        else if (grid_array[current_block_array[i].y / unit_length + 1][current_block_array[i].x / unit_length]) {
            //last minute moving
            if (library.keyPress(65)) {
                this.movement("left");
            }
            else if (library.keyPress(68)) {
                this.movement("right");
            }
            // after last min moving, if there's a space underneath, continue with that block
            if (!grid_array[current_block_array[i].y / unit_length + 1][current_block_array[i].x / unit_length])
                break;
            this.newBlock();
            break;
        }
    }
    if (frame % speed == 0) {
        for (var i = 0; i < 4; i++) {
            current_block_array[i].y += unit_length;
        }
    }
    // MOVEMENT
    // rotate (R)
    if (library.keyPress(82) && press_r) {
        press_r = false;
        this.rotate();
    }
    if (!library.keyPress(82))
        press_r = true;
    //Move left and right
    if (library.keyPress(65)) {
        if (press_a % 5 == 0)
            this.movement("left");
        press_a++;
    }
    if (!library.keyPress(65))
        press_a = 0;
    if (library.keyPress(68)) {
        if (press_d % 5 == 0)
            this.movement("right");
        press_d++;
    }
    if (!library.keyPress(68))
        press_d = 0;
    //CHECK IF THERE'S A FULL ROW 
    var sum_of_row = 0;
    for (var i = 0; i < 20; i++) {
        sum_of_row = 0;
        for (var k = 0; k < 10; k++) {
            if (!grid_array[i][k])
                break;
            sum_of_row += grid_array[i][k];
            if (sum_of_row == 10) {
                this.clearLine(i);
            }
        }
    }
    // awarding points
    if (no_of_lines == 1)
        score += 40;
    else if (no_of_lines == 2)
        score += 100;
    else if (no_of_lines == 3)
        score += 300;
    else if (no_of_lines == 4)
        score += 1200;
    this.score.content = "<span style='text-align: center;'>Score: <br>" + score + "</span>";
});
map.value = "game";
