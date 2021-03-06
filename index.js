var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
    TextureCache = PIXI.utils.TextureCache;
    Rectangle = PIXI.Rectangle;
    Texture = PIXI.Texture;
    Graphics = PIXI.Graphics;

var stage = new Container(),
renderer = autoDetectRenderer(
 	350, 450,
 	{transparent: false}
 ),
state, passages, ts, pockRect;

var pocketArray = [],
arrows = [];
roomTex = [],
passageTex = [],
itemTex = [],
IAreasTex = [],
elems = [],
iAreas = [],
rooms = [];
var itemCounter = passageCounter = 0;

stage.pockpage = 0;
stage.itemChosen = null;

root.appendChild(renderer.view);
loader
	.add("img/tileset.json")
	.add("img/square.png")
	.add("img/myArrow.png")
	.add("img/secretPlace.png")
	.add("img/secret1.png")
	.add("img/secret1Opened.png")
	.load(setup);


function setup () {

	// document.body.style.cursor = "url('img/square.png'), pointer";
	// console.log('Successfully');
	ts = resources["img/tileset.json"].textures;
	// room = new Sprite(ts["room1.png"]);
	// stage.addChild(room);

	roomTex.push(ts["room1.png"], ts["room2.png"], ts["room3.png"],
		ts["room4.png"], ts["room5.png"]);

	itemTex.push(ts["circle.png"], resources["img/square.png"].texture);

	IAreasTex.push (resources["img/secretPlace.png"].texture, resources["img/secret1.png"].texture);

	passageTex.push(ts["passage1.png"], ts["passage2.png"]);
	//-------------------------------------------------
	// Think about tileset-pocket; separate textures/sprites...
	// pocketContainer = new Container();
	// pocketContainer.x = 10;
	// pocketContainer.y = 330.5;

	// pocketContainer.interactive = true; // ??
	// pocketContainer.buttonMode = true;

	// pocketContainer

 //        .on('mouseover', onButtonOverPocket)
 //        .on('mouseout', onButtonOutPocket)

 //    pocketContainer.addChild(pocket);


	//--------------------------------------------------------
	// pocket structure
	var posx = 34, posy = 360, offsetx = 60;

	var page = 2, number = 5;
	for (var i = 0; i < page; i++) {
	pocketArray[i] = [];
	for (var j = 0; j < number; j++){
		var cell = {};
		cell.isEmpty = true;
		cell.cx = posx + offsetx*j;
		cell.cy = posy;
		cell.cont = null;
		pocketArray[i][j] = cell;
	}
}

	// for (var b = 0; b < pocketArray.length; b++) {
	// 	for (var c = 0; c<pocketArray[b].length; c++) {
	// 		console.log(pocketArray[b][c]);
	// 	}
	// }
	pockRect = new Graphics();
	pockRect.beginFill(0x66CCFF);
	pockRect.drawRect(0, roomTex[0].height, renderer.width, renderer.height-roomTex[0].height);
	pockRect.alpha = 0;
	pockRect.endFill();
	pockRect.interactive = false;

	pockRect

	.on('mousedown', deactivateChosenItem)

	stage.addChild(pockRect);




	//--------------------------------------------------------



	for (var i = 0; i<5; i++) {
		rooms.push(createRoom(i, roomTex[i], [], []));
	}
   //-----------------------------------------------------------

   	rooms[0].createPassage(passageTex[0], rooms[3], onCenterX(passageTex[0], -50), 20);
   	rooms[0].createPassage(null, rooms[1], roomTex[0].width-60,(roomTex[0].height-250)/2, 60, 250); // optimize!;
   	// rooms[0].createItem(itemTex[0], true, 60, fromEdgeY(itemTex[0],-50));
   	// rooms[0].createItem(itemTex[1], true, 90, fromEdgeY(itemTex[0]));
   	// rooms[0].createItem(itemTex[1], true, 20, fromEdgeY(itemTex[0])); //
   	// rooms[0].createItem(itemTex[0], true, 150, fromEdgeY(itemTex[0]));
   	rooms[0].createItem(itemTex[1], true, 190, fromEdgeY(itemTex[0]), "square");
   	rooms[0].createInteractArea(IAreasTex[0], 0, fromEdgeY(IAreasTex[0]), false);
   	// rooms[0].createItem(itemTex[0], true, fromEdgeX(itemTex[0]), 404);
   	rooms[1].createPassage(null, rooms[2], roomTex[0].width-60,(roomTex[0].height-250)/2, 60, 250);
   	rooms[1].createPassage(null, rooms[0], 0,(roomTex[0].height-250)/2, 60, 250);
   	rooms[1].createPassage(passageTex[0], rooms[4], onCenterX(passageTex[0]), fromEdgeY(passageTex[0]));
   	// rooms[1].createItem(itemTex[0], true, 80, fromEdgeY(itemTex[0],-50));
   	rooms[2].createPassage(null, rooms[1], 0,(roomTex[0].height-250)/2, 60, 250);
   	// rooms[2].createItem(itemTex[0], true, fromEdgeX(itemTex[0]), fromEdgeY(itemTex[0],-50));
   	// rooms[2].createItem(itemTex[0], true, 80, fromEdgeY(itemTex[0],-50));
   	rooms[3].createPassage(passageTex[1], rooms[0], onCenterX(passageTex[1]), fromEdgeY(passageTex[1]));
   	rooms[3].createInteractArea(IAreasTex[1], 50, 50);

   	rooms[4].createPassage(passageTex[1], rooms[1], onCenterX(passageTex[1]), 0);
   	rooms[4].createItem(itemTex[0], true, fromEdgeX(itemTex[0]), fromEdgeY(itemTex[0],-50), "circle");
   	// rooms[4].createItem(itemTex[0], true, 80, fromEdgeY(itemTex[0],-50));

   	// rooms[0].createPassage(passageTex[0], rooms[3], fromEdgeX(passageTex[0]), 0);

  //  	rooms[3].createPassage(passageTex[1], rooms[0], onCenterX(passageTex[1]), 320);

  //  	rooms[2].createItem(itemTex[0], true, fromEdge(itemTex[0]),
		// onCenterY(itemTex[0], -40));

	// var pass1 = rooms[3].createPassage(passageTex[0], rooms[2], 100, 100);
	//  !!! var pass1 =
	// rooms[2].createPassage(null, rooms[1], 0, ((renderer.height-200)/2), 80, 200);
	iAreas[1].opened = resources["img/secret1Opened.png"].texture;

	iAreas[1]
	.on('mousedown', onIArea1down)


	for (var ar = 0; ar < 2; ar++) {
		var arrow = new Sprite(resources["img/myArrow.png"].texture);
		arrow.buttonMode = true;
		arrow.interactive = true;

		arrow
		.on('mousedown', onButtonDownArrow)
        .on('touchstart', onButtonDownArrow)
        .on('mouseover', onButtonOverH)
        .on('mouseout', onButtonOutH)

        arrows.push(arrow);
        elems.push(arrow);
	}

	arrows[0].width -= (resources["img/myArrow.png"].texture.width)*2;
	arrows[0].x = arrows[0].width+5;
	arrows[0].y = fromEdgeY(resources["img/myArrow.png"].texture, 45);
	arrows[1].x = fromEdgeX(resources["img/myArrow.png"].texture,-5);
	arrows[1].y = fromEdgeY(resources["img/myArrow.png"].texture, 45);

	arrows[0].direction = -1;
	arrows[1].direction = 1;


	// rooms[0].addChild(pockRect);

	// stage.addChild(pockRect, generateScreen(rooms[0]));      startpoint; don't have cursor

	stage.addChild(generateScreen(rooms[0]));



	// stage.addChild(arrows[0],arrows[1]);



	//-----------------------------------------------------------
	state = play;
	gameLoop();
}

