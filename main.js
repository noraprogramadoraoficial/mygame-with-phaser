var config = {
       type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
        
    };

var game = new Phaser.Game(config);
var text;
var score = 0;
var sprite;
var lockText;
var gotas;

//variable spara circulos (gotas)
var graphics;
var rect;
var shapes;


function preload(){

	this.load.image('maceta','assets/maceta.png');
	this.load.image('sky', 'assets/cielo2.jpg');
    this.load.image('gota', 'assets/gota2.png');
}

function create(){

	

	this.add.image(400, 300, 'sky');
	text = this.add.text(650,16, 'Score: 0', {fill: '#000',fontSize: '20px'});
	
	sprite = this.add.sprite(400, 500, 'maceta');

	 // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
    this.input.on('pointerdown', function (pointer) {

        this.input.mouse.requestPointerLock();

    }, this);

	this.input.on('pointermove', function (pointer) {

        if (this.input.mouse.locked)
        {
            sprite.x += pointer.movementX;
            sprite.y += pointer.movementY;


            // Force the sprite to stay on screen
            sprite.x = Phaser.Math.Wrap(sprite.x, 0, game.renderer.width);
            sprite.y = Phaser.Math.Wrap(sprite.y, 0, game.renderer.height);

            if (pointer.movementX > 0) { sprite.setRotation(0.1); }
            else if (pointer.movementX < 0) { sprite.setRotation(-0.1); }
            else { sprite.setRotation(0); }

            updateLockText(true);
        }
    }, this);

    // Exit pointer lock when Q is pressed. Browsers will also exit pointer lock when escape is
    // pressed.
    this.input.keyboard.on('keydown-Q', function (event) {
        if (this.input.mouse.locked)
        {
            this.input.mouse.releasePointerLock();
        }
    }, this);

    // Optionally, you can subscribe to the game's pointer lock change event to know when the player
    // enters/exits pointer lock. This is useful if you need to update the UI, change to a custom
    // mouse cursor, etc.
    this.input.on('pointerlockchange', function (event) {

        console.log(event);

        updateLockText(event.isPointerLocked, sprite.x, sprite.y);

    }, this);

    lockText = this.add.text(16, 16, '', {
        fontSize: '20px',
        fill: '#000'
    });

    updateLockText(false);

    gotas = this.physics.add.group({
            key: 'gota',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

    //Circulos intentos de gotas
    graphics = this.add.graphics();

    shapes = new Array(15).fill(null).map(function (nul, i){
        return new Phaser.Geom.Circle(Phaser.Math.Between(0, 500), Phaser.Math.Between(0, 600), Phaser.Math.Between(10, 15));
    });

    rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
    //*****end of circulos
}

function updateLockText (isLocked)
{
    lockText.setText([
        'Coordenadas de la maceta: (' + sprite.x + ',' + sprite.y + ')',
        'Da click en la maceta y muevela',
        'Presiona ESC Para salir del cuadro de juego.'
    ]);
}


function listener(){
	score++;
	text.text = "Score: " + score;

}

//PARA  LAS GOTAS
function color (i)
{
    return 0x001102 * (i % 10) + 0x000035 * (i % 10);
}

function draw ()
{
    graphics.clear();

    shapes.forEach(function (shape, i) {
        graphics
        .fillStyle(color(i), 0.8)
        .fillCircleShape(shape);
    });
}

//funcion update

function update(){
	shapes.forEach(function (shape, i) {
        shape.x += (1 + 0.1 * i);
        shape.y += (1 + 0.1 * i);
    });

    Phaser.Actions.WrapInRectangle(shapes, rect, 100);

    draw();
}