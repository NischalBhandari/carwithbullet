;(function(){
		function gameLoop(){
			this.FPS=60;
			this.FRAME_RATE=1000/this.FPS;
			this.score=0;
			this.level=1;
			var that=this;
			this.canvas=document.getElementById('canvas');
			this.ctx=canvas.getContext('2d');
			this.position=0;
			this.bulletArray=[];
			this.car = new draw(10).init();
			this.myroad= new road();
			this.array=[];
			this.xpos=[];
			this.ypos=[];
			this.check=false;
			this.movement={
				left:false,
				right:false,
				gun:false,
			}
			this.scoreBoard=document.getElementById('scoreCounter');
			this.levelBoard=document.getElementById('levelCounter');
			setInterval(function(){
				/*that.score+=1;*/
				if(that.score%9==0){
					that.level+=1;
				}
				that.scoreBoard.innerHTML=that.score;
				that.levelBoard.innerHTML=that.level;
			},1000);

			for(var i=0;i<3;i++){
			this.obstacle= new walls(i).init();

			this.array.push(this.obstacle);
			}
			
/*			document.addEventListener("keydown",keyDownHandler,false);*/
/*			document.addEventListener("keydown",keyUpHandler,false);
			document.addEventListener("keyup",keyUpHandler,false);*/
			document.addEventListener("keydown",keyRightHandler,false);
			document.addEventListener("keyup",keyRightUpHandler,false);
			document.addEventListener("keydown",keyLeftHandler,false);
			document.addEventListener("keyup",keyLeftUpHandler,false);
			document.addEventListener("keydown",keySpaceHandler,false);
			document.addEventListener("keyup",keySpaceUpHandler,false);
			var interval=setInterval(function(){
				that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
				that.myroad.init();
				that.myroad.move(that.level);
				that.car.update();
				that.car.collide();
			for (var k=0;k<3;k++){
				that.ypos[k]=(k*400+100);
			}
			for(var i=0;i<3;i++){

			that.array[i].moveWall();
			that.array[i].upperCollide(that.level,that.ypos[i]);
			that.check=that.array[i].calculateScore();
			if(that.check){
				that.score+=1;
				that.check=false;
			}
			var stop=that.array[i].ballCollide(that.car);

				if(that.movement.right){
					that.car.moveRight();
				}
				else if(that.movement.left){
					that.car.moveLeft();
				}
				else if(that.movement.gun){
					var projectile=new bullet(that.car.x+5,that.car.y).init();
					that.bulletArray.push(projectile);
				}

			if(!stop){
				document.removeEventListener("keydown",keyDownHandler);
				document.removeEventListener("keydown",keyRightHandler);
				document.removeEventListener("keydown",keyLeftHandler);
				document.removeEventListener("keyup",keyRightUpHandler);
				document.removeEventListener("keyup",keyLeftUpHandler);
				document.removeEventListener("keydown",keySpaceHandler);

				that.array[i].stop();
				setTimeout(function(){
				document.location.reload();
				clearInterval(interval);
			},1000);
			}
			}
			for(var k=0;k<that.bulletArray.length;k++){
					that.bulletArray[k].moveBullet();
					for(var j=0;j<that.array.length;j++){
						var checkExplosion=that.array[j].bulletCollide(that.bulletArray[k]);
						if(!checkExplosion){
							that.bulletArray.splice(k)
							that.array[j].isActive=false;
						}
					}
			}
			},this.FRAME_RATE);

			function keyDownHandler(e){
				if(e.key=="Up"||e.key=="ArrowUp"){
					that.myroad.move();
				}
			}

/*			function keyUpHandler(e){
				if(e.key=="Down"||e.key=="ArrowDown"){
					that.car.moveDown();
				}
			}*/
			function keyRightHandler(e){
				if(e.key=="Right"||e.key=="ArrowRight"||e.keyCode==68){
					that.car.moveRight();
					/*that.movement.right=true;*/
				}
			}
			function keyRightUpHandler(e){
				if(e.key=="Right"||e.key=="ArrowRight"||e.keyCode==68){
					that.movement.right=false;
				}
			}
			function keyLeftHandler(e){
				if(e.key=="Left"||e.key=="ArrowLeft"||e.keyCode==65){
					/*that.movement.left=true;*/
					that.car.moveLeft();
				}
			}
			function keyLeftUpHandler(e){
				if(e.key=="Left"||e.key=="ArrowLeft"||e.keyCode==65){
					that.movement.left=false;
				}
			}
			function keySpaceHandler(e){
				if(e.keyCode==32){
					that.movement.gun=true;
				}
			}
			function keySpaceUpHandler(e){
				if(e.keyCode==32)
				{
					that.movement.gun=false;
				}
			}

		}
		function draw(gap){
			this.canvas=document.getElementById('canvas');
			this.ctx=this.canvas.getContext('2d');
			this.width=50;
			this.height=100;
			this.dy=-5;
			this.dx=-this.canvas.width/3;
			var that=this;
			this.carImage=new Image();
			this.carImage.src='./images/car.png';
			
			this.x=((this.canvas.width-this.width)/2);
			this.y=(this.canvas.height-this.height)-30;
			this.init=function(){
				this.ctx.fillStyle='red';
				this.ctx.beginPath();
				this.ctx.drawImage(this.carImage,0,0,100,275,this.x,this.y,this.width,this.height);
				/*this.ctx.rect(this.x,this.y,this.width,this.height);*/
				this.ctx.fill();
				return this;
			}

			this.update=function(){
				this.init();
			}
			this.moveUp=function(){
				this.y+=this.dy;
			}
			this.moveDown=function(){
				this.y-=this.dy;
			}
			this.moveRight=function(){
   				this.x-=this.dx;
			}
			this.moveLeft=function(){
				this.x+=this.dx;
			}
			this.shoot=function(){
					
			}

			this.collide=function(){
				if(this.x+this.dx+this.width<0){
					this.x=140;
				}
				if(this.x+this.dx+this.width>(8*this.canvas.width/10)){
					this.x=(2*canvas.width/3)+140;
				}
			}
		}

		function road(){
			this.lanes=3;

			this.canvas=document.getElementById('canvas');
			this.ctx=this.canvas.getContext('2d');
			this.width=this.canvas.width/this.lanes;
			this.ypos=0;
			this.init=function(){
				for(var i=0;i<this.lanes;i++){
				this.ctx.beginPath();
				this.ctx.fillStyle="black";
				this.ctx.rect(i*this.width,0,this.width,this.canvas.height);
				this.ctx.fill();

				for (var j=0;j<30;j++){
					this.ctx.beginPath();
					this.ctx.fillStyle="white";
					this.ctx.rect(this.canvas.width/3,this.ypos+j*50,10,40);
					this.ctx.fill();
					this.ctx.closePath();
				}
				for (var j=0;j<30;j++){
					this.ctx.beginPath();
					this.ctx.fillStyle="white";
					this.ctx.rect(2*this.canvas.width/3,this.ypos+j*50,10,40);
					this.ctx.fill();
					this.ctx.closePath();
				}
			}
			this.move=function(level){
				this.ypos+=level*1;
				if(this.ypos+700>this.canvas.height){
					this.ypos=-this.canvas.height;
				}
				this.init();
			}
				}
		}
		function walls(index){
			this.isActive=true;
			this.canvas=document.getElementById('canvas');
			this.ctx=this.canvas.getContext('2d');
			this.wallWidth=50;
			this.wallHeight=100;

			this.y=null;
			this.x=null;
			var randomNum=Math.random();
							if(index==0){
								this.x=140;
								this.y=-130;
							}
							else if(index==1){
								this.x=(this.canvas.width/3+140);
								this.y=-400;
							}
							else{
								this.x=(2*this.canvas.width/3+140);
								this.y=-800;
							}

			this.vehicleImage =new Image();
			this.vehicleImage.src='./images/obstacle.png';
			this.isScoring=true;

			this.dx=0;
			this.dy=2;
			var that=this;

			this.init=function(){

				return this;
			}
			this.draw=function(){
			if(this.isActive){
				this.ctx.beginPath();
				this.ctx.fillStyle="blue";
				this.ctx.drawImage(this.vehicleImage,0,0,50,100,this.x,this.y,this.wallWidth,this.wallHeight);
				this.ctx.fill();
			}
			}

			this.moveWall=function(){
				this.y+=this.dy;
				this.draw();
			} 

				this.upperCollide=function(level,ypos){
					var change=Math.random()<0.5?Math.floor(Math.random()*100):-Math.floor(Math.random()*100);
					this.dy=level*2;
					if(this.y>this.canvas.height)
					{
						this.isActive=true;
					}
					if(this.y-this.dy-this.wallHeight>this.canvas.height){
							this.y=-ypos;
							this.isScoring=true;
							var randomNum=Math.random();
							if(randomNum<0.33){
								this.x=140;
							}
							else if(randomNum>0.33&&randomNum<0.66){
								this.x=(this.canvas.width/3+140);
							}
							else{
								this.x=(2*this.canvas.width/3+140);
							}

						if(this.x+this.dx+this.wallWidth>this.canvas.width){
							this.dx=-this.dx;
					}

					}
				}

			this.ballCollide=function(ball){
				if(ball.x < this.x + this.wallWidth &&
				   ball.x + ball.width > this.x &&
				   ball.y < this.y + this.wallHeight &&
				   ball.y + ball.height > this.y && this.isActive){
						this.ctx.drawImage(this.vehicleImage,98,0,50,100,this.x,this.y,this.wallWidth,this.wallHeight+20);
						return false;
					}
					else{
						return true;
					}
				}    
				this.bulletCollide=function(ball){  
				if(ball.x < this.x + this.wallWidth &&
				   ball.x + ball.width > this.x &&
				   ball.y < this.y + this.wallHeight &&
				   ball.y + ball.height > this.y && this.isActive){
						this.ctx.drawImage(this.vehicleImage,98,0,50,100,this.x,this.y,this.wallWidth,this.wallHeight+20);
						return false;
					}
					else{
						return true;
					}
				}
				this.calculateScore=function(){
					if(this.y>480 && this.isScoring){
						this.isScoring=false;
						return true;
					}
					else{
						return false;
					}
				}


				this.stop=function(){
					this.dy=0;
					this.dx=0;
				}
		}
		function bullet(x,y){
			this.x=x;
			this.y=y;
			this.width=20;
			this.height=20;
			this.dy=4;
			var that=this;
			this.canvas=document.getElementById('canvas');
			this.ctx=this.canvas.getContext('2d');
			this.init=function(){
			this.ctx.beginPath();
			this.ctx.rect(this.x,this.y,this.width,this.height);
			this.ctx.fill();
			return this;
			}
			this.moveBullet=function(){
				if(this.y>10){
					this.y-=this.dy;
					this.init();
				}

			}
		}



var application=document.getElementById('app');
startButton.onclick=function(){
	var application=document.getElementById('app');
	var startingButton=document.getElementById('startGame');
	startingButton.style.display="none";
	new gameLoop();
}
var restartButton=document.getElementById('restart');
restartButton.onclick=function(){
	var canvas=document.getElementById('canvas');
	application.removeChild(canvas);
	var newCanvas=document.createElement('canvas');
	newCanvas.width=1000;
	newCanvas.height=600;
	newCanvas.id='canvas';
	application.appendChild(newCanvas);
	score=0;
	level=1;
	new gameLoop();
}



})()
