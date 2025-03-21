chrome.runtime.onInstalled.addListener(() => {
  console.log('Perplexity Threads Downloader installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadMarkdown') {
    console.log('Received markdown content for download');
    
    const dataUrl = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(message.markdown);
    
    chrome.downloads.download({
      url: dataUrl,
      filename: message.filename || `perplexity-thread-${new Date().toISOString().slice(0, 10)}.md`,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download error:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Download started with ID:', downloadId);
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