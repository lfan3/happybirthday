/*eslint-env browser*/
$(document).ready(function(){
	
  $('body').addClass('first');
  $('html').on('click', function(){
		$(this).find('.card').toggleClass('open');
    if ($('body').hasClass('first')) {
      setTimeout(init,10);
    }
    $('body').removeClass('first');
	});
   
});

var canvas = document.getElementById('canvas');
canvas.height =$(document).height();
canvas.width = innerWidth;
var c = canvas.getContext('2d');

var mouse = {
    x:1/2 * innerWidth,
    y:innerHeight/2
};

addEventListener('resize', function() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
})

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;    
}); 

var colors = [
    '#112F41',
    '#068587',
    '#4FB99F',
    '#F2B134',
    '#ED5538'
];

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max-min +1) + min);
}
function randomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

function rotate(velocity, angle) {
    const rotateVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotateVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
    
    if(xVelocityDiff * xDist + yVelocityDiff * yDist >=0){
        // grab angle
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        // store mass
        const m1 = particle.mass; //??
        const m2 = otherParticle.mass;
        // velocity
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle); 
        // velocity after 1d collision eqution
        const v1 = {x: u1.x *(m1 - m2)/(m1 + m2) + u2.x *2 * m2/ (m1 + m2), y: u1.y};
        const v2 = {x: u2.x *(m1 - m2)/(m1 + m2) + u1.x *2 * m2/ (m1 + m2), y: u2.y};
        
        // final veclocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);
        
        //swap particle velocity for realistic bonce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
        
        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
    
}

function Particle (x, y, r, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
    }
    this.r= r;
    this.color = color;
    this.mass = 1;
    this.opacity = 0.1;
    
    
    this.update = particles => {
        this.draw();
        
        for ( let i = 0; i < particles.length; i ++){
            if(this === particles[i]) continue;
            if(getDistance(this.x, this.y, particles[i].x, particles[i].y) - 2 * r < 0) {
                resolveCollision(this, particles[i]);
            }
        }
        
        if(this.x - r <=0 || this.x + r >= innerWidth){
            this.velocity.x = -this.velocity.x;
        }
        if(this.y - r <=0 || this.y + r >= innerHeight){
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // mouse collision detection
        if(getDistance(mouse.x, mouse.y, this.x, this.y) < 300  ){
           if(this.opacity < 0.99){this.opacity += 0.02;}
           if(this.opacity =0.99) {this.opacity = 0.99;}
            
        } else {
            this.opacity = 0.2;
            //this.opacity = Math.max(0, this.opacity);
        }
        
    };
    
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
       
        c.globalAlpha = this.opacity; // new
        c.fillStyle = this.color;
        c.fill();
        /*
        c.save(); // new
        c.globalAlpha = this.opacity; // new
        c.fillStyle = this.color;
        c.fill();
        c.restore();//new
        c.strokeStyle = this.color;
        c.stroke();*/
        c.closePath();
    };
     
}

function getDistance(x1, y1, x2, y2 ){
    return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
}

let particles;

function init() {
   
    particles = [];
    for(i=0; i<150; i++) {
    
        var r = 10;
        let x = randomIntFromRange(r, canvas.width -r);
        let y = randomIntFromRange(r, canvas.height -r);
        var color = randomColor(colors);
       
        
        if(i !==0) {
            for (let j=0; j < particles.length; j++){
                if (getDistance(x, y, particles[j].x, particles[j].y) - 2 * r < 0) {
                    x = randomIntFromRange(r, canvas.width -r);
                    y = randomIntFromRange(r, canvas.height -r);
                    j = -1;
                }
            }
        }
        
        var particle = new Particle(x, y, r, color);   
        particles.push(particle);
    }   
  
}


function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
   
    particles.forEach(particle =>{particle.update(particles);}); //????
   
   // particles[Math.random() * particles.length].update();
    
    /*bigCircle.update(); 
    smallCircle.x = mouse.x;
    smallCircle.y = mouse.y;
    smallCircle.update();
    
    var distance = getDistancey(smallCircle.x, smallCircle.y, bigCircle.x, bigCircle.y);
    if(distance <= smallCircle.r +bigCircle.r){
        bigCircle.color = "blue";
    }else{bigCircle.color= "black"}
    */
}

init();
animate();












