chrome.runtime.onInstalled.addListener(() => {
  console.log('Thanks for installing perplexity threads downloader');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadMarkdown') {
    const cleanMarkdown = removeDuplicateLines(message.markdown);

    const dataUrl = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(cleanMarkdown);
    
    chrome.downloads.download({
      url: dataUrl,
      filename: message.filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download err:', chrome.runtime.lastError);
        sendResponse({ success: false, err: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });
    
    return true;
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id && tab.url?.includes('perplexity.ai')) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

function removeDuplicateLines(markdown: string): string {
  let lines = markdown.split('\n');
  let unique = [];
  let seen = new Set();

  for (let line of lines) {
    let cleanLine = line.trim().replace(/^\*.*?\*:\s*/, '');
    if (cleanLine && !seen.has(cleanLine)) {
      unique.push(line);
      seen.add(cleanLine);
    }
  }

  return unique.join('\n');
}