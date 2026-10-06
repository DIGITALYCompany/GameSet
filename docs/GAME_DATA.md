# Game pages and external player references

The game hubs use GameSet's own UI, local game artwork and calculation functions.
They include a manually entered reference setup, DPI matching, cm/360 comparison,
links into the tools, and links to save a setup through the account flow.

## ProSettings

The implementation links to public game/player pages. It does not scrape their
API, import their database, cache their player photographs or reproduce their
articles. Their legal notice requires prior written consent for reproduction of
information/data: https://prosettings.net/legal-notice/

Game/player reference links were reviewed on 2026-10-06. Settings on those pages
can change. Existing unsourced pro presets have been removed from the app's game
configuration rather than presented as current professional settings.

A future data integration should use an agreed API, feed or licensed export.
Store the source URL, source update date, fetch date, game/version, sensitivity
units and input method with each record. Controller settings must not be mixed
with mouse DPI records. Validate and cache the feed on the server, not by scraping
pages in the browser. The Supabase connection remains deferred at the user's request.

The comparison lab starts with GameSet example values. It matches physical mouse
travel within the selected game using `reference DPI × reference sensitivity /
your DPI`. Invalid inputs and results outside the configured game sensitivity
scale cannot be sent to the setup or calibration flow.
