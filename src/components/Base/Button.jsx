export default function Button({
    children,
    variant = 'danger',
    type = 'button',
    onClick,
    disabled = false,
    fullWidth = false,
    icon,
    ...props
}) {
    const baseClass = variant === 'outline'
        ? 'btn btn-outline-danger'
        : `btn btn-${variant}`;

    const style = {
        borderRadius: '8px',
        ...(fullWidth && { width: '100%', padding: '0.75rem' }),
        ...props.style,
    };

    return (
        <button
            type={type}
            className={baseClass}
            onClick={onClick}
            disabled={disabled}
            style={style}
            {...props}
        >
            {icon && <i className={`${icon} me-2`}></i>}
            {children}
        </button>
    );
}
