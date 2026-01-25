import type { Preview } from "@storybook/react-vite";
import { I18nextProvider } from "react-i18next";
import "../src/index.css";
import i18n from "../src/i18n";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "mirror",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "ja",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "ja", title: "日本語" },
      ],
      dynamicTitle: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme ?? "light";
    const root = document.documentElement;
    const locale = context.globals.locale;
    i18n.changeLanguage(locale);
    // Toggle Tailwind v4 dark variant via `.dark` class
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Optional: if you also want to use data-theme for any other CSS logic
    // root.setAttribute("data-theme", theme);
    // Provide a contrasting page background for the canvas
    return (
      <I18nextProvider i18n={i18n}>
        <div className={theme === "dark" ? "bg-ui-bg p-4" : "bg-ui-bg p-4"}>
          <Story />
        </div>
      </I18nextProvider>
    );
  },
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
