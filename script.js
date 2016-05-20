var	game	= new Phaser.Game(800, 600, Phaser.CANVAS,'', {	preload: preload,	create:	create,	update:	update	});
function	preload() {
//ładowanie	zasobów
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}


var	platforms;
var star;
var	score	= 0;
var plat;
var enemy;






function	preload() {
//ładowanie	zasobów
game.load.image('sky', 'assets/sky.png');
game.load.image('ground', 'assets/platform.png');
game.load.image('star', 'assets/star.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
game.load.spritesheet('enemy', 'assets/enemy.png', 32, 48);
}




function	create() {

	//klawisze enemy
	W = game.input.keyboard.addKey(Phaser.Keyboard.W)
	S = game.input.keyboard.addKey(Phaser.Keyboard.S)
	A = game.input.keyboard.addKey(Phaser.Keyboard.A)
	D = game.input.keyboard.addKey(Phaser.Keyboard.D)
	//tworzenie	obiektów
	game.add.sprite(0,	0,	'star');
	//	"Włączamy"	prawa	fizyki
	game.physics.startSystem(Phaser.Physics.ARCADE);	
	//	Dodajemy	tło
	game.add.sprite(0,	0,	'sky');	
	//	Dodajemy	grupę,	do	której	będą	należeć:	gleba	i	półki
	platforms	=	game.add.group();	
	//	Obiekty	wchodzące	w	skład	grupy	uczynimy	ciałem	stałym
	platforms.enableBody	= true;	
	//	Tworzymy	glebę
	
	var	ground	=	platforms.create(0,	game.world.height - 64,	'ground');	
	//		Skalujemy	glebę	(powiększamy	2x)
	ground.scale.setTo(2,	2);	
	//		Unieruchomiamy	glebę
	ground.body.immovable	= true;	
	//		robimy	dwie	półki	i	unieruchomiamy	je
	//var	ledge	=	platforms.create(400,	400,	'ground');	
	//ledge.body.immovable	= true;	
	
	//ledge	=	platforms.create(100,	250,	'ground');	
	//ledge.body.immovable	= true;
	
	plat = game.add.sprite(200, 360, 'ground');
	game.physics.arcade.enable(plat);
	plat.body.immovable	= true;	
	plat.scale.setTo(0.5,	1);	
	
	//	Tworzę	gracza	('dude')	i	ustawiam	go	na	odpowiedniej	pozycji
	player	=	game.add.sprite(32,	game.world.height	- 150, 'dude');
	//	Włączam	graczowi	fizykę
	game.physics.arcade.enable(player);
	game.physics.arcade.enable(plat);

	enemy	=	game.add.sprite(32,	game.world.height	-200, 'enemy');
	//	Włączam	graczowi	fizykę
	game.physics.arcade.enable(enemy);
	
	
	

	//	Nadaję	mu	grawitację	i	współczynnik	sprężystości	(!)
	player.body.bounce.y	= 0.2;
	player.body.gravity.y	= 300;
	player.body.collideWorldBounds	= true;

	enemy.body.bounce.y	= 0.2;
	enemy.body.gravity.y	= 300;
	enemy.body.collideWorldBounds	= true;
	
	


	//	Tworzę	dwie	animacje	(!!!)
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	player.animations.add('attackright', [9, 10, 11], 10, true);//atak w prawo
	player.animations.add('attackleft', [14, 13, 12], 10, true);//atak w lewo
	//animacja wroga XD
	enemy.animations.add('enemyleft', [0, 1, 2, 3], 10, true);
	enemy.animations.add('enemyright', [5, 6, 7, 8], 10, true);

	

	//	Tworzymy	nową	grupę	i	nadajemy	jej	ciało	
	stars	=	game.add.group();
	stars.enableBody	= true;
	//	12	gwiazdek	starczy?
	
	scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

	for (var	i	= 0;	i	< 12;	i++)
	{
		//	create	-	coś	jakby	"push"	do	tablicy	stars[]
		var	star	=	stars.create(i	* 70, 0, 'star');
		//	Niech	gwiazdki	też	mają	grawitację,	a	co
		star.body.gravity.y	= 300;
		//	...i	randomowy	współczynnik	sprężystości
		star.body.bounce.y	= 0.5 + Math.random() * 0.4;
		star.body.gravity.x	= 15 + Math.random() *20-30;
	}

	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	


    
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR ]);
	

}
function	update() {	
//pętla	główna	gry
	
	if (D.isDown)
	{
	enemy.animations.play('enemyright');
	enemy.body.velocity.x = 60;
	}
	else if (A.isDown)
	{
	enemy.animations.play('enemyleft');
	enemy.body.velocity.x = -60;
	}
	else
	{
		enemy.animations.stop();
		enemy.frame	= 4;
		enemy.body.velocity.x =0;
	}

	if (W.isDown)
	{
		enemy.body.velocity.y	= -350;
	}
	
	else if(S.isDown )
	{
		enemy.body.velocity.y	= 300;
	}

	
	

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player, plat);
	game.physics.arcade.collide(stars, plat);
	game.physics.arcade.collide(enemy, platforms);
	game.physics.arcade.collide(enemy, plat);

	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, enemy, war, null, this);
	game.physics.arcade.overlap(plat, null, this);
	plat.body.velocity.x = -50;

	//	Dodajemy	kolizje	gracza	z	grupą	obiektów	platforms
	//	Włączmy	sterowanie	strzałkami
	cursors	=	game.input.keyboard.createCursorKeys();
	//	Na	początek	postaw	go	nie	ruszaj
	player.body.velocity.x	= 0;
	if (cursors.left.isDown)
	{
		//	Prędkość:	150	pikseli/sekundę	w	lewo	(x	-=	150)
		player.body.velocity.x	= -100;
		//	Animuj
		if(this.spaceKey.isDown)
		{
			player.animations.play('attackleft');
		}
		else
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		//	Prędkość:	150	pikseli/sekundę	w	prawo	(x	+=	150)
		player.body.velocity.x	= 100;
		//	Animuj
		if(this.spaceKey.isDown)
		{
			player.animations.play('attackright');
		}
		else
		player.animations.play('right');
	}
	else if(this.spaceKey.isDown)
	{
		player.animations.play('attackright');
	}
	else
	{
		//	Jak	nic	nie	naciskam	to	nie	ruszaj	go	i...	wyświetlaj	4	klatkę	sprita
		player.animations.stop();
		player.frame	= 4;
	}
	//		Dodaj	skoki	(!!!)
	


	if (cursors.up.isDown	&&	player.body.touching.down)
	{
		player.body.velocity.y	= -350;
	}
	
	else if(cursors.down.isDown )
	{
		player.body.velocity.y	= 300;
	}

	
	}

	

var	scoreText;

function war(player, enemy){
	if(this.spaceKey.isDown)
	{
		enemy.kill()
	}
	else
	{
		if(enemy.body.x > player.body.x)
		{
			player.body.x -= 100;
			
		}
		else if(enemy.body.x < player.body.x)
		{
			player.body.x +=  100;
			
		}

	}
}
function	collectStar	(player,	star) {
	//	Removes	the	star	from	the	screen
	star.kill();
	score	+= 10;
	scoreText.text	= 'Score:	' +	score;
}