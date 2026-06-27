export function StatusChip({ isOpen, isAvailable }) {
  const open = isOpen !== undefined ? isOpen : isAvailable;
  const label = isAvailable !== undefined
    ? (open ? 'Available' : 'Busy')
    : (open ? 'Open' : 'Closed');

  return (
    <span className={`status-chip ${open ? 'open' : 'closed'}`}>
      <span className={`status-dot ${open ? 'pulse' : 'closed'}`} />
      {label}
    </span>
  );
}
