type Props = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, htmlFor, error, hint, required, children }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
        {required && <span style={{ color: "var(--error)" }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
}
