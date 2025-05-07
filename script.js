let WIDTH = 800;
let HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let balls = [];
let ballSize = 80;
let lives = 10; // Start with 10 lives
let livesText; // Text to display lives

function preload() {
    this.load.image("redBall", "assets/ball.png");
    this.load.image("blueBall", "assets/ball.png");
    this.load.image("greenBall", "assets/ball.png");
}

function create() {
    // Add balls of different colors
    const colors = ["redBall", "blueBall", "greenBall"];
    for (let i = 0; i < colors.length; i++) {
        let ball = this.physics.add.sprite(
            Phaser.Math.Between(ballSize, WIDTH - ballSize),
            Phaser.Math.Between(ballSize, HEIGHT - ballSize),
            colors[i]
        );
        ball.setDisplaySize(ballSize, ballSize);
        ball.setBounce(1); // Make the ball bounce
        ball.setCollideWorldBounds(true); // Collide with world bounds
        ball.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(-200, 200)
        ); // Random initial velocity

        // Enable input on the ball
        ball.setInteractive();

        // Add a click event listener to the ball
        ball.on('pointerdown', () => {
            // Reduce the ball size by 10%
            ballSize *= 0.9;
            ball.setDisplaySize(ballSize, ballSize);

            // Increase the speed by 10%
            ball.body.velocity.x *= 1.1;
            ball.body.velocity.y *= 1.1;

            // Gain a life
            lives++;
            updateLivesText();
        });

        balls.push(ball);
    }

    // Enable collisions between balls
    this.physics.add.collider(balls, balls, handleBallCollision, null, this);

    // Display lives on the screen
    livesText = this.add.text(10, 10, `Lives: ${lives}`, {
        fontSize: '20px',
        fill: '#fff'
    });
}

function update() {
    // Check for collisions with walls and reduce lives
    balls.forEach(ball => {
        if (ball.body.blocked.left || ball.body.blocked.right || ball.body.blocked.up || ball.body.blocked.down) {
            loseLife();
        }
    });
}

// Function to handle ball collisions
function handleBallCollision(ball1, ball2) {
    // Gain a life when two balls collide
    lives++;
    updateLivesText();
}

// Function to lose a life
function loseLife() {
    lives--;
    updateLivesText();

    // Stop the game if lives reach 0
    if (lives <= 0) {
        this.scene.pause(); // Pause the game
        livesText.setText('Game Over'); // Display "Game Over"
    }
}

// Function to update the lives text
function updateLivesText() {
    livesText.setText(`Lives: ${lives}`);
}