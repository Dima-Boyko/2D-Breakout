
var play_game=false;
var target_disabled=0;
var level=0;

var PressKey='';

const game=document.querySelector('.Breakout-field');
const platform=document.querySelector('.platform');
const ball=document.querySelector('.ball');
const button_sound=document.getElementById('sound');

const field={
	'width':game.offsetWidth,
	'height':game.offsetHeight,
	'center':game.offsetWidth/2
};



const center=field.width/2 ;




var ball_speed=5;
var live_ball={
	'x':center-ball.offsetWidth/2,
	'y':game.offsetHeight-40,
	'diameter':20,
	'move_x':ball_speed,
	'move_y':-ball_speed,
};

var sound=true;

const audio_hit = new Audio('sounds/hit.mp3');
const audio_punch = new Audio('sounds/jump.mp3');
const audio_game_over = new Audio('sounds/game-over.mp3');
const audio_new_level = new Audio('sounds/level.mp3');


//ball.style.left=live_ball.x+'px' ;
//ball.style.top=live_ball.y+'px' ;


var color_num=1;
var targets=[];
for(let r=0;r<2;r++){
	for(let i=0;i<6;i++){
	
		
		let left=i*110+10;
		let top=r*30+10;
		let target = document.createElement('div');
		target.classList.add('target');
		target.classList.add('color-'+color_num);
		target.style.top=top+'px';
		target.style.left=left+'px';
		game.appendChild(target);
		targets.push(target);
		color_num++;
		if(color_num>4)color_num=1;
	}
}
new_level();
AlertOpen('Press any key!');

var animationBall=setInterval(MoveBall,1);

function MoveBall(){
	if(!play_game)return false;
	live_ball.x+=live_ball.move_x;
	live_ball.y+=live_ball.move_y;
	ball.style.left=live_ball.x+'px' ;
	ball.style.top=live_ball.y+'px' ;
	Collision();
}

function Collision(){
	
	//Field
	if(live_ball.x>=(field.width - live_ball.diameter)){
		live_ball.move_x=-live_ball.move_x;
	}
	if(live_ball.x<=0){
		live_ball.move_x=-live_ball.move_x;
	}
	if(live_ball.y<=0){
		live_ball.move_y=-live_ball.move_y;
	}
	
	

	
	
	CollisionObject(platform);
	
	targets.forEach(function(block){
		CollisionObject(block,true);
	});
	
	//Game Over
	if(live_ball.y>=(field.height - live_ball.diameter)){
		level=0;
		new_level();
		AlertOpen('Game Over!');
		if(sound)audio_game_over.play();
		//live_ball.move_y=-live_ball.move_y;
	}
	
	
	
}

function CollisionObject(obj,destroy=false){
	let top=obj.offsetTop;
	let left=obj.offsetLeft;
	let width=obj.offsetWidth;
	let height=obj.offsetHeight;
	let collision_x=false;
	let collision_y=false;
	

	
	if( live_ball.y<=(top+height) && live_ball.y + live_ball.diameter>=top &&
	(live_ball.x+live_ball.diameter)>=left && live_ball.x<=(left+width))
	{

		if(live_ball.y<(top+height-2) && live_ball.y + live_ball.diameter>top+2 ){
			live_ball.move_x=-live_ball.move_x;

		}else{
			live_ball.move_y=-live_ball.move_y;	
			
		}
		
		
		
		if(destroy){
			obj.style.display='none';
			target_disabled++;
			if(target_disabled>=12){
				new_level();
				if(sound)audio_new_level.play();
			}else{
				
				if(sound)audio_punch.play();
			}
			
		}else{
			if(sound)audio_hit.play();
		}
		
	}
	
}

function new_level(){
	
	play_game=false;
	
	level++;
	if(level>1){
		AlertOpen('Level ' + level);
		ball_speed+=0.2;
	}else{
		ball_speed=1;
	}
	
	target_disabled=0;
	platform.style.left=(center-platform.offsetWidth/2)+'px' ;
	live_ball={
		'x':center-ball.offsetWidth/2,
		'y':game.offsetHeight-45,
		'diameter':20,
		'move_x':ball_speed,
		'move_y':-ball_speed,
	}
	
	ball.style.left=live_ball.x+'px' ;
	ball.style.top=live_ball.y+'px' ;
	
	
	targets.forEach(function(block){
		block.style.display='block';
	});
	
	document.getElementById('Level').innerText='Level ' + level;
	
}


document.addEventListener('keydown',function(e){
	
	
	if(play_game){
		if(e.key=='ArrowLeft' || e.key=='ArrowRight'){
			PressKey=e.key;
		}

	}else{
	
		AlertClose();
		play_game=true;
	}
	
});

document.addEventListener('keyup',function(e){
	
	if(play_game){
		if(e.key=='ArrowLeft' || e.key=='ArrowRight'){
			PressKey='';
		}

	}else{
		AlertClose();
		play_game=true;
	}
	
});

button_sound.addEventListener('click',function(){
	if(sound){
		sound=false;
		button_sound.classList.add('off');
	}else{
		sound=true;
		button_sound.classList.remove('off');
	}
})

var animationPlatform=setInterval(MovePlatform,30);

function MovePlatform(){
	if(PressKey=='ArrowLeft'){
		let move=platform.offsetLeft-20;
		if(move<=0)move=0;
		platform.style.left=move+'px';	
	}
	if(PressKey=='ArrowRight'){
		let move=platform.offsetLeft+20;
		if(move>=field.width-platform.offsetWidth){
			move=field.width-platform.offsetWidth;
		}
		platform.style.left=move+'px';	
	}
}

function AlertOpen(text){
	document.getElementById('alert').innerText=text;
	document.getElementById('alert').style.display='block';
}
function AlertClose(){
	document.getElementById('alert').style.display='none';
}
