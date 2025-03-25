import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/popup.css';

const Popup: React.FC = () => {
  const [isPerplexityPage, setIsPerplexityPage] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if current tab is a Perplexity
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url && currentTab.url.includes('perplexity.ai')) {
        setIsPerplexityPage(true);
      }
    });
  }, []);

  const handleDownload = () => {
    setIsLoading(true);
    setStatus('Extracting thread...');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'extractThread' }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script might not be loaded yet so inject it
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              files: ['content.js']
            }).then(() => {
              // send msg again after injecting script
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id!, { action: 'extractThread' }, (resp) => {
                  handleResponse(resp);
                });
              }, 500);
            }).catch(err => {
              setStatus(`Error: ${err.message}`);
              setIsLoading(false);
            });
          } else {
            handleResponse(response);
          }
        });
      }
    });
  };

  const handleResponse = (response: any) => {
    if (response && response.success) {
      setStatus('Thread downloaded successfully!');
    } else {
      setStatus('Error downloading thread. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="popup-container">
      <header>
        <h1>Perplexity Threads Downloader</h1>
      </header>
      
      <main>
        {isPerplexityPage ? (
          <>
            <p>Download your Perplexity conversation as a Markdown file.</p>
            <button 
              className="download-btn" 
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Download Thread'}
            </button>
            
            {status && <p className="status-message">{status}</p>}
          </>
        ) : (
          <p className="warning">Please go to a Perplexity thread to use this extension.</p>
        )}
      </main>
      
      <footer>
        <p>Thanks For using my chrome extension</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);