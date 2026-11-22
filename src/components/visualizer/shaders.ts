// Simplex 3D noise — Ian McEwan, Ashima Arts (MIT License)
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const COMMON_UNIFORMS = /* glsl */ `
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uKick;
uniform float uFade;
uniform float uPixelRatio;
uniform sampler2D uHist;
`;

// Gold ramp shared by the point modes
const GOLD = /* glsl */ `
vec3 goldRamp(float t){
  vec3 deep=vec3(0.42,0.31,0.11);
  vec3 gold=vec3(0.79,0.63,0.29);
  vec3 light=vec3(1.0,0.91,0.68);
  vec3 c=mix(deep,gold,smoothstep(0.0,0.45,t));
  return mix(c,light,smoothstep(0.45,1.0,t));
}
`;

// ── Mode 1: Aurum — gold particle nebula ────────────────────────────────────
export const aurumVert = /* glsl */ `
${COMMON_UNIFORMS}
attribute vec3 aRand;
varying float vGlow;
varying float vAlpha;
${NOISE}
void main(){
  vec3 dir=normalize(position);
  float r=length(position);
  // lows around the equator, highs toward the poles
  float u=clamp(abs(dir.y),0.0,1.0);
  float f=texture2D(uHist,vec2(u*0.75+0.01,0.5/48.0)).r;
  float n=snoise(dir*1.35+vec3(0.0,uTime*0.12,uTime*0.05));
  float swirl=snoise(dir*3.0+vec3(uTime*0.2));
  vec3 p=dir*(r+n*(0.16+uBass*0.55)+f*0.65*aRand.y+uKick*0.22*aRand.x);
  p+=cross(dir,vec3(0.0,1.0,0.0))*swirl*0.06*(1.0+uMid*2.0);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  float size=(0.6+aRand.z*1.4)*(1.0+f*1.6+uKick*0.6);
  gl_PointSize=size*14.0*uPixelRatio/-mv.z;
  vGlow=clamp(f*0.9+n*0.25+uKick*0.3+aRand.x*0.15,0.0,1.0);
  vAlpha=uFade*(0.35+0.65*aRand.y);
}
`;

export const pointFrag = /* glsl */ `
varying float vGlow;
varying float vAlpha;
${GOLD}
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=length(c);
  float a=smoothstep(0.5,0.0,d);
  a=a*a;
  vec3 col=goldRamp(vGlow);
  gl_FragColor=vec4(col*a*vAlpha,a*vAlpha);
}
`;

// ── Mode 2: Liquid Metal — displaced molten sphere ─────────────────────────
export const liquidVert = /* glsl */ `
${COMMON_UNIFORMS}
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
${NOISE}
float disp(vec3 p){
  float u=clamp(abs(p.y),0.0,1.0);
  float f=texture2D(uHist,vec2(u*0.6+0.02,0.5/48.0)).r;
  float n1=snoise(p*1.25+vec3(0.0,uTime*0.22,uTime*0.1))*(0.16+uBass*0.42);
  float n2=snoise(p*3.4+vec3(uTime*0.35))*(0.03+uHigh*0.16);
  return n1+n2+f*0.1+uKick*0.07;
}
void main(){
  vec3 p=normalize(position);
  float d=disp(p);
  vec3 pos=p*(1.0+d);
  vec3 t=normalize(cross(p,abs(p.y)<0.99?vec3(0.0,1.0,0.0):vec3(1.0,0.0,0.0)));
  vec3 b=normalize(cross(p,t));
  float e=0.012;
  vec3 p1=normalize(p+t*e);
  vec3 p2=normalize(p+b*e);
  vec3 q1=p1*(1.0+disp(p1));
  vec3 q2=p2*(1.0+disp(p2));
  vec3 n=normalize(cross(q1-pos,q2-pos));
  if(dot(n,p)<0.0) n=-n;
  vNormal=normalize(normalMatrix*n);
  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  vViewPos=mv.xyz;
  vDisp=d;
  gl_Position=projectionMatrix*mv;
}
`;

