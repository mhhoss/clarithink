# Clarithink

**see your thoughts clearly.**

*"It doesn't add new light. It just clears the lens."*

Clarithink is a minimal tool I built to turn raw thoughts into clearer, more structured versions of themselves — before they get lost, distorted, or forgotten.

🔗 [Try it with a thought now!](https://clarithink-live.netlify.app)

## Where this came from

I write down thoughts throughout the day.

Small notes. Half-formed ideas. Mental noise I didn’t want to lose.

Over time, I realized most of them never became anything useful. Not because they were bad ideas, but because they stayed in their raw form — unclear, fragmented, and disconnected from what I actually meant.

Eventually, it wasn’t remembering thoughts that was hard. It was understanding them.

Clarithink started from that gap.

## How it works

A thought becomes more useful when clarified before it is stored.

- You write a raw thought
- An LLM extracts clarity without changing the meaning
- You get a clearer version of the original thought
- Plus a question that challenges its underlying assumption

No explanation, no expansion. Just a cleaner signal and a question.

The goal is not to manage thoughts, but to clarify them at the moment they appear.

## What it isn't

Clarithink is not a note-taking app, a second brain, or a knowledge management system.

Its purpose is not to collect thoughts, but to clarify them.

## Tech

- React + Vite
- OpenRouter API (LLM)
- localStorage (light persistence)

## Run locally

```bash
git clone https://github.com/mhhoss/clarithink
cd clarithink
npm install
npm run dev
```

Add your OpenRouter API key to `.env`:
```
VITE_OPENROUTER_API_KEY=your_key_here
```

## Note

Clarithink is an experiment:

> What happens when a thought is clarified before it becomes noise?