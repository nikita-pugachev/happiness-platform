import "@/assets/styles/global.scss";
import "@/assets/styles/variables.scss";
import "@/assets/fonts/fonts.scss";
import styles from "./App.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={styles.body}>
        {children}
      </body>
    </html>
  );
}
