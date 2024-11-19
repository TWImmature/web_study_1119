// 获取canvas元素及其绘图上下文
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;

// 球的位置
let setX = canvas.width / 2;
let setY = canvas.height - 30;
let x = setX;
let y = setY;

// 球的速度
let set_dx = 1;
let set_dy = -1;
let dx = set_dx;
let dy = set_dy;

// 难度-----------------
// 当前的难度等级
let difficultyLevel = 1;

// 更新HTML中按钮的文本以显示当前难度等级
function updateDifficultyButtonText() {
    document.getElementById("difficultyButton").textContent = `Change Difficulty (Current: ${difficultyLevel})`;
}

// 初始化难度按钮事件监听器
document.getElementById("difficultyButton").addEventListener("click", function() {
    // 更新难度等级，循环在1，2，3之间
    difficultyLevel = (difficultyLevel % 3) + 1;
    // 更新球的速度
    set_dx = difficultyLevel;
    set_dy = -difficultyLevel;
    // 更新按钮文本
    updateDifficultyButtonText();
    // 如果游戏已经开始，重置球的位置和速度
    if (this.disabled) {
        x = setX;
        y = setY;
        dx = set_dx;
        dy = set_dy;
        paddleX = (canvas.width - paddleWidth) / 2;
    }
});

// 在游戏开始时确保球的速度与难度等级匹配
document.getElementById("runButton").addEventListener("click", function () {
    // 设置球的速度为当前难度等级
    dx = set_dx;
    dy = set_dy;
    draw();
    this.disabled = true;
    // 禁用难度按钮，防止在游戏进行时改变难度
    document.getElementById("difficultyButton").disabled = true;
});
// -----------------

// 挡板的尺寸和位置
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// 键盘控制变量
let rightPressed = false;
let leftPressed = false;

// 砖块布局参数
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// 分数
let score = 0;

// 生命
let lives = 2;

// 初始化砖块数组
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// 添加键盘和鼠标事件监听器
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// 键盘按下时根据按键设置方向变量
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// 键盘释放时重置方向变量
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// 鼠标移动时更新挡板位置到鼠标
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 碰撞检测
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// 绘制球
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// 绘制挡板
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// 绘制所有砖块
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 显示分数
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// 显示剩余生命值
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// 主绘制函数，用于更新画布
function draw() {
    // 清除画布内容，为下一次绘制做准备
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制砖块
    drawBricks();
    // 绘制球
    drawBall();
    // 绘制挡板
    drawPaddle();
    // 绘制得分
    drawScore();
    // 绘制生命值
    drawLives();
    // 检测碰撞
    collisionDetection();

    // 球与左右边界碰撞检测，反转球的速度方向
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    // 球与上边界碰撞检测，反转球的速度方向
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // 球与下边界碰撞检测
    else if (y + dy > canvas.height - ballRadius) {
        // 如果球在挡板范围内，反转球的速度方向
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        // 否则，生命值减一，如果生命值为0，游戏结束并重新加载页面
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            // 否则，重置球和挡板的位置
            else {
                x = setX;
                y = setY;
                dx = set_dx;
                dy = set_dy;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // 挡板左右移动逻辑
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7; // 向右移动挡板
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7; // 向左移动挡板
    }

    // 更新球的位置
    x += dx;
    y += dy;

    // 请求浏览器在下一次重绘之前调用指定的函数更新动画
    requestAnimationFrame(draw);
}


// 点击按钮开始游戏
document.getElementById("runButton").addEventListener("click", function () {
    draw();
    this.disabled = true;
});
