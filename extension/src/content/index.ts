import TurndownService from 'turndown';

const SELECTORS = {
  MESSAGE: '.message-container',
  USER_MESSAGE: '.user-message',
  AI_MESSAGE: '.ai-message',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function getPageTitle(): string {
  return document.title;
}

function formatFilename(): string {
  return `${getPageTitle()}`;
}

function extractConversation(): Message[] {
  const messages: Message[] = [];
  
  const messageElements = document.querySelectorAll(
    `${SELECTORS.USER_MESSAGE}, ${SELECTORS.AI_MESSAGE}`
  );
  
  messageElements.forEach((element) => {
    const isUser = element.classList.contains(SELECTORS.USER_MESSAGE.substring(1));
    const content = element.innerHTML;
    
    if (content && content.trim()) {
      messages.push({
        role: isUser ? 'user' : 'assistant',
        content: content
      });
    }
  });
  
  return messages;
}

function convertToMarkdown(messages: Message[]): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });
  
  let markdown = `# ${getPageTitle()}\n\n`;
  
  messages.forEach((message) => {
    const role = message.role === 'user' ? '**User**:' : '**Assistant**:';
    const content = turndownService.turndown(message.content);
    
    markdown += `${role}\n${content}\n\n`;
  });
  
  return markdown;
}

function downloadThread(): void {
  try {
    const messages = extractConversation();
    const markdown = convertToMarkdown(messages);
    
    chrome.runtime.sendMessage({
      action: 'downloadMarkdown',
      markdown: markdown,
      filename: `${formatFilename()}.md`
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.success) {
        console.log('Thread downloaded successfully');
      }
    });
  } catch (error) {
    console.error('Error downloading thread:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractThread') {
    downloadThread();
    sendResponse({ success: true });
  }
  return true;
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  downloadThread();
} else {
  window.addEventListener('DOMContentLoaded', downloadThread);
}