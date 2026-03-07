export default function Textarea({
    label,
    placeholder,
    value,
    onChange,
    rows = 4,
    required = false,
    ...props
}) {
    return (
        <div>
            {label && <label className="form-label">{label}</label>}
            <textarea
                className="form-control"
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                style={{ resize: 'vertical', ...props.style }}
                {...props}
            />
        </div>
    );
}
