(()=>{"use strict";({643:function(){var e=this&&this.__awaiter||function(e,o,n,r){return new(n||(n=Promise))((function(t,i){function a(e){try{c(r.next(e))}catch(e){i(e)}}function d(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var o;e.done?t(e.value):(o=e.value,o instanceof n?o:new n((function(e){e(o)}))).then(a,d)}c((r=r.apply(e,o||[])).next())}))};chrome.runtime.onInstalled.addListener((()=>{console.log("Perplexity Threads Downloader installed")})),chrome.runtime.onMessage.addListener(((e,o,n)=>{if("downloadMarkdown"===e.action){console.log("Received markdown content for download");const o="data:text/markdown;charset=utf-8,"+encodeURIComponent(e.markdown);return chrome.downloads.download({url:o,filename:e.filename||`perplexity-thread-${(new Date).toISOString().slice(0,10)}.md`,saveAs:!0},(e=>{chrome.runtime.lastError?(console.error("Download error:",chrome.runtime.lastError),n({success:!1,error:chrome.runtime.lastError.message})):(console.log("Download started with ID:",e),n({success:!0,downloadId:e}))})),!0}})),chrome.action.onClicked.addListener((o=>e(void 0,void 0,void 0,(function*(){var e;o.id&&(null===(e=o.url)||void 0===e?void 0:e.includes("perplexity.ai"))&&(yield chrome.scripting.executeScript({target:{tabId:o.id},files:["content.js"]}))}))))}})[643]()})();