function gameLoop() {

	requestAnimationFrame (gameLoop);
	state();
	renderer.render(stage);
}
function play () {

	if ((stage.itemChosen) && (!pockRect.interactive)) {
		pockRect.interactive = true;
	}

	if (stage.pockpage == 0) {
 		arrows[0].visible = false;
 	} else {
 		arrows[0].visible = true;
 	}

 	if (stage.pockpage == 1) {
 		arrows[1].visible = false;
 	} else {
 		arrows[1].visible = true;
 	}
};

// methods of the room should be in the room creating block!

function generateScreen (field) {
	field.addChild(arrows[0], arrows[1]);
	return field;
}

function createRoom (ID, texture, passage, item) { // p, i
	var room = new Container();
	room.TYPE = "room";
	room.ID = ID;
	room.passage = passage;
	room.item = item;
	var sprite = new Sprite (texture);
	room.createItem = createItem;
	room.createPassage = createPassage;
	room.createInteractArea = createInteractArea;
	room.addChild(sprite);
	return room;
}

function createPassage (texture, destination, x, y, w, h) {
	var passage;

	if (texture) {
		passage = new Sprite(texture);
		passage.x = x || 0;
		passage.y = y || 0;

	passage

        .on('mouseover', onButtonOverH)
        .on('mouseout', onButtonOutH)
	}
	else {
		// passage = new Rectangle (x, y, w, h);
		passage = new Graphics();
		passage.beginFill(0x66CCFF);
		passage.drawRect(x, y, w, h);
		passage.alpha = 1;
		passage.endFill();
	}
	passage.TYPE = "passage";
	passageCounter++;	// shorter;
	passage.ID = passageCounter;
	passage.startpoint = this;
	passage.destination = destination;
	passage.interactive = true;
	passage.buttonMode = true;

	passage

		.on('mousedown', onButtonDownPass)
    	.on('touchstart', onButtonDownPass)


	this.addChild(passage);
	this.passage.push(passage);
	elems.push(passage);
	return passage;
}

