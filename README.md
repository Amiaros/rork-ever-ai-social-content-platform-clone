# Rork EverAI Social Content Platform

Welcome to **Rork EverAI Social Content Platform**, an innovative mobile application designed to revolutionize content creation for social media using AI. This app allows users to generate, analyze, and publish content across multiple social platforms with ease. Built with React Native and Expo, it supports cross-platform usage on iOS, Android, and Web.

Developed by **EverAi Amir Gharegozlou**.

## Overview

Rork EverAI is a powerful tool for content creators, marketers, and social media enthusiasts. Leveraging AI technology, it helps users create tailored content for various social media platforms, track analytics, and manage their online presence efficiently. With a sleek and modern UI inspired by leading apps like iOS, Instagram, and Airbnb, the app ensures a delightful user experience across different devices.

## Features

- **Dashboard**: Get an overview of your content performance and account status.
- **Content Creation**: Generate AI-powered content for selected social media platforms with customizable options.
- **Analytics**: Dive into detailed insights and performance metrics for your published content.
- **Settings**: Personalize your app experience, manage account details, and configure preferences.
- **Multi-Platform Support**: Choose from a variety of social media platforms to tailor your content.
- **Responsive Design**: Enjoy a seamless experience on mobile phones, tablets, and web browsers.
- **Multi-Language Support**: Available in English, German, French, Spanish, and Portuguese.
- **Interactive UI**: Features floating buttons, scrollable selectors, and dynamic input fields for a modern feel.

## Installation

To get started with Rork EverAI Social Content Platform, follow these steps:

### Prerequisites

- Node.js (version 16 or higher)
- Bun (for package management)
- Expo CLI (for development and testing)

### Steps

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd rork-ever-ai-social-content-platform
   ```

2. **Install Dependencies**:
   Use Bun to install the required packages:
   ```bash
   bun install
   ```

3. **Start the Development Server**:
   Run the app using Expo:
   ```bash
   bun start
   ```
   This will launch the app in development mode. You can view it on an emulator or physical device using the Expo Go app, or in a web browser.

4. **Backend Setup**:
   The app includes a Node.js backend with Hono and tRPC for API services. Ensure the backend server is running:
   - Navigate to the `backend` directory (if separate) or ensure it's integrated into the start script.
   - The API will be available at `{baseUrl}/api/trpc/`.

### Running on Different Platforms

- **iOS/Android**: Use Expo Go app or simulators (requires additional setup for simulators).
- **Web**: Open your browser and navigate to the URL provided by the Expo development server.

## Usage

1. **Login**: Sign in using your credentials or connect via supported authentication methods.
2. **Dashboard**: View your content summary and recent activities.
3. **Create Content**: Navigate to the "Create" tab, select social media platforms, and generate AI-powered content. Use the dynamic input box to customize your content.
4. **Analytics**: Check the "Analytics" tab for performance charts and insights.
5. **Settings**: Adjust app settings, edit your profile, or change language preferences.
6. **Publishing**: After generating content, preview it in a dedicated screen where you can publish, download, or copy the text.

## Project Structure

Here's a brief overview of the key directories and files:

- `app/`: Contains the main application routes and screens using Expo Router.
- `components/`: Reusable UI components like buttons, cards, and selectors.
- `backend/`: Node.js server with Hono and tRPC for API endpoints, including AI content generation.
- `constants/`: Static data like colors, social platforms, and language options.
- `store/`: State management using Zustand for user data, themes, and content.
- `i18n/`: Internationalization files for multi-language support.
- `services/`: Utility services like AI content generation.

## Contributing

Contributions are welcome! If you'd like to contribute to the development of Rork EverAI Social Content Platform, please follow these steps:

1. Fork the repository (if applicable).
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Submit a pull request for review.

## License

This project is licensed under the MIT License - see the LICENSE file for details (if applicable).

## Credits

Developed by **EverAi Amir Gharegozlou**. For inquiries or support, please contact via the provided channels in the app or repository.

---

Thank you for using Rork EverAI Social Content Platform! We hope this tool enhances your social media content creation experience.
# EverAi