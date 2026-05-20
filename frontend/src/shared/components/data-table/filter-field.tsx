interface FilterFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function FilterField({ id, label, children }: FilterFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
