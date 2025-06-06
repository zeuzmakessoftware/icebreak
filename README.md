# Icebreak

A modern, interactive icebreaker application designed to help teams connect and get to know each other better in a fun and engaging way. Built with Next.js, React, and Framer Motion.

## ✨ Features

- **Interactive Question Flow**: Answer fun, thought-provoking questions to break the ice
- **Animated UI**: Beautiful particle animations and smooth transitions powered by Framer Motion
- **Responsive Design**: Works seamlessly on all device sizes
- **Modern Tech Stack**: Built with Next.js 15, React 19, and Tailwind CSS
- **Type-Safe**: Written in TypeScript for better developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/icebreak.git
   cd icebreak
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library for React
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

## 📝 Customization

### Adding New Questions

To add or modify questions, edit the `questions` array in `app/page.tsx`:

```typescript
const questions = [
  "What's your favorite unconventional productivity hack?",
  "If you could work from any fictional location, where would it be?",
  "What's one skill you've picked up since working remotely?",
  // Add more questions here
];
```

### Styling

This project uses Tailwind CSS for styling. You can customize the color scheme and other design tokens in `tailwind.config.js`.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/your-username/icebreak](https://github.com/your-username/icebreak)