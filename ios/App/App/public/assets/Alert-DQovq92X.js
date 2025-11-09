import{c as r,j as e,f as t}from"./index-s1Im0gGd.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=r("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=r("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=r("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]),x={success:e.jsx(t,{className:"w-5 h-5"}),error:e.jsx(o,{className:"w-5 h-5"}),warning:e.jsx(i,{className:"w-5 h-5"}),info:e.jsx(n,{className:"w-5 h-5"})},d={success:"bg-green-50 border-green-200 text-green-800",error:"bg-red-50 border-red-200 text-red-800",warning:"bg-yellow-50 border-yellow-200 text-yellow-800",info:"bg-blue-50 border-blue-200 text-blue-800"};function y({type:s,title:c,message:l,className:a=""}){return e.jsxs("div",{className:`flex items-start p-4 rounded-lg border ${d[s]} ${a}`,role:"alert",children:[e.jsx("div",{className:"flex-shrink-0",children:x[s]}),e.jsxs("div",{className:"ml-3",children:[c&&e.jsx("h3",{className:"text-sm font-medium",children:c}),e.jsx("p",{className:"text-sm",children:l})]})]})}export{y as A};
