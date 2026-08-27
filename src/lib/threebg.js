import * as THREE from 'three';

export function initThreeBG(canvas){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(prefersReduced) return {dispose:()=>{}};

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,200);
  camera.position.z=60;

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  const COUNT=800;
  const geom=new THREE.BufferGeometry();
  const pos=new Float32Array(COUNT*3);
  const col=new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const r=30+Math.random()*30;
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
    pos[i*3+2]=r*Math.cos(phi);
    const hue=.35+Math.random()*.1;
    const color=new THREE.Color().setHSL(hue,.6,.5);
    col[i*3]=color.r;col[i*3+1]=color.g;col[i*3+2]=color.b;
  }
  geom.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geom.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({size:.35,vertexColors:true,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending});
  const points=new THREE.Points(geom,mat);
  scene.add(points);

  let mouseX=0,mouseY=0;
  window.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/innerWidth-.5)*2;
    mouseY=(e.clientY/innerHeight-.5)*2;
  },{passive:true});

  function resize(){
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  }
  window.addEventListener('resize',resize);

  let raf;
  function tick(){
    const time=performance.now()*0.0003;
    points.rotation.y=time*0.07;
    points.rotation.x=Math.sin(time*0.3)*0.05;
    camera.position.x+= (mouseX*8 - camera.position.x)*0.02;
    camera.position.y+= (-mouseY*8 - camera.position.y)*0.02;
    camera.lookAt(0,0,0);
    renderer.render(scene,camera);
    raf=requestAnimationFrame(tick);
  }
  tick();

  return {
    dispose(){
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',resize);
      renderer.dispose();
      geom.dispose();mat.dispose();
    }
  };
}