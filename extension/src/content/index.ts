import TurndownService from 'turndown';

const SELECTORS = {
  MESSAGE_CONTAINER: 'main .mx-auto > div > div > div > div > div > div > div > div',
  USER_MESSAGE: '.break-words',
  AI_MESSAGE: '.relative.default > div > div',
  PAGE_TITLE: 'h1',
};

interface Message {
  type: 'user' | 'ai';
  content: string;
}

function getPageTitle(): string {
  return document.title;
}

function extractConversation(): Message[] {
  const messages: Message[] = [];
  const messageContainers = document.querySelectorAll(SELECTORS.MESSAGE_CONTAINER);
  
  messageContainers.forEach((container) => {
    const userMessageElement = container.querySelector(SELECTORS.USER_MESSAGE);
    const aiMessageElement = container.querySelector(SELECTORS.AI_MESSAGE);

    if (userMessageElement) {
      messages.push({ 
        type: 'user', 
        content: userMessageElement.innerHTML.trim() 
      });
    }

    if (aiMessageElement) {
      messages.push({ 
        type: 'ai', 
        content: aiMessageElement.innerHTML.trim() 
      });
    }
  });

  return messages;
}

function convertToMarkdown(messages: Message[]): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  let markdown = `# ${getPageTitle()}\n\n`;
  
  messages.forEach((message) => {
    const content = turndownService.turndown(message.content);
    markdown += `*${message.type === 'user' ? 'User' : 'AI'}*: ${content}\n`;
  });

  return markdown;
}

function downloadThread(): void {
  try {
    const messages = extractConversation();
    const markdown = convertToMarkdown(messages);
    
    chrome.runtime.sendMessage(
      {
        action: 'downloadMarkdown',
        markdown: markdown,
        filename: `${getPageTitle()}.md`,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          return;
        }
        
        if (response && response.success) {
          console.log('Thread downloaded successfully');
        }
      }
    );
  } catch (err) {
    console.error('Error downloading thread:', err);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractThread') {
    downloadThread();
    sendResponse({ success: true });
  }
  return true;
});