export const liquidFrag = /* glsl */ `
uniform float uTime;
uniform float uBass;
uniform float uKick;
uniform float uFade;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
vec3 env(vec3 r){
  float y=r.y;
  float bands=0.5+0.5*sin(y*7.0+r.x*2.5+uTime*0.35);
  float soft=smoothstep(0.55,1.0,y)*1.3+smoothstep(0.7,1.0,-r.x)*0.5+smoothstep(0.85,1.0,r.x)*0.35;
  vec3 velvet=vec3(0.03,0.1,0.065);
  vec3 gold=vec3(0.78,0.6,0.26);
  vec3 c=mix(velvet,gold,clamp(smoothstep(-0.5,0.7,y)*0.85+bands*0.22,0.0,1.0));
  c+=vec3(1.0,0.92,0.72)*soft;
  return c;
}
void main(){
  vec3 V=normalize(-vViewPos);
  vec3 N=normalize(vNormal);
  vec3 R=reflect(-V,N);
  vec3 c=env(R)*vec3(1.0,0.86,0.58);
  float fres=pow(1.0-max(dot(N,V),0.0),3.0);
  c+=vec3(1.0,0.82,0.45)*fres*(0.35+uBass*0.9+uKick*0.4);
  c*=0.82+vDisp*0.9;
  gl_FragColor=vec4(c*uFade,1.0);
}
`;

// ── Mode 3: Halo — spectral rings in time ──────────────────────────────────
export const haloVert = /* glsl */ `
${COMMON_UNIFORMS}
attribute float aAngle;
attribute float aRing;
varying float vGlow;
varying float vAlpha;
void main(){
  float u=abs(fract(aAngle/6.2831853)*2.0-1.0);
  float f=texture2D(uHist,vec2(u*0.7+0.01,aRing)).r;
  float fall=1.0-aRing;
  float base=0.42+aRing*1.25;
  float r=base+f*0.42*(0.4+fall*0.6)+uKick*0.06*fall;
  vec3 p=vec3(cos(aAngle)*r,sin(aAngle)*r,-aRing*0.9+f*0.35*fall);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=(2.4+f*6.0*fall)*uPixelRatio*(3.4/-mv.z);
  vGlow=clamp(0.15+f*1.2*(0.4+fall*0.6)+uBass*0.2,0.0,1.0);
  vAlpha=uFade*(0.3+fall*0.9);
}
`;

// ── Ambient dust (all modes) ────────────────────────────────────────────────
export const dustVert = /* glsl */ `
${COMMON_UNIFORMS}
attribute vec3 aRand;
varying float vGlow;
varying float vAlpha;
void main(){
  vec3 p=position;
  p.y+=mod(uTime*0.04*(0.3+aRand.x)+aRand.y*6.0,6.0)-3.0;
  p.x+=sin(uTime*0.2+aRand.z*6.28)*0.15;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=(0.8+aRand.z*1.6)*(1.0+uKick*0.8)*uPixelRatio*(4.0/-mv.z);
  vGlow=0.3+aRand.x*0.5;
  vAlpha=0.35+uMid*0.6;
}
`;

// ── Background: velvet vignette with a gold breath on the bass ─────────────
export const bgVert = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=vec4(position.xy,0.999,1.0);
}
`;

export const bgFrag = /* glsl */ `
uniform float uBass;
uniform float uAspect;
varying vec2 vUv;
void main(){
  vec2 p=(vUv-0.5)*vec2(uAspect,1.0);
  float d=length(p);
  vec3 base=mix(vec3(0.055,0.16,0.11),vec3(0.027,0.1,0.07),smoothstep(0.0,0.9,d));
  float glow=exp(-d*d*5.0)*(0.06+uBass*0.16);
  base+=vec3(0.79,0.63,0.29)*glow;
  gl_FragColor=vec4(base,1.0);
}
`;
