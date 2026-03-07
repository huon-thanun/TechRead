export default function Checkbox({
    label,
    checked,
    onChange,
    ...props
}) {
    return (
        <label
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                cursor: 'pointer'
            }}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ accentColor: '#dc3545' }}
                {...props}
            />
            {label}
        </label>
    );
}
