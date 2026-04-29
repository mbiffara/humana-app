"use client";

export function FormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted"
      >
        {label}
        {required && <span className="text-humana-gold"> *</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors duration-200 placeholder:text-humana-subtle focus:border-humana-gold"
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-b border-humana-line bg-transparent py-3 text-[15px] text-humana-ink outline-none transition-colors duration-200 placeholder:text-humana-subtle focus:border-humana-gold"
        />
      )}
    </div>
  );
}
