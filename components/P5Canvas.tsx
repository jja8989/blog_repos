// components/P5Canvas.tsx
"use client";

import React, { useRef, useEffect } from "react";
import p5 from "p5";

interface P5CanvasProps {
  showFirstSketch: boolean;
}

const P5Canvas: React.FC<P5CanvasProps> = ({ showFirstSketch }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5;

    const firstSketch = (p: p5) => {
      // Particle path animation sketch
      let paths: Path[] = [];
      let framesBetweenParticles = 5;
      let nextParticleFrame = 0;
      let previousParticlePosition: p5.Vector;
      let particleFadeFrames = 300;

      p.setup = () => {
        const width = sketchRef.current?.offsetWidth || 2460;
        const height = sketchRef.current?.offsetHeight || 2460;

        p.createCanvas(width, height);
        p.colorMode(p.HSB);
        previousParticlePosition = p.createVector();
      };

      p.windowResized = () => {
        const width = sketchRef.current?.offsetWidth || 2460;
        const height = sketchRef.current?.offsetHeight || 2460;
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        p.background(0);
        paths.forEach((path) => {
          path.update();
          path.display();
        });
      };

      p.mousePressed = () => {
        nextParticleFrame = p.frameCount;
        paths.push(new Path());
        previousParticlePosition.set(p.mouseX, p.mouseY);
        createParticle();
      };

      p.mouseDragged = () => {
        if (p.frameCount >= nextParticleFrame) {
          createParticle();
        }
      };

      function createParticle() {
        let mousePosition = p.createVector(p.mouseX, p.mouseY);
        let velocity = p5.Vector.sub(mousePosition, previousParticlePosition).mult(0.05);
        let lastPath = paths[paths.length - 1];
        lastPath.addParticle(mousePosition, velocity);
        nextParticleFrame = p.frameCount + framesBetweenParticles;
        previousParticlePosition.set(p.mouseX, p.mouseY);
      }

      class Path {
        particles: Particle[] = [];

        addParticle(position: p5.Vector, velocity: p5.Vector) {
          let particleHue = (this.particles.length * 30) % 360;
          this.particles.push(new Particle(position, velocity, particleHue));
        }

        update() {
          this.particles.forEach((particle) => particle.update());
        }

        display() {
          for (let i = this.particles.length - 1; i >= 0; i -= 1) {
            if (this.particles[i].framesRemaining <= 0) {
              this.particles.splice(i, 1);
            } else {
              this.particles[i].display();
              if (i < this.particles.length - 1) {
                this.connectParticles(this.particles[i], this.particles[i + 1]);
              }
            }
          }
        }

        connectParticles(particleA: Particle, particleB: Particle) {
          let opacity = particleA.framesRemaining / particleFadeFrames;
          p.stroke(255, opacity);
          p.line(particleA.position.x, particleA.position.y, particleB.position.x, particleB.position.y);
        }
      }

      class Particle {
        position: p5.Vector;
        velocity: p5.Vector;
        hue: number;
        drag: number = 0.95;
        framesRemaining: number = particleFadeFrames;

        constructor(position: p5.Vector, velocity: p5.Vector, hue: number) {
          this.position = position.copy();
          this.velocity = velocity.copy();
          this.hue = hue;
        }

        update() {
          this.position.add(this.velocity);
          this.velocity.mult(this.drag);
          this.framesRemaining -= 1;
        }

        display() {
          let opacity = this.framesRemaining / particleFadeFrames;
          p.noStroke();
          p.fill(this.hue, 80, 90, opacity);
          p.circle(this.position.x, this.position.y, 24);
        }
      }
    };

    const secondSketch = (p: p5) => {
      // Node-based animation with spring effect
      let centerX = 0.0;
      let centerY = 0.0;
      let radius = 45;
      let rotAngle = -90;
      let accelX = 0.0;
      let accelY = 0.0;
      let deltaX = 0.0;
      let deltaY = 0.0;
      let springing = 0.0009;
      let damping = 0.98;
      let nodes = 5;
      let nodeStartX: number[] = [];
      let nodeStartY: number[] = [];
      let nodeX: number[] = [];
      let nodeY: number[] = [];
      let angle: number[] = [];
      let frequency: number[] = [];
      let organicConstant = 1.0;

      p.setup = () => {
        const width = sketchRef.current?.offsetWidth || 710;
        const height = sketchRef.current?.offsetHeight || 400;

        p.createCanvas(width, height);
        centerX = p.width / 2;
        centerY = p.height / 2;

        for (let i = 0; i < nodes; i++) {
          nodeStartX[i] = 0;
          nodeStartY[i] = 0;
          nodeX[i] = 0;
          nodeY[i] = 0;
          angle[i] = 0;
        }

        for (let i = 0; i < nodes; i++) {
          frequency[i] = p.random(5, 12);
        }

        p.noStroke();
        p.angleMode(p.DEGREES);
      };

      p.draw = () => {
        p.background(0, 50);
        drawShape();
        moveShape();
      };

      function drawShape() {
        for (let i = 0; i < nodes; i++) {
          nodeStartX[i] = centerX + p.cos(rotAngle) * radius;
          nodeStartY[i] = centerY + p.sin(rotAngle) * radius;
          rotAngle += 360.0 / nodes;
        }

        p.curveTightness(organicConstant);
        let shapeColor = p.lerpColor(p.color("red"), p.color("yellow"), organicConstant);
        p.fill(shapeColor);

        p.beginShape();
        for (let i = 0; i < nodes; i++) {
          p.curveVertex(nodeX[i], nodeY[i]);
        }
        p.endShape(p.CLOSE);
      }

      function moveShape() {
        deltaX = p.mouseX - centerX;
        deltaY = p.mouseY - centerY;
        deltaX *= springing;
        deltaY *= springing;
        accelX += deltaX;
        accelY += deltaY;
        centerX += accelX;
        centerY += accelY;
        accelX *= damping;
        accelY *= damping;
        organicConstant = 1 - (p.abs(accelX) + p.abs(accelY)) * 0.1;

        for (let i = 0; i < nodes; i++) {
          nodeX[i] = nodeStartX[i] + p.sin(angle[i]) * (accelX * 2);
          nodeY[i] = nodeStartY[i] + p.sin(angle[i]) * (accelY * 2);
          angle[i] += frequency[i];
        }
      }
    };

    // Initialize the correct sketch based on the `showFirstSketch` prop
    if (showFirstSketch) {
      p5Instance = new p5(firstSketch, sketchRef.current!);
    } else {
      p5Instance = new p5(secondSketch, sketchRef.current!);
    }

    return () => {
      p5Instance.remove(); // Clean up the instance
    };
  }, [showFirstSketch]);

  return (
    <div
      ref={sketchRef}
      style={{ width: "100%", height: "60vh", minHeight: "400px" }}
    />
  );
};

export default P5Canvas;
