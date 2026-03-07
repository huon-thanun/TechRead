export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    minLength,
    accept,
    ...props
}) {
    return (
        <div>
            {label && <label className="form-label">{label}</label>}
            <input
                type={type}
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                accept={accept}
                {...props}
            />
        </div>
    );
}