function createInteractArea (texture, x, y, visible) {
	var iArea = new Sprite (texture);
	iArea.x = x || 0;
	iArea.y = y || 0;
	iArea.interactive = true;
	if (visible === false) iArea.visible = false;
	iAreas.push(iArea);
	this.addChild(iArea);
}

function createItem (texture, handheld, x, y, name) {
	var item = new Sprite (texture);
	item.TYPE = "item";
	item.NAME = name;
	itemCounter++; // shorter;
	item.ID = itemCounter;
	item.x = x || 0;
	item.y = y || 0;
	item.handheld = handheld;

	if (handheld) {
		item.interactive = true;
		item.buttonMode = true;
		// console.log('Catch!');
	item
		.on('mousedown', onButtonDownH)
        .on('touchstart', onButtonDownH)
        .on('mouseover', onButtonOverH)
        .on('mouseout', onButtonOutH)
	} else {
		console.log('Not hendheld');
	}
	if (this.TYPE == "room") {  // ???
		this.addChild(item);
		this.item.push(item);
		elems.push(item);
	}
	return item;
}

function pish () {
	this.isOver = true;
	// pocket.isOver = true;
	console.log('useless thingy');
}

function pish2 () {
	this.isOver = false;
}
function onButtonDownH () {
	this.alpha = 1;
	// this.visible = false;
	 // central points of cells; function (!!!) getInPocket.. isEmpty...
	getOnPocket(this); // if not???
	// ???
	// this.interactive = false;

	// document.getElementById('pocket').value++;
	// this.isdown = false;
}
// function getOnPocket (item) {
// 	stage.addChild(item);
// 	var pos = checkPocketPlace (item);
// 	// if (pos !== false) {
// 	// 	// item.visible = false;
// 	// 	item.handheld = false; // ??
// 	// 	item.x = pocketArray[pos].cx;
// 	// 	item.y = pocketArray[pos].cy;
// 		pocketArray[pos].isEmpty = false;




// function checkPocketPlace () {
// 	for (var i = 0; i<pocketArray.length; i++) {
// 		if (pocketArray[i].isEmpty) return i;
// 	}
// 	return false;
// }
function getOnPocket (item) {
	stage.addChild(item);
	item.TYPE = "POCKET item";
	item.scale.set(0.8, 0.8); // temporarily
	item
		.off('mousedown', onButtonDownH)
		.off('touchstart', onButtonDownH)
		.off('mouseover', onButtonOverH)
		.off('mouseout', onButtonOutH)

		.on('mouseover', onButtonOverItemP)
		.on('mouseout', onButtonOutItemP)
		.on('mousedown', onButtonDownItemP)
		.on('touchstart', onButtonDownItemP)

	for (var p = 0; p<pocketArray.length; p++) {
		for (var n = 0; n<pocketArray[p].length; n++) {
			if (pocketArray[p][n].isEmpty) {
						// console.log('Пустой же!');
				item.x = pocketArray[p][n].cx;
				item.y = pocketArray[p][n].cy;
				pocketArray[p][n].isEmpty = false;    // Why isEmpty @ cont = null --> it's the same!
				pocketArray[p][n].cont = item;
				if (p == stage.pockpage) {
					item.visible = true;
				} else {
					item.visible = false;
				}
			return; // ???
			}
		}
	}
}

function removeFromPocket (item) {
	item.visible = false;
	for (var p = 0; p<pocketArray.length; p++) {
		for (var n = 0; n<pocketArray[p].length; n++) {
			if ((pocketArray[p][n].cont) && (pocketArray[p][n].cont == item)) {
				pocketArray[p][n].cont = null;
				pocketArray[p][n].isEmpty = true;
			}
		}
	}
}

function onButtonOverH () {
	// console.log('over');
	this.isOver = true;
	this.alpha = 0.8;
}

function onButtonOverItemP () {
	this.isOver = true;
	// this.alpha = 0.8;
	this.scale.set(1, 1);
	this.rotation = 0.1;
}

function onButtonOutItemP () {
	this.isOver = false;
	// this.alpha = 0.8;
	this.scale.set(0.8, 0.8);
	this.rotation = 0;
}


function onButtonDownItemP () {
	activateChosenItem(this);
}

function onButtonOutH () {
	this.isOver = false;
	this.alpha = 1;
}

