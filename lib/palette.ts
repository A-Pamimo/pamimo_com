/**
 * The clock palette: one continuous colour wheel over 24 hours.
 *
 * The ground's hue turns 15 degrees an hour (rose at 6:00, butter at noon, mint
 * mid-afternoon, sky at 18:00, indigo, violet and plum through the night) and
 * comes back round to rose at dawn. The pen (PA mark, ribbon, origami) always sits
 * a third of the way round the wheel from the ground (hue + 120), so every minute
 * is one family and the pen never settles into a stock pairing. The pen skips
 * purple and violet (an on-screen hue of 250 to 315), a stock AI-design colour,
 * with one quick hop hidden inside the sunset fade. The page dims through
 * the evening, fades dark around sunset and light again at dawn.
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
var hue=((20+15*(t-6))%360+360)%360,lk=(hue+30)%360;
var pen=(hue+120)%360*303/360;if(pen>=283)pen+=57;
var k=t>=12?smooth(19.5,20.1667,t):1-smooth(5.3333,6,t);
var day=t>=12?0.955-0.085*smooth(12,19.5,t):0.9+0.055*smooth(6,12,t);
var L=day*(1-k)+0.19*k;
if(L>0.42&&L<0.72)L=L>=0.57?0.72:0.42;
var dark=L<0.57,bgv=col(L,dark?0.035:0.04,hue);
function fit(L0,C,H,need){var Lx=L0,v;for(var i=0;i<80;i++){v=col(Lx,C,H);if(ratio(v,bgv)>=need)return v;Lx=dark?Math.min(0.995,Lx+0.01):Math.max(0.05,Lx-0.01)}return v}
var ink=fit(dark?0.93:0.24,dark?0.02:0.035,hue,7.2),mute=fit(dark?0.76:0.47,dark?0.03:0.04,hue,4.7),
link=fit(dark?0.84:0.4,dark?0.08:0.11,lk,4.7);
function shue(v){var mx=Math.max(v[0],v[1],v[2]),mn=Math.min(v[0],v[1],v[2]),d=mx-mn;if(!d)return 0;
var h=mx===v[0]?((v[1]-v[2])/d)%6:mx===v[1]?(v[2]-v[0])/d+2:(v[0]-v[1])/d+4;return (h*60+360)%360}
var rib=fit(dark?0.74:0.55,dark?0.15:0.17,pen,3.2);
for(var j=0;j<30&&shue(rib)>=250&&shue(rib)<=315;j++){pen=(pen+4)%360;rib=fit(dark?0.74:0.55,dark?0.15:0.17,pen,3.2)}
var r=hex(rib).slice(1),rr=parseInt(r.slice(0,2),16),rg=parseInt(r.slice(2,4),16),rb=parseInt(r.slice(4),16);
return {bg:hex(bgv),ink:hex(ink),mute:hex(mute),ribbon:hex(rib),link:hex(link),
rule:hex(col(dark?L+0.1:L-0.085,0.03,hue)),field:hex(col(dark?L+0.04:Math.min(0.985,L+0.03),0.025,hue)),
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
