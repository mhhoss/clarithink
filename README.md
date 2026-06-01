# Clarithink

**see your thoughts clearly.**

Clarithink is a minimal tool I built to turn raw thoughts into clearer, more structured versions of themselves — before they get lost, distorted, or forgotten.

🔗 [Live Demo](https://clarithink.netlify.app)

## Where this came from

I have a habit of writing down thoughts throughout the day.

Small notes. Half-formed ideas. Mental noise I didn’t want to lose.

Over time, I realized most of them never became anything useful. Not because they were bad ideas or concepts, but because they stayed in their raw form — unclear, fragmented, and disconnected from what I actually meant.

At some point, I wasn’t struggling with remembering thoughts anymore. I was struggling with understanding them.

Clarithink started from that gap.

## What Clarithink does

Clarithink is designed around a simple idea:

A thought becomes more useful when it is clarified before it is stored.

- You write a raw thought
- An LLM helps separate the signal from the noise
- You get back a clearer interpretation of what you were trying to say
- Along with a question that challenges the underlying assumption

That’s it.

Not an explanation or expansion. Just a cleaner signal of the original thought and a question!

The goal is not to build a system for managing thoughts, but to briefly clarify them at the moment they appear.

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

This project is less about building a tool and more about exploring a simple question:

> What happens when a thought is forced to become clear before it settles into noise?