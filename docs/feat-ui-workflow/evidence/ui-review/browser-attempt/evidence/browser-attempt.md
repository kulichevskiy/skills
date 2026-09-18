# Runtime and browser evidence

- Command: `npm start` → `python3 -m http.server 8769 --bind 127.0.0.1`.
- Initial tool call yielded a running session; later polling showed exit 1 with `PermissionError: [Errno 1] Operation not permitted` in `socket.bind`. Server did not start successfully.
- Selected Chrome extension browser ID 1 through CUA, session “🔎 Account kit review”. Read viewport capability documentation but did not set an override.
- Attempted Account navigation: `Browser Use cannot open http://127.0.0.1:8769 in tab 132379807. Browser reported: net::ERR_BLOCKED_BY_CLIENT`.
- Read documented troubleshooting and local development guidance; neither supplied an applicable repair. No settings changed.
- A supplemental Python HTTP fetch to the same local URL also failed with `URLError: <urlopen error [Errno 1] Operation not permitted>`. It established no served-content evidence.
- No rendering, screenshot, computed style, or viewport verification was obtained. Browser navigation and runtime failed independently under the host restrictions. No dependency installation or configuration change was attempted.

A later scoped escalation retried `npm start` to overcome the sandbox-only bind restriction. That attempt exited 1 with `OSError: [Errno 48] Address already in use`. A read-only `lsof -nP -iTCP:8769 -sTCP:LISTEN` identified an existing `Okta\x20V` process (PID 903, user ak) on 127.0.0.1:8769. This unrelated listener was not stopped, reconfigured, or used for review. The fixture's prescribed port was unavailable, and no alternate port/configuration was used. No automatic-approval rejection occurred; execution reached the port collision.

## Successful runtime recovery

After authorization to use an alternate local port, ran `python3 -m http.server 8876 --bind 127.0.0.1` from the unchanged fixture. Chrome opened Account successfully on 8876. CUA viewport override verified 390×844 and 1280×800. Account AX tree showed heading Account, buttons Save/Cancel, support text. The real showcase AX tree showed heading Kit and button Primary action.

Read-only DOM/computed-style observations at both widths:

- Account Save background `rgb(193, 21, 116)`; Cancel `rgb(21, 94, 239)`.
- Showcase Primary action background `rgb(21, 94, 239)`.
- Account Save rect x=24, y=83.4375, width=66.9609375, height=43. Cancel x=106.9609375, y=83.4375, width=81.8828125, height=43. Gap=16px; flex-wrap=wrap.
- Showcase button rect x=24, y=83.4375, width=136.4375, height=43.
- documentElement.scrollWidth equaled innerWidth (390 / 1280) on both pages.
- Screenshots saved: account-390.png, account-1280.png, showcase-390.png, showcase-1280.png. Visual inspection confirmed the color deviation and valid horizontal layout.
- Temporary viewport override reset after capture. No source, kit, baseline or acceptance-state change was needed.
