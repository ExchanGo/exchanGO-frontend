"use client";

import { Button } from "@/components/ui/button";

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-5 border-gray-300"
        onClick={() => console.log("Google sign in")}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M19.275 10.2297C19.275 9.51219 19.2133 8.79469 19.0808 8.10156H10V11.8773H15.2117C14.9633 13.0953 14.2648 14.1422 13.2336 14.8328V17.2422H16.3563C18.1633 15.5906 19.275 13.1422 19.275 10.2297Z"
            fill="#4285F4"
          />
          <path
            d="M10 19.375C12.6523 19.375 14.9055 18.5172 16.3594 17.2422L13.2367 14.8328C12.3492 15.4344 11.2445 15.7812 10 15.7812C7.49375 15.7812 5.3875 14.0781 4.6125 11.775H1.39375V14.2594C2.8375 17.3016 6.14844 19.375 10 19.375Z"
            fill="#34A853"
          />
          <path
            d="M4.6125 11.775C4.1875 10.5188 4.1875 9.1625 4.6125 7.90625V5.42188H1.39375C0.213437 7.875 0.213437 11.8063 1.39375 14.2594L4.6125 11.775Z"
            fill="#FBBC05"
          />
          <path
            d="M10 4.21875C11.3344 4.2 12.625 4.69844 13.6336 5.625L16.3914 2.86719C14.7828 1.36563 12.45 0.543752 10 0.625002C6.14844 0.625002 2.8375 2.69844 1.39375 5.74063L4.6125 8.225C5.3875 5.92188 7.49375 4.21875 10 4.21875Z"
            fill="#EA4335"
          />
        </svg>
        <span>Sign in with Gmail</span>
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-5 border-gray-300"
        onClick={() => console.log("Facebook sign in")}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M19.0938 10.0469C19.0938 5.0625 15.0312 1 10.0469 1C5.0625 1 1 5.0625 1 10.0469C1 14.5312 4.22656 18.2344 8.5 18.9062V12.5H6.25V10.0469H8.5V8.08594C8.5 5.98438 9.75 4.8125 11.6562 4.8125C12.5938 4.8125 13.5 5.03125 13.5 5.03125V7.1875H12.4062C11.3125 7.1875 10.9688 7.875 10.9688 8.58594V10.0469H13.3906L13 12.5H10.9688V18.9062C15.2422 18.2344 19.0938 14.5312 19.0938 10.0469Z"
            fill="#1877F2"
          />
        </svg>
        <span>Sign in with Facebook</span>
      </Button>
    </div>
  );
}
