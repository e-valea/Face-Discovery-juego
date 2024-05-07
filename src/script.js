let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,

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


let player;
let faces;
let bombs;
let platforms;
let cursors;

let score = 0;
let gameOver = false;
let scoreText;
let gameOverImage;

let game = new Phaser.Game(config);




function resizeGame() {
    let canvas = game.canvas;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let wratio = width / height;
    let ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + 'px';
        canvas.style.height = (width / ratio) + 'px';
    } else {
        canvas.style.width = (height * ratio) + 'px';
        canvas.style.height = height + 'px';
    }
}

window.addEventListener('resize', resizeGame);



function preload() {
    this.load.image('sky', 'assets/img/fondo_titulo.png');
    this.load.image('ground', 'assets/img/platform.png');
    this.load.image('ground_base', 'assets/img/ground.png');
    this.load.image('face_one', 'assets/img/alegria.png');
    this.load.image('face_two', 'assets/img/asco.png');
    this.load.image('face_three', 'assets/img/miedo.png');
    this.load.image('face_four', 'assets/img/sorpresa.png');
    this.load.image('face_five', 'assets/img/tristeza.png');
    this.load.image('bomb', 'assets/img/ira.png');
    this.load.spritesheet('dude', 'assets/img/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('gameover', 'assets/img/game_over.png');
    this.load.audio('music', 'assets/img/jump.mp3');
}


function create() {
    // sonido salto
    let music = this.sound.add('music');

    // bucle
    music.loop = true;

    // Reproduce sonido salto
    music.play();
}

function update() {
    // jugador miviendose
    if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown) {
        // Reproduce la música cuando el jugador se mueva
        music.play();
    }
}
function create() {
    //  Fondo
    this.add.image(965, 538, 'sky');

    //  Plataformas
    platforms = this.physics.add.staticGroup();

    //  suelo
    platforms.create(965, 1025, 'ground_base').setScale().refreshBody();

    //  Ahora creamos unas plataformas
    platforms.create(1450, 800, 'ground');
    platforms.create(500, 600, 'ground');
    platforms.create(1600, 450, 'ground');
    // platforms.create(950, 600, 'ground');

    // El jugador y sus ajustes
    player = this.physics.add.sprite(100, 450, 'dude');

    // Propiedades físicas del jugador. Darle al pequeño un ligero rebote.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animaciones de nuestro jugador, vuelta, caminar izquierda y derecha.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Eventos de entrada
    cursors = this.input.keyboard.createCursorKeys();
    




    // Algunas caras para recolectar, 12 en total, distribuidas 70 pixels a lo largo del eje x
    // Añadir misma función para cada una de las caritas
    faces = this.physics.add.group({
        key: 'face_one',
        repeat: 3,
        setXY: { x: 180, y: 0, stepX: 300 }

    });

    faces.children.iterate(function (child) {

        // Dar a cada cara un rebote ligeramente diferente
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // Crear grupo de sprites para face_two
    faceTwoGroup = this.physics.add.group({
        key: 'face_two',
        repeat: 3,
        setXY: { x: 230, y: 0, stepX: 350 }
    });

    // Iterar sobre los sprites de face_two y establecer rebotes
    faceTwoGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Crear grupo de sprites para face_three
    faceThreeGroup = this.physics.add.group({
        key: 'face_three',
        repeat: 3,
        setXY: { x: 280, y: 0, stepX: 375 }
    });

    // Iterar sobre los sprites de face_three y establecer rebotes
    faceThreeGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Crear grupo de sprites para face_four
    faceFourGroup = this.physics.add.group({
        key: 'face_four',
        repeat: 3,
        setXY: { x: 320, y: 0, stepX: 420 }
    });

    // Iterar sobre los sprites de face_four y establecer rebotes
    faceFourGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Crear grupo de sprites para face_five
    faceFiveGroup = this.physics.add.group({
        key: 'face_five',
        repeat: 3,
        setXY: { x: 120, y: 0, stepX: 500 }
    });

    // Iterar sobre los sprites de face_five y establecer rebotes
    faceFiveGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
        let x = Phaser.Math.Between(100, 1820);
        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    // El marcador
    scoreText = this.add.text(70, 70, 'score: 0', { fontSize: '28px', fill: '#FF1D25' });

    // Colisión del jugador y las caras con las plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(faces, platforms);
    this.physics.add.collider(faceTwoGroup, platforms);
    this.physics.add.collider(faceThreeGroup, platforms);
    this.physics.add.collider(faceFourGroup, platforms);
    this.physics.add.collider(faceFiveGroup, platforms);
    this.physics.add.collider(bombs, platforms);

    // Comprobaciones para ver si el jugador se superpone con alguna de las caras, si lo hace llama a la función collectStar
    this.physics.add.overlap(player, faces, collectStar, null, this);
    this.physics.add.overlap(player, faceTwoGroup, collectStar, null, this);
    this.physics.add.overlap(player, faceThreeGroup, collectStar, null, this);
    this.physics.add.overlap(player, faceFourGroup, collectStar, null, this);
    this.physics.add.overlap(player, faceFiveGroup, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Sprite de Game Over
    gameOverImage = this.add.sprite(960, 540, 'gameover');
    gameOverImage.setOrigin(0.5);
    gameOverImage.setVisible(false);

    this.input.keyboard.on('keydown', (event) => {
        if (gameOver && event.code === 'Space') { // reiniciar el juego
            restartGame();
            this.scene.restart();
        }
    });
}


function update() {



    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-550); // salto muñeco
    }
}


function collectStar(player, face_one) {
    face_one.disableBody(true, true);

    //  Añadir y actualizar el marcador
    score += 10;
    scoreText.setText('Score: ' + score);

    if (faces.countActive(true) === 0) {
        // + caras
        faces.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

// 
function collectStar(player, face) {
    face.disableBody(true, true);

    //  Añadir y actualizar el marcador
    if (face.texture.key === 'face_one') {
        score += 10;
    } else if (face.texture.key === 'face_two') {
        score += 10;
    } else if (face.texture.key === 'face_three') {
        score += 10;
    } else if (face.texture.key === 'face_four') {
        score += 10;
    } else if (face.texture.key === 'face_five') {
        score += 10;
    }

    scoreText.setText('Score: ' + score);

    // Comprobar si se han recolectado todas las caras y generar nuevas bombas
    if (faces.countActive(true) === 0 && !gameOver) {
        faces.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    gameOverImage.setVisible(true);
}

function restartGame() {
    console.log("Reiniciando el juego...");
    // Ocultar el mensaje de "Game Over"
    gameOverImage.setVisible(false);

    // Reiniciar las variables de juego
    gameOver = false;
    score = 0;
    scoreText.setText('Score: 0');

    // Reiniciar la posición del jugador y cualquier otro estado del juego que sea necesario
    player.setX(100); // Cambia la posición inicial según sea necesario
}


const modal_btn1 = document.getElementById("modal_btn1")
const modal_container = document.getElementById("modal_container")
modal_btn1.addEventListener("click", () => {
    let video = document.querySelector("#video");
    video.classList.toggle("hidden");
})

document.querySelector(".modal-btn-closed").addEventListener("click", () => {
    modal_container.classList.add("hidden");
})
