import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    ...props
}, ref) => {
    return (
        <button 
            type="button" 
            className={twMerge('w-full rounded-full bg-green-400 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition', className)} 
            disabled={disabled} 
            {...props} 
            ref={ref}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
