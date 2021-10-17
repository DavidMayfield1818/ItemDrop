title = "ItemDrop";

description = `
[CLICK] to drop
[HOLD] to slow
`;

// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.
characters = [
`
Y    Y
YYYYYY
 RRRR
 bbbb
 bbbb
   bb
`
,
`
Y    Y
YYYYYY
 RRRR
 bbbb
 bbbb
 bb
`
,
`
 rr
rrrr
rrrr
 rr
`
,
`
   l
 yy
yy
yy
 yy
`
,
`
 gggg
GGGGGG
gggggg
 GGGG
`
,
`
g gg
 gg
yyyy
yyyy
 yy
`

];

const catcher_frames = {
	0: 'a',
	1: 'b'
}

const fruit_frames = {
	0: 'c',
	1: 'd',
	2: 'e',
	3: 'f'
}

options = {
	seed: 2,
    isPlayingBgm: true,
	isCapturing: true,
	isCapturingGameCanvasOnly: true,
	captureCanvasScale: 2
};

let pause_dir = 6;

const G = {
	WIDTH: 100,
	HEIGHT: 100
};

let gravity = 1;

/**
 * @typedef {{
 * pos: Vector,
 * fruit: number
 * }} Fruit
 */

/**
 * @type { Fruit []}
 */
let fList = [];

let maxSpeed = 0.5;
let speed = maxSpeed;
let dir = 1;

/**
 * @typedef {{
 * pos: Vector,
 * frame: number,
 * frame_pause: number
 * }} Catcher
 */

/**
 * @type { Catcher}
 */
let catcher;

catcher = {
	pos: vec(G.WIDTH/2, G.HEIGHT-10),
	frame: 0,
	frame_pause: 0
}

let timer = 600;

function update() {
	if (!ticks) {
	}

	if(timer <= 0){
		end();
	}

	if(input.isPressed){
		speed = 0;
	}
	else{
		speed = maxSpeed * dir;
	}

	// character movement
	if(catcher.pos.x >= G.WIDTH-10||catcher.pos.x <= 10)
	{
		speed *= -1;
		dir *= -1;
	}

	catcher.pos.x += speed;
	catcher.pos.clamp(0,G.WIDTH,0,G.HEIGHT);

	// character animation
	if(catcher.frame_pause <= 0){
		catcher.frame += 1;
		if(catcher.frame > 1){
			catcher.frame = 0;
		}
		catcher.frame_pause = pause_dir;
	}
	catcher.frame_pause -= 1;
	char(catcher_frames[catcher.frame],catcher.pos);


	if(input.isJustPressed){
		let tempFruit = {
			pos: vec(input.pos.x,10),
			fruit: Math.floor(rnd(0,4))
		}
		fList.push(tempFruit);
	}

	let killlist =[];
	fList.forEach((f,i) => {
		f.pos.y += gravity;
		char(fruit_frames[f.fruit],f.pos);

		if((char(fruit_frames[f.fruit],f.pos).isColliding.char.a)){
			killlist.push(i);
		}

		if(f.pos.y > G.HEIGHT){
			fList.splice(i,1);
			timer -= 60;
		}
	});

	killlist.forEach((i)=>{
		fList.splice(i,1);
		addScore(1);
		timer = 600;
	});

	timer -= 1;

	rect(0,7,timer/6,2);

}
