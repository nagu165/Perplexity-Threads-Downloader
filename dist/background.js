(()=>{"use strict";({643:function(){var e=this&&this.__awaiter||function(e,n,o,r){return new(o||(o=Promise))((function(t,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function c(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var n;e.done?t(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(a,c)}s((r=r.apply(e,n||[])).next())}))};chrome.runtime.onInstalled.addListener((()=>{console.log("Perplexity Threads Downloader was installed")})),chrome.runtime.onMessage.addListener(((e,n,o)=>{if("downloadMarkdown"===e.action){const n=function(e){let n=e.split("\n"),o=[],r=new Set;for(let e of n){let n=e.trim().replace(/^\*.*?\*:\s*/,"");n&&!r.has(n)&&(o.push(e),r.add(n))}return o.join("\n")}(e.markdown),r="data:text/markdown;charset=utf-8,"+encodeURIComponent(n);return chrome.downloads.download({url:r,filename:e.filename,saveAs:!0},(e=>{chrome.runtime.lastError?(console.err("Download err:",chrome.runtime.lastError),o({success:!1,err:chrome.runtime.lastError.message})):o({success:!0,downloadId:e})})),!0}})),chrome.action.onClicked.addListener((n=>e(void 0,void 0,void 0,(function*(){var e;n.id&&(null===(e=n.url)||void 0===e?void 0:e.includes("perplexity.ai"))&&(yield chrome.scripting.executeScript({target:{tabId:n.id},files:["content.js"]}))}))))}})[643]()})();