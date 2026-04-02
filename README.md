# BirthdayWebsite

A personalized birthday microsite made for a close friend. It combines a heartfelt message with interactive sections, hidden content, memory cards, and a music embed to create a small web experience instead of a plain static greeting.

Live demo: [sebastianfiser.github.io/BirthdayWebsite](https://sebastianfiser.github.io/BirthdayWebsite)

## What it does

- Shows a custom birthday introduction and final message.
- Displays two live counters:
	- time since birth
	- time since we first met
- Unlocks a secret vault with a passphrase.
- Reveals a small hidden story once the vault is opened.
- Presents a horizontal memories section with images and captions.
- Loads an embedded Spotify playlist on demand.
- Uses scroll-based page transitions and reveal animations for a more polished feel.
- Respects reduced-motion preferences for accessibility.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Editor

- Visual Studio Code

## Tools and APIs

- GitHub Pages for hosting
- IntersectionObserver for reveal and section tracking
- prefers-reduced-motion for motion-aware behavior
- Spotify embed iframe for the music section
- Native browser scrolling and animation APIs

## Project Structure

- index.html - page structure and content
- style.css - visual design, layout, and animations
- script.js - counters, secret vault, music toggle, and scroll interaction
- assets/ - images used in the memories section

## Run Locally

1. Open the BirthdayWebsite folder in your editor.
2. Open index.html in a browser, or use a local server extension in Visual Studio Code.

## Notes

- This is a static front-end project with no build step.
- The content is intentionally personal and written in Czech inside the page UI.
