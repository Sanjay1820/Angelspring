
# Implementation Plan - Fix Contact Form & Dropdown

I have addressed the issues on `contact.html` regarding dropdown visibility and form submission behavior.

## Changes Made
1.  **Dropdown Visibility**: Added CSS to `contact.html` to force `<option>` elements to have a dark background (`#121212`) and white text (`#ffffff`). This ensures they are readable against the dark theme background.
2.  **Form Reset Logic**: Updated the form submission script to:
    -   Reset the form fields upon successful submission.
    -   Automatically hide the success message and show the form again after 5 seconds.

## Next Steps
- Explain the changes to the user and confirm the expected behavior (5-second reset timer).
