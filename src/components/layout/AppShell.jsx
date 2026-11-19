import AppHeader from "./AppHeader.jsx";

export default function AppShell({ children }) {
  return (
    <div className="app">
      <div className="accent-bar" aria-hidden="true" />
      <a className="skip" href="#workspace">
        До перегляду
      </a>
      <div className="shell">
        <AppHeader />
        <main>{children}</main>
        <footer className="colophon">
          <p>Створено студентом спеціальносі «Інженерія програмного забезпечення» — Марчуком Іллею</p>
        </footer>
      </div>
    </div>
  );
}
