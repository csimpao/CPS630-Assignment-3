interface StatusBadgeProps {
  label: string;
  variant: 'live' | 'history' | 'concluded';
}

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${variant}`}>
      {label}
    </span>
  );
}
