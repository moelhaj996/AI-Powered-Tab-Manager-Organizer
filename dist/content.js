(()=>{"use strict";chrome.runtime.onMessage.addListener(((e,t,n)=>{var o;return"EXTRACT_CONTENT"===e.type&&n({title:document.title,metaDescription:(null===(o=document.querySelector('meta[name="description"]'))||void 0===o?void 0:o.getAttribute("content"))||"",h1Text:Array.from(document.getElementsByTagName("h1")).map((e=>e.textContent)).join(" "),url:window.location.href}),!0}))})();
//# sourceMappingURL=content.js.map