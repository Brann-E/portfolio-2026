(function(){
  const cv=document.getElementById('bg');
  if(!cv)return;
  const x=cv.getContext('2d');
  const PALETTE=[[159,110,255],[40,230,255],[47,255,180],[255,234,77],[249,104,167]];
  let W,H,DPR,P=[],links=[];
  let mx=-9999,my=-9999;
  let SP,LINK,LINK2,DEPTH=820;const FOV=800,REVEAL=170;
  function size(){DPR=Math.min(devicePixelRatio||1,2);W=cv.clientWidth=innerWidth;H=cv.clientHeight=innerHeight;cv.width=W*DPR;cv.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);build();}
  function build(){
    SP=Math.max(120,Math.min(W,H)/7);LINK=SP*1.7;LINK2=LINK*LINK;P=[];
    const cols=Math.ceil(W/SP)+2,rows=Math.ceil(H/SP)+2,deps=3;
    for(let iz=0;iz<deps;iz++)for(let iy=0;iy<rows;iy++)for(let ix=0;ix<cols;ix++){
      const ax=(ix-1)*SP+(Math.random()-.5)*SP*.7,ay=(iy-1)*SP+(Math.random()-.5)*SP*.7,az=(iz+.5)*(DEPTH/deps)+(Math.random()-.5)*SP;
      P.push({ax,ay,az,x:ax,y:ay,z:az,phx:Math.random()*6.28,phy:Math.random()*6.28,e:0});
    }
    links=[];for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const dx=P[i].ax-P[j].ax,dy=P[i].ay-P[j].ay,dz=P[i].az-P[j].az;if(dx*dx+dy*dy+dz*dz<LINK2)links.push([i,j]);}
  }
  size();addEventListener('resize',size);
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  addEventListener('mouseleave',()=>{mx=-9999;my=-9999;});
  function colorAt(position){const t=Math.max(0,Math.min(1,position))*(PALETTE.length-1),i=Math.floor(t),f=t-i,a=PALETTE[i],b=PALETTE[Math.min(PALETTE.length-1,i+1)];return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];}
  let tt=0;
  function frame(){
    tt+=0.006;
    x.clearRect(0,0,W,H);
    for(const p of P){
      const wave=Math.sin(p.ax*0.006+tt)+Math.cos(p.ay*0.006-tt*0.85),w2=Math.sin((p.ax+p.ay)*0.004+tt*0.6),A=SP*0.32;
      p.x=p.ax+Math.cos(p.phx+wave)*A;p.y=p.ay+Math.sin(p.phy+wave)*A;p.z=p.az+w2*SP*0.5;
      const s=FOV/(FOV+p.z);p.sx=W/2+(p.x-W/2)*s;p.sy=H/2+(p.y-H/2)*s;p.s=s;
      let tg=0;const dm=Math.hypot(p.sx-mx,p.sy-my);if(dm<REVEAL)tg=(1-dm/REVEAL);
      if(tg>p.e)p.e+=(tg-p.e)*0.10;else p.e+=(tg-p.e)*0.05;
    }
    const order=P.map((p,i)=>i).sort((a,b)=>P[b].z-P[a].z);
    for(const [i,j] of links){
      const a=P[i],b=P[j];if(Math.abs(a.x-b.x)>LINK*1.5||Math.abs(a.y-b.y)>LINK*1.5)continue;
      const rev=Math.max(a.e,b.e),op=(0.02+rev*0.20)*Math.max(a.s,b.s),col=colorAt(((a.sx+b.sx)/(2*W))*0.75+((a.sy+b.sy)/(2*H))*0.25),r=col[0],g=col[1],bl=col[2];
      x.strokeStyle='rgb('+(r|0)+','+(g|0)+','+(bl|0)+')';x.globalAlpha=op;x.lineWidth=0.4*Math.max(a.s,b.s);
      x.beginPath();x.moveTo(a.sx,a.sy);x.lineTo(b.sx,b.sy);x.stroke();
    }
    for(let ii=0;ii<order.length;ii++){
      const p=P[order[ii]],rev=p.e,op=Math.min(0.85,0.09+rev*0.78),col=colorAt((p.sx/W)*0.75+(p.sy/H)*0.25),r=col[0],g=col[1],bl=col[2];
      x.globalAlpha=op;x.fillStyle='rgb('+(r|0)+','+(g|0)+','+(bl|0)+')';
      const rad=(1.2+rev*1.5)*p.s*1.4;x.beginPath();x.arc(p.sx,p.sy,Math.max(0.4,rad),0,6.28);x.fill();
    }
    x.globalAlpha=1;requestAnimationFrame(frame);
  }
  frame();
})();
