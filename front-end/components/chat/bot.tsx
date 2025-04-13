'use client'; // Only needed for Next.js 13+ app directory

import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase?: any;
  }
}

const ChatbaseEmbed = () => {
  useEffect(() => {
    if (
      !window.chatbase ||
      typeof window.chatbase !== 'function'
    ) {
      const chatbaseFn = (...args: any[]) => {
        if (!chatbaseFn.q) {
          chatbaseFn.q = [];
        }
        chatbaseFn.q.push(args);
      };

      chatbaseFn.q = [];
      window.chatbase = new Proxy(chatbaseFn, {
        get(target, prop) {
          if (prop === 'q') {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'd93RlAiQZIiEsPlu42GV_';
      (script as any).domain = 'www.chatbase.co'; // if required
      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
  }, []);

  return null;
};

export default ChatbaseEmbed;