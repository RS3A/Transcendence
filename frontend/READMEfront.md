Perfeito.
Abaixo está a versão **mais didática**, clara e **em inglês**, pronta para ser usada no `README.md`.
O tom é profissional, mas acessível — adequado tanto para avaliadores quanto para novos contribuidores.

---

## 🛠 Development Environment

This project uses a modern front-end development environment focused on performance, scalability, and accessibility.

---

### Requirements

Before running the project, make sure you have the following installed:

* **Node.js**: `v20.19.x` or higher
* **npm**: `v10.x` or higher

Supported operating systems:

* Linux (recommended)
* macOS
* Windows (via WSL recommended)

> ⚠️ Node.js versions below 20 are **not supported** due to Vite requirements.

---

### Front-end Stack

* **Framework**: React
* **Language**: TypeScript
* **Build Tool**: Vite `v7.3.1`
* **Compiler**: SWC

This setup provides fast builds, strong typing, and an excellent developer experience.

---

### Project Initialization

The project was initialized using **Vite**:

```bash
npm create vite@latest transcendence
```

Selected options:

* Framework: React
* Variant: TypeScript + SWC
* Rolldown-vite: No (experimental)

---

### Installation

Install project dependencies:

```bash
npm install
```

---

### Running the Development Server

Start the development server with:

```bash
npm run dev
```

Once running, the application will be available at:

```
http://localhost:5173/
```

---

### Important Notes

* If you are using **Linux or WSL**, make sure the correct Node version is active:

  ```bash
  nvm use 20
  ```
* This project does **not** support Node.js 18 or earlier.
* TypeScript is used to improve code safety, readability, and long-term maintainability.

---

### Project Structure Philosophy

The front-end follows the **App Shell** architecture pattern, with a clear separation of concerns between layout, components, and pages.

Key principles:

* Responsive design (mobile and desktop)
* Accessibility-first approach
* Clean, predictable, and scalable codebase
