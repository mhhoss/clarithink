# Clarithink

**see your thought clearly**

Clarithink helps you write a raw thought and understand what you actually mean — not store it, not expand it, just clarify it.

## Why Clarithink exists

Throughout the day, thoughts hit me fast. I jot them down quickly — phone notes, random apps, wherever. But over time, they pile up disconnected. No thread. No clarity. And then my overthinking kicks in, trying to make sense of it all, which only makes it worse.

I wasn't missing a place to store thoughts. I was missing a way to understand them.

That's why I built the smallest possible version of that.

## What it does

- Write a raw thought
- Ask AI: "What am I really saying? What's the noise, what's the signal?"
- Keep what matters. Delete what doesn't.

## Tech

- React + Vite
- OpenRouter API (LLM)
- localStorage

## Run locally

```bash
git clone https://github.com/yourusername/clarithink
cd clarithink
npm install
npm run dev
```

Add your OpenRouter API key to `.env`:
```
VITE_OPENROUTER_API_KEY=your_key_here
```