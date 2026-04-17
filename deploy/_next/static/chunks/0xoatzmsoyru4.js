(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,998183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return l},searchParamsToUrlQuery:function(){return o},urlQueryToSearchParams:function(){return s}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});function o(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function i(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function s(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,i(e));else t.set(r,i(n));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},718967,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return y},MiddlewareNotFoundError:function(){return w},MissingStaticPage:function(){return x},NormalizeError:function(){return b},PageNotFoundError:function(){return v},SP:function(){return g},ST:function(){return h},WEB_VITALS:function(){return o},execOnce:function(){return i},getDisplayName:function(){return d},getLocationOrigin:function(){return u},getURL:function(){return c},isAbsoluteUrl:function(){return l},isResSent:function(){return p},loadGetInitialProps:function(){return m},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return k}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function i(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let s=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>s.test(e);function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function c(){let{href:e}=window.location,t=u();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function p(e){return e.finished||e.headersSent}function f(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function m(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await m(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&p(r))return n;if(!n)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let g="u">typeof performance,h=g&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class y extends Error{}class b extends Error{}class v extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class x extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class w extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function k(e){return JSON.stringify({message:e.message,stack:e.stack})}},233525,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"warnOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},195057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return s},formatWithValidation:function(){return u},urlObjectKeys:function(){return l}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(190809)._(e.r(998183)),i=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,n=e.protocol||"",a=e.pathname||"",s=e.hash||"",l=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||i.test(n))&&!1!==u?(u="//"+(u||""),a&&"/"!==a[0]&&(a="/"+a)):u||(u=""),s&&"#"!==s[0]&&(s="#"+s),c&&"?"!==c[0]&&(c="?"+c),a=a.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${n}${u}${a}${c}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return s(e)}},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return a}});let n=e.r(271645);function a(e,t){let r=(0,n.useRef)(null),a=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=o(e,n)),t&&(a.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let n=e.r(718967),a=e.r(652817);function o(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,a.hasBasePath)(r.pathname)}catch(e){return!1}}},284508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return n}});let n=e=>{}},522016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return y},useLinkStatus:function(){return v}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(190809),i=e.r(843476),s=o._(e.r(271645)),l=e.r(195057),u=e.r(8372),c=e.r(818581),d=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),m=e.r(91949),g=e.r(573668),h=e.r(509396);function y(t){var r,n;let a,o,y,[v,x]=(0,s.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,s.useRef)(null),{href:k,as:E,children:j,prefetch:C=null,passHref:P,replace:O,shallow:_,scroll:S,onClick:L,onMouseEnter:T,onTouchStart:N,legacyBehavior:$=!1,onNavigate:M,transitionTypes:A,ref:R,unstable_dynamicOnHover:z,...I}=t;a=j,$&&("string"==typeof a||"number"==typeof a)&&(a=(0,i.jsx)("a",{children:a}));let D=s.default.useContext(u.AppRouterContext),F=!1!==C,U=!1!==C?null===(n=C)||"auto"===n?h.FetchStrategy.PPR:h.FetchStrategy.Full:h.FetchStrategy.PPR,X="string"==typeof(r=E||k)?r:(0,l.formatUrl)(r);if($){if(a?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=s.default.Children.only(a)}let B=$?o&&"object"==typeof o&&o.ref:R,H=s.default.useCallback(e=>(null!==D&&(w.current=(0,m.mountLinkInstance)(e,X,D,U,F,x)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[F,X,D,U,x]),K={ref:(0,c.useMergedRef)(H,B),onClick(t){$||"function"!=typeof L||L(t),$&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!D||t.defaultPrevented||function(t,r,n,a,o,i,l){if("u">typeof window){let u,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((u=t.currentTarget.getAttribute("target"))&&"_self"!==u||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(r)){a&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(699781);s.default.startTransition(()=>{d(r,a?"replace":"push",!1===o?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,n.current,l)})}}(t,X,w,O,S,M,A)},onMouseEnter(e){$||"function"!=typeof T||T(e),$&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),D&&F&&(0,m.onNavigationIntent)(e.currentTarget,!0===z)},onTouchStart:function(e){$||"function"!=typeof N||N(e),$&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),D&&F&&(0,m.onNavigationIntent)(e.currentTarget,!0===z)}};return(0,d.isAbsoluteUrl)(X)?K.href=X:$&&!P&&("a"!==o.type||"href"in o.props)||(K.href=(0,p.addBasePath)(X)),y=$?s.default.cloneElement(o,K):(0,i.jsx)("a",{...I,...K,children:a}),(0,i.jsx)(b.Provider,{value:v,children:y})}e.r(284508);let b=(0,s.createContext)(m.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},618566,(e,t,r)=>{t.exports=e.r(976562)},803627,e=>{"use strict";var t=e.i(271645);function r(e={}){let{intensity:t="medium"}=e;navigator.vibrate&&navigator.vibrate({light:[10],medium:[20],heavy:[40]}[t])}e.i(618566),e.s(["useHapticFeedback",0,function(){let e=(0,t.useCallback)((e={})=>{let{intensity:t="medium"}=e;navigator.vibrate&&navigator.vibrate({light:[10],medium:[20],heavy:[40]}[t])},[]),r=(0,t.useCallback)(()=>e({intensity:"light"}),[e]),n=(0,t.useCallback)(()=>navigator.vibrate?.([10,50,10]),[]);return{vibrate:e,selection:r,success:n,warning:(0,t.useCallback)(()=>navigator.vibrate?.([20,50,20,50,20]),[]),error:(0,t.useCallback)(()=>navigator.vibrate?.([40,100,40,100,40]),[])}},"useLongPress",0,function(e){let{onLongPress:n,duration:a=500}=e,o=(0,t.useRef)(null),i=(0,t.useRef)(null),s=(0,t.useCallback)(()=>{i.current=setTimeout(()=>{r({intensity:"heavy"}),n?.()},a)},[a,n]),l=(0,t.useCallback)(()=>{i.current&&(clearTimeout(i.current),i.current=null)},[]);return(0,t.useEffect)(()=>{let e=o.current;if(e)return e.addEventListener("touchstart",s,{passive:!0}),e.addEventListener("touchend",l,{passive:!0}),e.addEventListener("touchmove",l,{passive:!0}),e.addEventListener("mousedown",s),e.addEventListener("mouseup",l),e.addEventListener("mouseleave",l),()=>{e.removeEventListener("touchstart",s),e.removeEventListener("touchend",l),e.removeEventListener("touchmove",l),e.removeEventListener("mousedown",s),e.removeEventListener("mouseup",l),e.removeEventListener("mouseleave",l),l()}},[s,l]),{ref:o}},"useSwipe",0,function(e){let{onSwipeLeft:n,onSwipeRight:a,onSwipeUp:o,onSwipeDown:i,threshold:s=50,preventDefaultTouchMove:l=!1}=e,u=(0,t.useRef)(null),c=(0,t.useRef)({startX:0,startY:0,currentX:0,currentY:0,isSwiping:!1,startTime:0}),d=(0,t.useCallback)(e=>{let t=e.touches[0];c.current={startX:t.clientX,startY:t.clientY,currentX:t.clientX,currentY:t.clientY,isSwiping:!0,startTime:Date.now()}},[]),p=(0,t.useCallback)(e=>{if(!c.current.isSwiping)return;let t=e.touches[0];c.current.currentX=t.clientX,c.current.currentY=t.clientY,l&&e.preventDefault()},[l]),f=(0,t.useCallback)(()=>{if(!c.current.isSwiping)return;let{startX:e,startY:t,currentX:l,currentY:u,startTime:d}=c.current,p=l-e,f=u-t,m=Math.abs(p),g=Math.abs(f),h=Math.max(m,g)/(Date.now()-d);m>g&&(m>s||h>1)?p>0&&a?(r(),a()):p<0&&n&&(r(),n()):g>m&&(g>s||h>1)&&(f>0&&i?(r(),i()):f<0&&o&&(r(),o())),c.current.isSwiping=!1},[s,n,a,o,i]);return(0,t.useEffect)(()=>{let e=u.current;if(e)return e.addEventListener("touchstart",d,{passive:!0}),e.addEventListener("touchmove",p,{passive:!l}),e.addEventListener("touchend",f,{passive:!0}),()=>{e.removeEventListener("touchstart",d),e.removeEventListener("touchmove",p),e.removeEventListener("touchend",f)}},[d,p,f,l]),{ref:u}}])},283086,e=>{"use strict";let t=(0,e.i(475254).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);e.s(["Sparkles",0,t],283086)},790597,e=>{"use strict";let t=(0,e.i(475254).default)("heart",[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]]);e.s(["Heart",0,t],790597)},37727,e=>{"use strict";let t=(0,e.i(475254).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],37727)},705766,269638,373884,952571,e=>{"use strict";let t,r;var n,a=e.i(271645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,u=(e,t)=>{let r="",n="",a="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":n+="f"==o[1]?u(i,o):o+"{"+u(i,"k"==o[1]?"":t)+"}":"object"==typeof i?n+=u(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=u.p?u.p(o,i):o+":"+i+";")}return r+(t&&a?t+"{"+a+"}":a)+n},c={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e};function p(e){let t,r,n=this||{},a=e.call?e(n.p):e;return((e,t,r,n,a)=>{var o;let p=d(e),f=c[p]||(c[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!c[f]){let t=p!==e?e:(e=>{let t,r,n=[{}];for(;t=i.exec(e.replace(s,""));)t[4]?n.shift():t[3]?(r=t[3].replace(l," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(l," ").trim();return n[0]})(e);c[f]=u(a?{["@keyframes "+f]:t}:t,r?"":"."+f)}let m=r&&c.g?c.g:null;return r&&(c.g=c[f]),o=c[f],m?t.data=t.data.replace(m,o):-1===t.data.indexOf(o)&&(t.data=n?o+t.data:t.data+o),f})(a.unshift?a.raw?(t=[].slice.call(arguments,1),r=n.p,a.reduce((e,n,a)=>{let o=t[a];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+n+(null==o?"":o)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(n.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(n.target),n.g,n.o,n.k)}p.bind({g:1});let f,m,g,h=p.bind({k:1});function y(e,t){let r=this||{};return function(){let n=arguments;function a(o,i){let s=Object.assign({},o),l=s.className||a.className;r.p=Object.assign({theme:m&&m()},s),r.o=/ *go\d+/.test(l),s.className=p.apply(r,n)+(l?" "+l:""),t&&(s.ref=i);let u=e;return e[0]&&(u=s.as||e,delete s.as),g&&u[0]&&g(s),f(u,s)}return t?t(a):a}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w="default",k=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:n}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===n.id),toast:n});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},E=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},P=(e,t=w)=>{C[t]=k(C[t]||j,e),E.forEach(([e,r])=>{e===t&&r(C[t])})},O=e=>Object.keys(C).forEach(t=>P(e,t)),_=(e=w)=>t=>{P(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},L=e=>(t,r)=>{let n,a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(t,e,r);return _(a.toasterId||(n=a.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===n))))({type:2,toast:a}),a.id},T=(e,t)=>L("blank")(e,t);T.error=L("error"),T.success=L("success"),T.loading=L("loading"),T.custom=L("custom"),T.dismiss=(e,t)=>{let r={type:3,toastId:e};t?_(t)(r):O(r)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let r={type:4,toastId:e};t?_(t)(r):O(r)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,r)=>{let n=T.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?b(t.success,e):void 0;return a?T.success(a,{id:n,...r,...null==r?void 0:r.success}):T.dismiss(n),e}).catch(e=>{let a=t.error?b(t.error,e):void 0;a?T.error(a,{id:n,...r,...null==r?void 0:r.error}):T.dismiss(n)}),e};var N=1e3,$=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,A=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,z=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,D=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,U=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,X=y("div")`
  position: absolute;
`,B=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:n}=e;return void 0!==t?"string"==typeof t?a.createElement(K,null,t):t:"blank"===r?null:a.createElement(B,null,a.createElement(I,{...n}),"loading"!==r&&a.createElement(X,null,"error"===r?a.createElement(R,{...n}):a.createElement(U,{...n})))},q=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,W=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Q=a.memo(({toast:e,position:t,style:r,children:n})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[n,a]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=a.createElement(Y,{toast:e}),s=a.createElement(W,{...e.ariaProps},b(e.message,e));return a.createElement(q,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof n?n({icon:i,message:s}):a.createElement(a.Fragment,null,i,s))});n=a.createElement,u.p=void 0,f=n,m=void 0,g=void 0;var V=({id:e,className:t,style:r,onHeightUpdate:n,children:o})=>{let i=a.useCallback(t=>{if(t){let r=()=>{n(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,n]);return a.createElement("div",{ref:i,className:t,style:r},o)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:n,children:o,toasterId:i,containerStyle:s,containerClassName:l})=>{let{toasts:u,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:n}=((e={},t=w)=>{let[r,n]=(0,a.useState)(C[t]||j),o=(0,a.useRef)(C[t]);(0,a.useEffect)(()=>(o.current!==C[t]&&n(C[t]),E.push([t,n]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,n,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...r,toasts:i}})(e,t),o=(0,a.useRef)(new Map).current,i=(0,a.useCallback)((e,t=N)=>{if(o.has(e))return;let r=setTimeout(()=>{o.delete(e),s({type:4,toastId:e})},t);o.set(e,r)},[]);(0,a.useEffect)(()=>{if(n)return;let e=Date.now(),a=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&T.dismiss(r.id);return}return setTimeout(()=>T.dismiss(r.id,t),n)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[r,n,t]);let s=(0,a.useCallback)(_(t),[t]),l=(0,a.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),u=(0,a.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),c=(0,a.useCallback)(()=>{n&&s({type:6,time:Date.now()})},[n,s]),d=(0,a.useCallback)((e,t)=>{let{reverseOrder:n=!1,gutter:a=8,defaultPosition:o}=t||{},i=r.filter(t=>(t.position||o)===(e.position||o)&&t.height),s=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<s&&e.visible).length;return i.filter(e=>e.visible).slice(...n?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[r]);return(0,a.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:u,startPause:l,endPause:c,calculateOffset:d}}})(r,i);return a.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},u.map(r=>{let i,s,l=r.position||t,u=c.calculateOffset(r,{reverseOrder:e,gutter:n,defaultPosition:t}),d=(i=l.includes("top"),s=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${u*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...s});return a.createElement(V,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Z:"",style:d},"custom"===r.type?b(r.message,r):o?o(r):a.createElement(Q,{toast:r,position:l}))}))},"toast",0,T],705766);var J=e.i(475254);let G=(0,J.default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,G],269638);let ee=(0,J.default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",0,ee],373884);let et=(0,J.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);e.s(["Info",0,et],952571)},878894,e=>{"use strict";let t=(0,e.i(475254).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],878894)},174886,e=>{"use strict";let t=(0,e.i(475254).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,t],174886)},465932,e=>{"use strict";var t=e.i(843476),r=e.i(705766),n=e.i(846932),a=e.i(269638),o=e.i(373884),i=e.i(952571),s=e.i(878894),l=e.i(174886),u=e.i(790597),c=e.i(283086),d=e.i(37727),p=e.i(803627);let f={success:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",error:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",info:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",warning:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",custom:"bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60"},m={success:"bg-gradient-to-br from-emerald-500 to-green-600 text-white",error:"bg-gradient-to-br from-red-500 to-rose-600 text-white",info:"bg-gradient-to-br from-blue-500 to-cyan-600 text-white",warning:"bg-gradient-to-br from-amber-500 to-orange-600 text-white",custom:"bg-gradient-to-br from-purple-500 to-pink-600 text-white"},g={success:(0,t.jsx)(a.CheckCircle,{size:18}),error:(0,t.jsx)(o.XCircle,{size:18}),info:(0,t.jsx)(i.Info,{size:18}),warning:(0,t.jsx)(s.AlertTriangle,{size:18}),custom:(0,t.jsx)(c.Sparkles,{size:18})};function h({options:e,onDismiss:r}){let{success:a,selection:o}=(0,p.useHapticFeedback)(),i=e.type||"info";return(0,t.jsxs)(n.motion.div,{initial:{opacity:0,y:-20,scale:.96},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-10,scale:.96},transition:{type:"spring",stiffness:350,damping:28},className:`
        ${f[i]} px-4 py-3.5 rounded-2xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        flex items-start gap-3.5 min-w-[340px] sm:min-w-[380px] cursor-default
        backdrop-blur-xl bg-white/95 dark:bg-gray-800/95
      `,onClick:()=>{o()},children:[(0,t.jsx)(n.motion.div,{className:`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          shadow-lg ${m[i]}
        `,initial:{scale:.8,rotate:-10},animate:{scale:1,rotate:0},transition:{type:"spring",stiffness:400,damping:20,delay:.1},children:e.icon||g[i]}),(0,t.jsxs)("div",{className:"flex-1 min-w-0 pt-0.5",children:[e.title&&(0,t.jsx)("h4",{className:"font-semibold text-[14px] text-gray-900 dark:text-white mb-0.5 tracking-tight",children:e.title}),(0,t.jsx)("p",{className:"text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed",children:e.message}),e.action&&(0,t.jsx)("button",{onClick:t=>{t.stopPropagation(),a(),e.action?.onClick(),r()},className:"mt-2.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[12px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 active:scale-0.95 transition-transform",children:e.action.label})]}),(0,t.jsx)("button",{onClick:e=>{e.stopPropagation(),o(),r()},className:"flex-shrink-0 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-0.5",children:(0,t.jsx)(d.X,{className:"w-4 h-4 text-gray-400 dark:text-gray-500"})})]})}function y({title:e,message:n,type:a="info",icon:o,duration:i=3500,action:s}){return r.toast.custom(i=>(0,t.jsx)(h,{options:{title:e,message:n,type:a,icon:o,action:s},onDismiss:()=>r.toast.dismiss(i.id)}),{duration:i,position:"top-right",style:{background:"transparent",border:"none",boxShadow:"none",padding:0,maxWidth:"none"}})}e.s(["default",0,function({children:e}){return(0,t.jsxs)(t.Fragment,{children:[e,(0,t.jsx)(r.Toaster,{containerClassName:"toast-container",gutter:16,toastOptions:{style:{background:"transparent",border:"none",boxShadow:"none",padding:0}}})]})},"showActivateToast",0,function(e){y({type:"info",title:"激活技能",message:`正在加载 "${e}" 技能定义...`,icon:(0,t.jsx)(c.Sparkles,{size:20})})},"showCopyToast",0,function(e){y({type:"success",title:"已复制",message:`"${e}" 已复制到剪贴板`,icon:(0,t.jsx)(l.Copy,{size:20})})},"showFavoriteToast",0,function(e,r){y({type:"custom",title:r?"已收藏":"已取消收藏",message:r?`"${e}" 已添加到收藏夹`:`"${e}" 已从收藏夹移除`,icon:(0,t.jsx)(u.Heart,{size:20,className:r?"fill-white":""})})},"showToast",0,y])}]);