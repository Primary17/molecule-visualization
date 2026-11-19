const STATUS = {
  idle: "Очікування",
  loading: "Зчитування",
  valid: "Дані коректні",
  invalid: "Є зауваження",
};

export default function ValidationReport({ validation = null, busy = false }) {
  const status = busy ? "loading" : (validation?.status ?? "idle");
  const issues = validation?.issues ?? [];

  return (
    <section className="panel panel--validation" aria-labelledby="validation-title">
      <div className="panel__heading">
        <h2 id="validation-title" className="section-title">
          Перевірка
        </h2>
        <p className={`status status--${status}`}>{STATUS[status] ?? STATUS.idle}</p>
      </div>
      {status === "invalid" ? (
        <ul className="issues">
          {issues.map((issue, index) => (
            <li key={`${issue.code}-${issue.path}-${index}`}>
              <span>{issue.message}</span>
              {issue.path ? <code>{issue.path}</code> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="panel__note">{noteFor(status)}</p>
      )}
    </section>
  );
}

function noteFor(status) {
  if (status === "loading") return "Перевірка структури ще триває.";
  if (status === "valid") return "Поля, ідентифікатори, координати й посилання зв’язків узгоджені.";
  return "Після зчитування тут з’являться синтаксис JSON, посилання зв’язків і координати.";
}
