import TurndownService from 'turndown';

const SELECTORS = {
  MESSAGE_CONTAINER: 'main .mx-auto > div > div > div > div > div  > div  > div  > div',
  USER_MESSAGE: '.break-words',
  AI_MESSAGE: '.relative.default > div > div',
  PAGE_TITLE: 'h1',
};

interface Message {
  content: string;
}

function getPageTitle(): string {
  const titleElement = document.title;
  return titleElement;
}

function formatFilename(): string {
  return `${getPageTitle()}`;
}

function extractConversation(): Message[] {
  const messages: Message[] = [];
  const messageContainers = document.querySelectorAll(SELECTORS.MESSAGE_CONTAINER);

  messageContainers.forEach((container) => {
    const userMessageElement = container.querySelector(SELECTORS.USER_MESSAGE);
    const aiMessageElement = container.querySelector(SELECTORS.AI_MESSAGE);
    let content = '';

    if (userMessageElement) {
      content = userMessageElement.innerHTML.trim();
    } else if (aiMessageElement) {
      content = aiMessageElement.innerHTML.trim();
    }

    if (content) {
      messages.push({ content });
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
    markdown += `${content}\n\n`;
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
        filename: `${formatFilename()}.md`,
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

const checkAndRun = () => {
  if (document.querySelector(SELECTORS.MESSAGE_CONTAINER)) {
    downloadThread();
  } else {
    setTimeout(checkAndRun, 500);
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  checkAndRun();
} else {
  window.addEventListener('DOMContentLoaded', checkAndRun);
}
