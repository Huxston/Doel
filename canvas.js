var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

let mouse = {
	x: undefined,
	y: undefined
}

let radius = 10;
let particles;

window.addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
  })

function distance(x1, y1, x2, y2){
	const xDistance = x2-x1;
	const yDistance = y2-y1;
	
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}	

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	init();
})

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function Particle(x, y, pet){
	this.x = x;
	this.y = y;
	this.velocity = {
		x: (Math.random()-0.5) * 2,
		y: (Math.random()-0.5) * 2
	}		

	this.pet = pet;
	this.mass = 1;
	
	this.update = particles =>{
	
		if (this.x - 10 > innerWidth || this.x +40 < 0) {
		this.velocity.x = -this.velocity.x;
		}  

		if (this.y - 40> innerHeight || this.y + 25 < 0) {
		this.velocity.y = -this.velocity.y;
		}  
	
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	
		this.draw();
		
		for (let i = 0; i < particles.length; i++){
			if (this == particles[i]) continue;
			
			if (distance(this.x, this.y, particles[i].x, particles[i].y) - radius * 2 < 0){
				resolveCollision(this, particles[i]);
			}
		}
			
					
		if (distance(this.x, this.y, mouse.x, mouse.y) - radius * 4 < 0){	
			
			
			this.x = mouse.x + this.velocity.x*8;
		    this.y = mouse.y + this.velocity.y*8;
			
		}
	}
	
		
	this.draw = function(){ 
		c.font = "30px Arial";
		c.fillText(this.pet, this.x, this.y);
	}
}



function init(){
	particles = [];
	
	for (let i = 0; i < 100; i++){
		const petsArray = ["🐶", "🐱", "🐭", "🐹", "🐰", "🐷", "🐮", "🐵", "🐔", "🐦", "🐥", "🐴"];
		const pet = petsArray[Math.floor(Math.random() * petsArray.length)];
	
		let x = Math.random()*(innerWidth - 30 *2) + 30;
		let y = Math.random()*(innerHeight - 30 *2) + 30;

		
		if(i !== 0){
		   for (let j = 0; j < particles.length; j++){
			   if (distance(x, y, particles[j].x, particles[j].y)- radius * 2 < 0){		
				   x = Math.random()*(innerWidth - 30 *2) + 30;
				   y = Math.random()*(innerHeight - 30 *2) + 30;
				   
				   j = -1;
			   }
		   }
		}
	
		particles.push(new Particle(x, y, pet));
	}
}


function animate(){
	requestAnimationFrame(animate); 
	c.clearRect(0, 0, innerWidth, innerHeight);
		
		
	particles.forEach (particle => {	
		particle.update(particles);
	})
}

init();
animate();