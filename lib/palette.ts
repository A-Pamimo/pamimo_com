/**
 * The clock palette: a continuous loop of earth tones over 24 hours.
 *
 * Eight stops around the clock, blended smoothly minute by minute: deep moss at
 * midnight, aubergine earth before dawn, clay at 6:00, wheat at 9:00, sage linen
 * at noon, ochre sand mid-afternoon, sienna at 18:00 and umber at 21:00, then
 * back to moss. The pen (PA mark, ribbon, origami) travels its own earthy path
 * alongside: clay, rust, olive, terracotta, moss, brick and ochre. The page dims
 * through the evening, fades dark around sunset and light again at dawn.
 *
 * The engine is a plain ES5 source string so the exact same code runs in the
 * pre-paint script (before first paint, no flash) and in ClockPalette, which
 * re-applies it every minute while the page is open.
 */

export interface Palette {
    bg: string;
    ink: string;
    mute: string;
    ribbon: string;
    link: string;
    rule: string;
    field: string;
    focus: string;
    select: string;
    tone: 'light' | 'dark';
}

export const PALETTE_SOURCE = `
function paPalette(ms){
var d=new Date(ms),t=d.getHours()+d.getMinutes()/60;
function clamp(x,a,b){return Math.min(b,Math.max(a,x))}
function smooth(a,b,x){x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)}
function lin(c){return c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055}
function rgb(L,C,H){var h=H*Math.PI/180,a=C*Math.cos(h),b=C*Math.sin(h);
var l=Math.pow(L+0.3963377774*a+0.2158037573*b,3),m=Math.pow(L-0.1055613458*a-0.0638541728*b,3),s=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
return [4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s]}
function col(L,C,H){var c=C,v;for(var i=0;i<24;i++){v=rgb(L,c,H);if(v[0]>=0&&v[0]<=1&&v[1]>=0&&v[1]<=1&&v[2]>=0&&v[2]<=1)break;c*=0.85}
v=rgb(L,c,H);return v.map(function(x){return clamp(lin(clamp(x,0,1)),0,1)})}
function hex(v){return '#'+v.map(function(x){var s=Math.round(x*255).toString(16);return s.length<2?'0'+s:s}).join('')}
function lum(v){var c=v.map(function(x){return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
function ratio(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
var K=[[0,145,0.022,55,0.12],[3,30,0.024,85,0.12],[6,45,0.035,40,0.14],[9,80,0.04,140,0.12],
[12,115,0.03,50,0.14],[15,95,0.045,150,0.11],[18,60,0.045,30,0.15],[21,70,0.026,90,0.13],[24,145,0.022,55,0.12]];
var i0=Math.floor(t/3),a=K[i0],b=K[i0+1],f=smooth(0,1,(t-a[0])/3);
function arc(x,y,k){var dh=((y-x+540)%360)-180;return (x+dh*k+360)%360}
var hue=arc(a[1],b[1],f),bc=a[2]+(b[2]-a[2])*f,pen=arc(a[3],b[3],f),pc=a[4]+(b[4]-a[4])*f,lk=hue;
var k=t>=12?smooth(19.5,20.1667,t):1-smooth(5.3333,6,t);
var day=t>=12?0.955-0.085*smooth(12,19.5,t):0.9+0.055*smooth(6,12,t);
var L=day*(1-k)+0.19*k;
if(L>0.42&&L<0.72)L=L>=0.57?0.72:0.42;
var dark=L<0.57,bgv=col(L,bc,hue);
function fit(L0,C,H,need){var Lx=L0,v;for(var i=0;i<80;i++){v=col(Lx,C,H);if(ratio(v,bgv)>=need)return v;Lx=dark?Math.min(0.995,Lx+0.01):Math.max(0.05,Lx-0.01)}return v}
var ink=fit(dark?0.93:0.24,dark?0.018:0.03,hue,7.2),mute=fit(dark?0.76:0.47,dark?0.04:Math.max(0.06,bc*1.5),hue,4.7),
link=fit(dark?0.84:0.38,dark?0.06:0.08,lk,4.7);
var rib=fit(dark?0.72:0.52,pc,pen,3.2);
var r=hex(rib).slice(1),rr=parseInt(r.slice(0,2),16),rg=parseInt(r.slice(2,4),16),rb=parseInt(r.slice(4),16);
return {bg:hex(bgv),ink:hex(ink),mute:hex(mute),ribbon:hex(rib),link:hex(link),
rule:hex(col(dark?L+0.1:L-0.085,bc*0.8,hue)),field:hex(col(dark?L+0.04:Math.min(0.985,L+0.03),bc*0.7,hue)),
focus:hex(link),select:'rgba('+rr+','+rg+','+rb+','+(dark?0.3:0.2)+')',tone:dark?'dark':'light'}}
function paApply(p){var s=document.documentElement;
['bg','ink','mute','ribbon','link','rule','field','focus','select'].forEach(function(k){s.style.setProperty('--pa-'+k,p[k])});
s.dataset.tone=p.tone}
`;

type Engine = { paPalette: (ms: number) => Palette; paApply: (p: Palette) => void };

let engine: Engine | null = null;

/** The engine compiled from the shared source, for use after mount */
export const paletteEngine = (): Engine => {
    if (!engine) engine = new Function(`${PALETTE_SOURCE}; return { paPalette: paPalette, paApply: paApply };`)() as Engine;
    return engine;
};
