import { cn } from "@/lib/utils";

type NavIconProps = {
  className?: string;
};

export function NavSearchIcon({ className }: NavIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("h-[18px] w-[18px]", className)}
    >
      <circle
        cx="9"
        cy="9"
        r="4.75"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        d="m12.5 12.5 3.25 3.25"
      />
    </svg>
  );
}

export function NavUserIcon({ className }: NavIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("h-[18px] w-[18px]", className)}
    >
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        d="M4.5 16.5c.9-2.8 3.1-4.5 5.5-4.5s4.6 1.7 5.5 4.5"
      />
    </svg>
  );
}

/** Shopping bag icon — desktop cart asset */
export function NavCartIcon({ className }: NavIconProps) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("h-[18px] w-[18px]", className)}
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
        d="M5.25 7.25h9.5v9a1.75 1.75 0 0 1-1.75 1.75h-6a1.75 1.75 0 0 1-1.75-1.75v-9Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        d="M7.25 7.25V6a2.75 2.75 0 0 1 5.5 0v1.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
        d="M5.25 7.25h9.5"
      />
    </svg>
  );
}
