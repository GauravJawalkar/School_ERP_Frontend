
import { AnyFieldApi } from "@tanstack/react-form"
import { RequiredBadge } from "../Commons/RequiredBadge";

interface TextFieldProps {
    field: AnyFieldApi;
    label: string;
    type?: string;
    placeholder?: string;
    required: boolean;
    readOnly?: boolean
}

const FormInput = ({ field, label, type = 'text', placeholder, required, readOnly = false }: TextFieldProps) => {
    return (
        <div className="flex flex-col w-full gap-1">
            <label className="text-sm">{label} {required && <RequiredBadge />} </label>
            <input
                type={type}
                name="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 ${readOnly ? 'cursor-not-allowed' : ''}`} />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">
                    {field.state.meta.errors[0]?.message}
                </p>
            )}
        </div>
    )
}

export default FormInput