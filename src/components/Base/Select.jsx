export default function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = '-- Select --',
    required = false,
    ...props
}) {
    return (
        <div>
            {label && <label className="form-label">{label}</label>}
            <select
                className="form-select"
                value={value}
                onChange={onChange}
                required={required}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option
                        key={typeof option === 'string' ? option : option.value}
                        value={typeof option === 'string' ? option : option.value}
                    >
                        {typeof option === 'string' ? option : option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
