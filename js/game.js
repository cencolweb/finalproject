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

function showPanel(panelname) {
	$("#gameCanvas").hide();
	$("#mainmenu").hide();
	$("#escmenu").hide();
	$("#description").hide();
	if(panelname == "escmenu") {
		$("#gameCanvas").show();
	}
	$("#" + panelname).show();
}

showPanel("description");

function exitgame(){
	oppYPos = [];
	oppXPos = [];
	avatarX = 0;
	avatarY = 0;
	playerImage;
	oppImage;
	paused = false;
	hits = 0;
	interval = null;

	hits = 0;
	paused = false;
	startTime = new Date();
	clearInterval(interval);
}

// pause play  handler
function pausePlay() {
	if(paused) {
		paused = false;
		showPanel("gameCanvas");
	} else {
		paused = true;
		showPanel("escmenu");
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

// game start trigger
$("#btnstartgame").click(function() {
	showPanel("gameCanvas");
	initGame();
});
$("#btnexit").click(function() {
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
	interval = null;

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
	interval = setInterval(gamePlay, 8);
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
				// disable configs
				$("#pauseplay").prop('disabled', true);
				$("#start").prop('disabled', false);
				$("#gameover").show();
				paused = true;
				// reset interval
				clearInterval(interval);
				interval = null;
				// calculate current score and update highscore
				var currentScore = ((new Date()) - startTime) / 1000;
				if(currentScore > highScore) highScore = currentScore;
				$("#lived").html(currentScore);
				$("#highscore").html(highScore);
			}
			// remove enemy on collision
			oppXPos.splice(i, 1);
			oppYPos.splice(i, 1);
		}
	}

}