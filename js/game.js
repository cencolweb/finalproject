var oppYPos = [];
var oppXPos = [];
var mashroomXPos = [];
var mashroomYPos = [];
var avatarX = 0;
var avatarY = 0;
var playerImage;
var oppImage;
var mashroomImage;
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
var soundEnabled = true;
var tickTime = 15;
var currentLevel = 1;
var positionFactor = 1;
var enemiesPerSecond = 1/20;
var gameCanvas = document.getElementById("gameCanvas");
var canvasContext = gameCanvas.getContext("2d");

function play(playname, playtype) {
	var audio;
	switch(playname) {
		case "menubackground" : soundbackground = new Audio('audio/menubackground.mp3');
		 						break;
		case "menuhover"	  : soundforeground = new Audio('audio/menuhover.mp3');
		 						break;
		case "menuclick"	  : soundforeground = new Audio('audio/menuclick.wav');
		 						break;
		case "gameover"		  : soundbackground = new Audio('audio/gameover.mp3');
		 						break;
		case "playbackground" : soundbackground = new Audio('audio/playbackground.mp3');
		 						break;
	}
	if(soundEnabled) soundbackground.play();
}

function muteUnmute() {
	if(soundEnabled) {
		soundEnabled = false;
		soundbackground.pause();
		$(".soundcontrol img").attr("src", "img/mute.png");
	} else {
		soundEnabled = true;
		soundbackground.play();
		$(".soundcontrol img").attr("src", "img/unmute.png");
	}
}

$(".soundcontrol").click(function() {
	muteUnmute();
});

function stop(playname) {
	playname.pause();
	playname.currentTime = 0;
}
play('menubackground', '');

$(".menucanvas .menubutton").hover(function() {
    if(!soundEnabled) play('menuhover');
  }, function() {

});

$( ".menucanvas .menubutton" ).click(function() {
    play('menuclick');
  });

function showPanel(panelname) {
	$("#gameCanvas").hide();
	$("#mainmenu").hide();
	$("#escmenu").hide();
	$("#description").hide();
	$("#gameover").hide();
	$(".stats").hide();
	if(panelname == "gameCanvas") {
		$(".stats").show();
	}
	if(panelname == "escmenu") {
		$("#gameCanvas").show();
	}
	$("#" + panelname).show();
}

showPanel("mainmenu");
// interval = setInterval(gamePlay, 8);



function decreaseLife() {
	$(".life:last").remove();
}

function increaseLife() {
	$($('<img class="life" src="img/life.png" //>')).appendTo(".gamestats");
}

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
		gameplay();
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





$("#btnexit").click(function() {
	stop(soundbackground);
	play("menubackground", "");
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
	console.log("init game called");
	oppYPos = [];
	oppXPos = [];
	mashroomYPos = [];
	mashroomXPos = [];
	avatarX = 0;
	avatarY = 0;
	playerImage;
	oppImage;
	paused = false;
	hits = 0;
	tickTime = 15;
	currentLevel = 1;
	positionFactor = 1;
	enemiesPerSecond = 1/20;
	increaseLife(); increaseLife(); increaseLife(); increaseLife();
	// initialize controls
	gameCanvas = document.getElementById("gameCanvas");
	canvasContext = gameCanvas.getContext("2d");

	playerImage = new Image();
	oppImage = new Image();
	mashroomImage = new Image();
	oppImage.src = "img/enemy.png";
	playerImage.src = "img/avatar.png";
	mashroomImage.src = "img/mashroom.png";

	$('.levelcount').html('1');
	
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
	startTime = 0;

	// starts game
	
}

function mouseMove(mouseEvent) {
	// move player according to mouse movement
	avatarX = mouseEvent.offsetX;
	avatarY = mouseEvent.offsetY;
}


var gameplay = function gamePlay() {

	if(paused) return; // if game is paused, do nothing
	var totalOpps = oppXPos.length;
	var totalMashrooms = mashroomXPos.length;
	// control speed 
	startTime++;
	if(startTime > 200 && currentLevel == 1) { // 900
		currentLevel = 2;
		$('.levelcount').html(currentLevel);
		tickTime = 9;
	}
	if(startTime > 400 && currentLevel == 2) { // 4000
		currentLevel = 3;
		$('.levelcount').html(currentLevel);
		tickTime = 5;
		enemiesPerSecond = 1 / 13;
		positionFactor = 2;
	}

	

	// creates two new enemies per second ( 1 / 20)
	if (Math.random() < enemiesPerSecond)
	{
		oppXPos.push(0);
		oppYPos.push(Math.random() * frameWidth);
	}

	var mashroomVis = Math.random();
	if(mashroomVis < 1/999 && mashroomVis < 0.01) {
		mashroomXPos.push(0);
		mashroomYPos.push(Math.random() * frameWidth);
		console.log("Timer: " + startTime + " , Level : " + Math.random());
	}

	// move all enemies
	for(i=0;i<totalOpps;i++){
		oppXPos[i] = oppXPos[i] + positionFactor;
	}
	// move mashrooms 
	for(i=0;i<totalMashrooms;i++){
		mashroomXPos[i] = mashroomXPos[i] + positionFactor;
	}
	
	gameCanvas.width = frameWidth;		// clear canvas
	canvasContext.drawImage(playerImage, avatarX, avatarY); // draw avatar
	
	// draw new enemy positions
	for(i=0;i<totalOpps;i++){
		canvasContext.drawImage(oppImage, oppXPos[i], oppYPos[i]);
	}
	// move mashrooms 
	for(i=0;i<totalMashrooms;i++){
		canvasContext.drawImage(mashroomImage,  mashroomXPos[i], mashroomYPos[i])
	}

	// detect mashroom 
	for(i=0;i<totalOpps;i++){
		if ( ( (avatarX < mashroomXPos[i] && mashroomXPos[i] < avatarX + 35) || 
				(mashroomXPos[i] < avatarX && avatarX < mashroomXPos[i] + 35) ) 
					&& ( (avatarY < mashroomYPos[i] && mashroomYPos[i] < avatarY + 35) 
				|| (mashroomYPos[i] < avatarY && avatarY < mashroomYPos[i] + 35) ) ) {

				// remove mashroom on collision
				mashroomXPos.splice(i, 1);
				mashroomYPos.splice(i, 1);
			if(hits > 0) {
				increaseLife();
				hits--;
			}
		}
	}


	// detect collision and increase hits 
	for(i=0;i<totalOpps;i++){
		if ( ( (avatarX < oppXPos[i] && oppXPos[i] < avatarX + 35) || 
				(oppXPos[i] < avatarX && avatarX < oppXPos[i] + 35) ) 
					&& ( (avatarY < oppYPos[i] && oppYPos[i] < avatarY + 35) 
				|| (oppYPos[i] < avatarY && avatarY < oppYPos[i] + 35) ) ) {

			hits++;
			decreaseLife();
			// show health stat

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
	setTimeout(gameplay, tickTime);
}
//setTimeout(gameplay, 990);
// game start trigger
$("#btnstartgame").click(function() {
	paused = false;
	showPanel("gameCanvas");
	initGame();
	gameplay();
	stop(soundbackground);
	play("playbackground", "");
});