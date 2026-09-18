# Native fixture runtime supplement

After the source-only independent build evaluation, the parent checked the unchanged generated native fixture in real Chrome through CUA. This supplements rather than rewrites the constrained-host receipt.

Fixture: `/private/tmp/sdlc-ui-eval-3ndyxvwr/build`; generated source snapshot remains in its `docs/ui-kit/snapshot.sha256`. Runtime: `python3 -m http.server 8877 --bind 127.0.0.1`, launched with sandbox escalation for localhost binding, then stopped via its owned session. No external data or backend requests.

Observed through actual UI actions and fresh accessibility states:

- `/` rendered signup using shared kit CSS/JS.
- Submit empty email: `Enter your email address.`; focus returned to email.
- Submit `example`: `Enter a valid email address.`.
- Submit synthetic `demo@example.com`: local success explicitly says no account was created or data sent.
- Cancel cleared feedback and reset/refocused the email control.
- At 390×844 the form, focus ring, primary and outlined secondary controls rendered within the viewport; screenshot inspected in tool output.
- `/ui-kit.html` rendered shared foundations, input default/error/disabled states, enabled/disabled primary and secondary buttons, composition, and success example. Mobile screenshot inspected.

No source/kit files changed. Temporary viewport override reset and test tab closed. This is a focused native runtime smoke check, not exhaustive accessibility, hover, desktop, or React verification. The fixture's prior incomplete metadata was not promoted by this read-only check.
