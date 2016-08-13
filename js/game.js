var oppYPos = [];
var oppXPos = [];
var avatarX = 0;
var avatarY = 0;
var playerImage;
var oppImage;
var paused = false;
var hits = 0;
var interval = null;
var startTime = null;
var highScore = 0;
var frameWidth = 900;
var frameHeight = 600;
var MainGame = null;
var MainMenu = null;
var soundbackground = null;
var soundforeground = null;
function play(playname, playtype) {
	var audio;
	switch(playname) {
		case "menubackground" : soundbackground = new Audio('audio/menubackground.mp3');
								soundbackground.play();
		 						break;
		case "menuhover"	  : soundforeground = new Audio('audio/menuhover.mp3');
								soundforeground.play();
		 						break;
		case "menuclick"	  : soundforeground = new Audio('audio/menuclick.wav');
								soundforeground.play();
		 						break;
		case "gameover"		  : soundbackground = new Audio('audio/gameover.mp3');
								soundbackground.play();
		 						break;
		case "playbackground" : soundbackground = new Audio('audio/playbackground.mp3');
								soundbackground.play();
		 						break;
	} 
	
}
function stop(playname) {
	playname.pause();
	playname.currentTime = 0;
}
play('menubackground', '');

$(".menucanvas .menubutton").hover(
  function() {
    play('menuhover');
  }, function() {
    
  }
);

$( ".menucanvas .menubutton" ).click(
  function() {
    play('menuclick');
  }
);

function showPanel(panelname) {
	$("#gameCanvas").hide();
	$("#mainmenu").hide();
	$("#escmenu").hide();
	$("#description").hide();
	$("#gameover").hide();
	if(panelname == "escmenu") {
		$("#gameCanvas").show();
	}
	$("#" + panelname).show();
}

showPanel("mainmenu");
interval = setInterval(gamePlay, 8);

function exitgame(){
	oppYPos = [];
	oppXPos = [];
	avatarX = 0;
	avatarY = 0;
	playerImage;
	oppImage;
	paused = false;
	hits = 0;
	//interval = null;

	hits = 0;
	paused = true;
	//clearInterval(interval);
	//interval = null;
}

// pause play  handler
function pausePlay() {
	if(paused) {
		paused = false;
		showPanel("gameCanvas");
		soundbackground.play();
	} else {
		paused = true;
		showPanel("escmenu");
		soundbackground.pause();
	}
}




$(document).keyup(function(e) {
 	//if (e.keyCode === 13) $('.save').click();     // enter
 	if (e.keyCode === 27) pausePlay();   // esc
});
$("#btnresume").click(function() {
	pausePlay();
});
$("#btninstructions").click(function() {
	showPanel("description");
});

$("#btnbacktomenu").click(function() {
	showPanel("mainmenu");
});


// game start trigger
$("#btnstartgame").click(function() {
	showPanel("gameCanvas");
	initGame();
	stop(soundbackground);
	play("playbackground", "");
});
$("#btnexit").click(function() {
	exitgame();
	showPanel("mainmenu");
});
$("#btnexitfromover").click(function() {
	stop(soundbackground);
	play("menubackground", "");
	exitgame();
	showPanel("mainmenu");

});
function initGame() {
	oppYPos = [];
	oppXPos = [];
	avatarX = 0;
	avatarY = 0;
	playerImage;
	oppImage;
	paused = false;
	hits = 0;
	//interval = null;

	// initialize controls
	var gameCanvas = document.getElementById("gameCanvas");
	playerImage = new Image();
	oppImage = new Image();
	oppImage.src = "img/enemy.png";
	playerImage.src = "img/avatar.png";

	
	// draws player image
	gameCanvas.getContext("2d").drawImage(playerImage, Math.random() * 100, Math.random() * 100);
	
	// attach mouse movement event
	gameCanvas.addEventListener("mousemove", mouseMove);

	// initialize configs
	$("#healthstat").css("width","100%");
	$("#gameover").hide();
	$("#start").prop('disabled', true);
	hits = 0;
	paused = false;
	startTime = new Date();

	// starts game
	
}

function mouseMove(mouseEvent) {
	// move player according to mouse movement
	avatarX = mouseEvent.offsetX;
	avatarY = mouseEvent.offsetY;
}

function gamePlay() {
	if(paused) return; // if game is paused, do nothing

	// get canvas and context
	var gameCanvas = document.getElementById("gameCanvas");
	var canvasContext = gameCanvas.getContext("2d");
	var totalOpps = oppXPos.length;
	
	// creates two new enemies per second ( 1 / 20)
	if (Math.random() < 1/20)
	{
		oppXPos.push(0);
		oppYPos.push(Math.random() * frameWidth);
	}

	// move all enemies
	for(i=0;i<totalOpps;i++){
		oppXPos[i] = oppXPos[i] + 1;
	}
	
	gameCanvas.width = frameWidth;		// clear canvas
	canvasContext.drawImage(playerImage, avatarX, avatarY); // draw avatar
	
	// draw new enemy positions
	for(i=0;i<totalOpps;i++){
		canvasContext.drawImage(oppImage, oppXPos[i], oppYPos[i]);
	}

	// detect collision and increase hits 
	for(i=0;i<totalOpps;i++){
		if ( ( (avatarX < oppXPos[i] && oppXPos[i] < avatarX + 25) || 
				(oppXPos[i] < avatarX && avatarX < oppXPos[i] + 25) ) 
					&& ( (avatarY < oppYPos[i] && oppYPos[i] < avatarY + 25) 
				|| (oppYPos[i] < avatarY && avatarY < oppYPos[i] + 25) ) ) {

			hits++;

			// show health stat
			$("#healthstat").css("width", (100 - hits*25) + '%');

			// if 4 times hits, game is over
			if(hits >= 4) {
				exitgame();
				showPanel("gameover");
				stop(soundbackground);
				play("gameover", "");			}
			// remove enemy on collision
			oppXPos.splice(i, 1);
			oppYPos.splice(i, 1);
		}
	}

}