[![Academic Project](https://img.shields.io/badge/Project-Academic-blue?style=flat-square)](https://github.com/ardaceki/Sivastayim)
[![Live Site](https://img.shields.io/badge/Live-sivastayim.info-green?style=flat-square)](https://www.sivastayim.info)

> **Note:** This project was developed as an academic assignment and is live at [sivastayim.info](https://www.sivastayim.info).

# Sivastayım

Sivastayım is a multilingual digital city guide platform focused on the cultural, historical, and geographical heritage of Sivas. The application utilizes a modern web stack to provide interactive maps, scrollytelling experiences, and an AI-driven chatbot for real-time user inquiries.
## Features

- **Interactive Maps:** Real-time exploration of 42+ points of interest using Leaflet.
- **Cultural Heritage:** Deep dive into Sivas’s history, from Hittite roots to modern smart city vision.
- **Gastronomy Gallery:** Explore 18 unique Sivas flavors with traditional recipes.
- **Portraits Engine:** 40+ iconic figures of Sivas, categorized by their contribution.
- **AI Integration:** Real-time conversational assistant powered by Llama-3.3 (Groq SDK).
- **Scrollytelling:** Immersive historical storytelling engine.
## Tech Stack

- **Framework:** Next.js v16 (App Router)
- **Library:** React v19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript v5
- **Mapping:** Leaflet & React-Leaflet
- **AI:** Groq SDK (Llama-3.3-70B)
- **Animation:** Framer Motion
## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ardaceki/Sivastayim.git
cd sivastayim
npm install
```
## Environment Variables

To run this project, you will need to add the following environment variable to your .env.local file:

GROQ_API_KEY



## Architecture

The project follows a modular structure focused on feature-based organization:

- `src/app`: Routing, i18n segments, and API routes.
- `src/components`: Global UI (Chatbot, Scrollytelling).
- `src/features`: Domain-specific logic (Map, Heritage, Dishes, Portraits).
- `src/data`: Static JSON datasets.
- `src/dictionaries`: Localization (TR/EN).

## Vibecoding Note

This project was developed as a technical experiment using the **Vibecoding** methodology. Instead of manual, line-by-line coding, the application's architecture, feature logic, and styling were orchestrated through natural language commands and AI-driven development tools.


## License

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0)