function onButtonDownPass () {
	stage.removeChild(this.startpoint);
	stage.addChild(generateScreen(this.destination));
	// this.startpoint.visible = false; ??
	// this.destination.visible = true; ??
	// this.isdown = false;
}

 // function onButtonDownArrow () {

 // 	var pos;
 // 	for (var i = 0; i<pocketArray.length; i++) {
 // 		for (var j=0; j<pocketArray[i].length; j++) {

 // 			if ((pos == undefined) && pocketArray[i][j].cont.visible) {
 // 				pos = i;
 //  			}
 //  		// console.log(pos);
 //  			if(i == pos && (pocketArray[i][j].cont)) pocketArray[i][j].cont.visible = false;
 //  			if ( (i - pos == 1) && (pocketArray[i][j].cont)) {
 // 			console.log(i);
 // 			pocketArray[i][j].cont.visible = true;
 // 			stage.pockpage = i;
 // 			console.log(stage.pockpage);
 // 			}
 // 		}

 // 	}
 // }

 function onButtonDownArrow () {
 	showPocketPage(stage.pockpage + this.direction);
}
 function showPocketPage(page) {
 	for (var i = 0; i<pocketArray.length; i++) {
 		for (var j = 0; j<pocketArray[i].length; j++) {
 			if (i == page && (pocketArray[i][j].cont)) {
 				pocketArray[i][j].cont.visible = true;
 			}
 			if (i != page && (pocketArray[i][j].cont)) {
 				pocketArray[i][j].cont.visible = false;
 			}
 		}
 	}
 	stage.pockpage = page;
}

function onIArea1down () {
	if (stage.itemChosen) {
 	var item = stage.itemChosen;
		if (item.NAME == "circle") {
		 	deactivateChosenItem ();
		 	removeFromPocket(item);
		 	this.texture = this.opened;
		 	iAreas[0].visible = true;
	 	}
 	}
}
function deactivateChosenItem () {
  	stage.itemChosen.scale.set(0.8, 0.8);
	stage.itemChosen.alpha = 1;     // this two lines is reduntant if it's neccessary to remove item!
	stage.itemChosen = null;
	document.getElementById('root').style.cursor = "auto";
		for (var i=0; i<elems.length; i++) {
			elems[i].buttonMode = true;
			elems[i].interactive = true;
		}
	pockRect.interactive = false;
}

function activateChosenItem (item) {
  	item.rotation = 0;
	item.alpha = 0.6;

	stage.itemChosen = item;
	if (item.NAME == "circle") {
		document.getElementById('root').style.cursor = "url('img/curcir.png'), pointer";
	}
	if (item.NAME == "square") {
		document.getElementById('root').style.cursor = "url('img/cursquare.png'), pointer";
	}

	for (var i=0; i<elems.length; i++) {
		elems[i].buttonMode = false;
		elems[i].interactive = false;
	}
}
 // function goToTheNextPage (i) {
 // 	console.log('goToTheNextPage');
 // 	for (var p = 0; p<pocketArray.length; p++) {
 // 		for (var n=0; n<pocketArray[p].length; n++) {
 // 			if (p = i) {
 // 				console.log('catch');
 // 				pocketArray[p][n].cont.visible = false;
 // 				pocketArray[p+1][n].cont.visible = true;
 // 			}
 // 		}
 // 	}
 //  }
// function onButtonOverPocket () {
// 	pocket.isOver = true;
// 	console.log('overPock');
// 	// pocket.texture = pocket.opened;
// 	// pocket.y-=70;
// 	// this.x= onCenterX(this.texture);
// 	// this.y= fromEdgeY(this.texture);
// 	for (var i = 0; i < pocketContainer.children.length; i++) {
// 		if (pocketContainer.children[i] == pocket) continue;
// 		pocketContainer.children[i].visible = true;
// 	};
// }

// function onButtonOutPocket () {
// 	pocket.isOver = false;
// 	// pocket.texture = pocket.hidden;
// 	// pocket.y+=70;
// 	// pocket.x = onCenterX(pocket.texture);
// 	// pocket.y = fromEdgeY(pocket.texture);
// 	for (var i = 0; i < pocketContainer.children.length; i++) {
// 		if (pocketContainer.children[i] == pocket) continue;
// 		pocketContainer.children[i].visible = false;
// 	};
// }

function onCenterX (texture, offset) {
	var pos = (roomTex[0].width-texture.width)/2;
	if (offset) pos+= offset;
	return pos;

}

function onCenterY (texture, offset) {
	var pos = (roomTex[0].height-texture.height)/2;
	if (offset) pos+= offset;
	return pos;
}

function fromEdgeX (texture, offset) {
	var pos = roomTex[0].width-texture.width;
	if (offset) pos+= offset;
	return pos;
}

function fromEdgeY (texture, offset) {
	var pos = roomTex[0].height-texture.height;
	if (offset) pos+= offset;
	return pos;
}
