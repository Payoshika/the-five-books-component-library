import { twMerge } from "tailwind-merge";

interface ErrorMessageProps {
  message?: string;
  id?: string;
  className?: string;
}

const ErrorMessage = ({ message, id, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={twMerge("text-xs text-ui-danger leading-5", className)}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
