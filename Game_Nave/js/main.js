function start() {
    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='animacao'></div>");
    $("#fundoGame").append("<div id='inimigo1'class='animacaoInimigoUm'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='animacaoAmigo'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>")

    // Main variable of the gameNave
    
    let game = {}
    let endGame = false
    let canShoot = true
    let energyLife = 3;
    let speed = 5;
    let speedenemytwo = 3;
    let positionY = parseInt(Math.random());
    let pontos = 0;
    let salvos = 0;
    let perdidos = 0;
    let keyboard = {
        w: 87,
        s: 83,
        d: 68,
        a: 65,
        f: 70
    }
    game.press = [];
    let soundRescue = document.getElementById("somRegaste")
    let soundShot = document.getElementById("somDisparo");
    let soundExplosion = document.getElementById("somExplosao");
    var music = document.getElementById("musica");
    var soundGameOver = document.getElementById("somGameover");
    var soundLost = document.getElementById("somPerdido");    

    music.addEventListener("ended", function() {music.currentTime = 0; music.play(),false});
    music.play();


    //verify if the user press the key

    $(document).keydown(function(e){
        game.press[e.which] = true;
    });
    $(document).keyup(function(e){
        game.press[e.which] = false;
    })

    // Game loop

    game.timer = setInterval(loop, 30);

    //function to loop the game

    function loop() {
        movebackground();
        moveplayer();
        moveenemy();
        movefriend();
        collision();
        score();
        energy();
        
    }
    function movebackground() {
        left = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",left-10);
    }
    function moveplayer() {
        if (game.press[keyboard.w]) {
            let top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",top-10);
            if (top <= 0) {
                $("#jogador").css("top",top=0);
            } 
        }
        if (game.press[keyboard.s]) {
            let top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",top+10);
            if (top >= 434 ) {
                $("#jogador").css("top",top=434);
            }
        }
        if (game.press[keyboard.d]) {
            let left = parseInt($("#jogador").css("left"));
            $("#jogador").css("left",left+10);
            if (left >= 700 ) {
                $("#jogador").css("left",left=700);
            }
        }
        if (game.press[keyboard.a]) {
            let left = parseInt($("#jogador").css("left"));
            $("#jogador").css("left",left-10);
            if (left <= 8 ) {
                $("#jogador").css("left",left=8);
            }

        }
        if (game.press[keyboard.f]) {
            shoot();
        }
    }
    function moveenemy() {
        positionX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",positionX-speed);
        $("#inimigo1").css("top",positionY);
        positionX1 = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",positionX1-speedenemytwo);
        $("#inimigo2").css("top",434);
        if (positionX1 <= 0 ){
            $("#inimigo2").css("left",775);
        }
        if (positionX <= 0 ){
            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("top",positionY)
            $("#inimigo1").css("left",694);
        }
    }
    function movefriend() {
        positionX1 = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",positionX1 + 1);
        $("#amigo").css("top",434);
        
    }
    function shoot() {
        
        if (canShoot == true) {
            soundShot.play();
            canShoot = false;
            topPosition = parseInt($("#jogador").css("top"))
            positionX = parseInt($("#jogador").css("left"));
            shootX = positionX + 190;
            shootTop = topPosition + 39
            $("#fundoGame").append("<div id='disparo'></div>")
            $("#disparo").css("top",shootTop)
            $("#disparo").css("left",shootX)
            var timeToShoot = window.setInterval(executeShooting,30);
        }
        function executeShooting() {
            positionX = parseInt($("#disparo").css("left"))
            $("#disparo").css("left",positionX + 15)
            if (positionX > 900){
                window.clearInterval(timeToShoot);
                timeToShoot=null;
                $("#disparo").remove();
                canShoot=true;
            }
        }

    }
    function collision() {
        let collisionOne = ($("#jogador").collision($("#inimigo1")))
        let collisionTwo = ($("#jogador").collision($("#inimigo2")))
        let collisionThree = ($("#disparo").collision($("#inimigo1")))
        let collisionFour = ($("#disparo").collision($("#inimigo2")))
        let collisionFive = ($("#jogador").collision($("#amigo")))
        let collisionSix = ($("#inimigo2").collision($("#amigo")))
        if (collisionOne.length > 0) {
            energyLife--
           
            enemyOneX = parseInt($("#inimigo1").css("left"));
            enemyOneY = parseInt($("#inimigo1").css("top"));
            explosionOne(enemyOneX,enemyOneY);
            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("top",positionY);
            $("#inimigo1").css("left",694);
        }

        if (collisionTwo.length > 0) {
            soundLost.play();
            console.log(soundLost);
            energyLife--
            
            enemyTwoX = parseInt($("#inimigo2").css("left"));
            enemyTwoY = parseInt($("#inimigo2").css("top"));
            explosionTwo(enemyTwoX,enemyTwoY);
            $("#inimigo2").remove();
            repositionEnemy2()
        }
        if (collisionThree.length > 0) {
            pontos += 100
            speed += 0.3 
            enemyOneX = parseInt($("#inimigo1").css("left"))
            enemyOneY = parseInt($("#inimigo1").css("top"))
            explosionOne(enemyOneX + 250,enemyOneY)
            $("#disparo").css("left", 950)
            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("top",positionY);
            $("#inimigo1").css("left",694);
        }
        if (collisionFour.length > 0) {
            pontos += 50;
            enemyTwoX = parseInt($("#inimigo2").css("left"));
            enemyTwoY = parseInt($("#inimigo2").css("top"));
            explosionTwo(enemyTwoX + 250,enemyTwoY);
            $("#inimigo2").remove();
            repositionEnemy2()
        }
        if (collisionFive.length > 0) {
            
            salvos++;
            pontos += 50;
            if (soundRescue !== null) {
                soundRescue.play();
            }
            
            repositionFriend()
            $("#amigo").remove();
        }
        if (collisionSix.length > 0) {
            soundLost.play();
            perdidos++;
            pontos -= 100;
            energyLife -= 1
            friendX = parseInt($("#amigo").css("left"))
            friendY = parseInt($("#amigo").css("top"))
            explosionThree(friendX,friendY)
            $("#amigo").remove()
            repositionFriend()            
        }
        
    }
    function explosionOne(enemyOneX,enemyOneY) {
        soundExplosion.play();
        $("#fundoGame").append("<div id='explosao1'></div>")
        $("#explosao1").css("background-image", "url(imgs/explosao.png)")
        let div = $("#explosao1");
        div.css("top",enemyOneY);
        div.css("left",enemyOneX -200)
        div.animate({width:200,opacity: 0}, "slow");
        var explosionTime = window.setInterval(removeExplosion, 1000);
            function removeExplosion() {
                div.remove();
                window.clearInterval(explosionTime);
                explosionTime=null;
            }
    }
    function explosionTwo (enemyTwoX,enemyTwoY) {
        soundExplosion.play();
        $("#fundoGame").append("<div id='explosao2'></div>")
        $("#explosao2").css("background-image", "url(imgs/explosao.png)")
        let divTwo = $("#explosao2");
        divTwo.css("top",enemyTwoY);
        divTwo.css("left",enemyTwoX -200)
        divTwo.animate({width:200,opacity: 0}, "slow");
        var explosionTimeTwo = window.setInterval(removeExplosionTwo, 1000);
            function removeExplosionTwo() {
                divTwo.remove();
                window.clearInterval(explosionTimeTwo);
                explosionTimeTwo = null;
            }
    }
    function explosionThree (friendX,friendY) {
        soundExplosion.play();
        $("#fundoGame").append("<div id='explosao3'class='animacaoAmigoMorto'></div>")
        $("#explosao3").css("top",friendY)
        $("#explosao3").css("left",friendX)
        var explosionTimeThree = window.setInterval(removeExplosionThree,1000);
            function removeExplosionThree() {
                $("#explosao3").remove();
                window.clearInterval(explosionTimeThree);
                explosionTimeThree = null;
            }
    }
    function repositionEnemy2(){
        var timeCollisionFour = window.setInterval(repositionFour,5000)
            function repositionFour(){
                window.clearInterval(timeCollisionFour)
                timeCollisionFour = null;
                if (endGame == false) {
                    $("#fundoGame").append("<div id='inimigo2'></div>")
                }
            }
    }
    function repositionFriend() {
        var timeCollisionFive = window.setInterval(repositionFive,6000)
            function repositionFive() {
                window.clearInterval(timeCollisionFive)
                timeCollisionFive = null;
                if (endGame == false) {
                    $("#fundoGame").append("<div id='amigo'></div>")
                }
            }
    }
    function score(){
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>")
    }
    function energy(){
        if (energyLife === 3) {
            $("#energia").css("background-image", "url(imgs/energia3.png)")
        }
        if (energyLife === 2) {
            $("#energia").css("background-image", "url(imgs/energia2.png)")
        }
        if (energyLife === 1) {
            $("#energia").css("background-image", "url(imgs/energia1.png)")
        }
        if (energyLife === 0) {
            $("#energia").css("background-image", "url(imgs/energia0.png)")
            gameOver();
        }
    }
    function gameOver(){
        endGame = true
        music.pause()
        soundGameOver.play()
        window.clearInterval(game.timer);
        game.timer = null;
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#fundoGame").append("<div id='fim'></div>")
        $("#fim").html("<h1> Game Over</h1><p> Sua pontuação foi de: " + pontos + "</p>" + "<div  onClick='restartGame()'><h3>Jogar Novamente</h3></div>")
    }
}
function restartGame() {
    soundGameOver = document.getElementById("somGameover")
    
    soundGameOver.pause();
    $("#fim").remove();
    start();

}