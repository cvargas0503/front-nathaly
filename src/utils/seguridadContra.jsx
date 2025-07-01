export const PasswordRequirements = ({ password }) => (
    <ul className="text-xs mt-2 space-y-1">
        <li className={password.length >= 8 ? "text-green-600" : "text-red-500"}>
            • Al menos 8 caracteres
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>
            • Una letra mayúscula
        </li>
        <li className={/[a-z]/.test(password) ? "text-green-600" : "text-red-500"}>
            • Una letra minúscula
        </li>
        <li className={/\d/.test(password) ? "text-green-600" : "text-red-500"}>
            • Un número
        </li>
        <li
            className={
                /[!@#$%^&*]/.test(password) ? "text-green-600" : "text-red-500"
            }
        >
            • Un carácter especial (!@#$%^&*)
        </li>
    </ul>
);
export const validarPassword = (password) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return (
        password.length >= minLength &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial
    );
};