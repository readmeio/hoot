## TODO:

- [ ] Is this the best way to organize the code?
- [ ] Make sure the OpenAPI Spec is accurate (right now the `replyTo` field in the ref object is a little confusing)
- [ ] Add more helpful comments throughout code, write README.md (meta)
  - [ ] It'd be cool to add a better error page if the ReadMe API Key is invalid/missing
- [ ] Update packages, explore ways to avoid those `npm install` warnings
- [ ] Figure out ways to take advantage of these game changers:
  - [Populate env in remix](https://glitch.com/help/populate-env/)
  - [Add remix button to GitHub repo](https://glitch.com/~github-import)
- [ ] Export this back to a branch on the GitHub repo? See if there's a way to sync?
  - [ ] Circle back with Greg/Dom about this, figure out licensing stuff
- [x] Find a way to pass in the API Spec ID in a way that it can handle null values _(edit: I did it! but it doesn't read updates from the .env as quickly as I'd like)_
- [x] Figure out why the URLs are broken in logs: _(edit: it's because of the `x-forwarded-proto` header_
  - [API Metrics Dashboard](https://dash.readme.io/project/kanad-glitch-test/v1.0/metrics/overview)
  - [Hub Logs List](https://kanad-glitch-test.readme.io//reference?auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImthbmFyZiIsIm5hbWUiOiJrYW5hcmYiLCJhcGlLZXkiOiJrYW5hcmYiLCJiYXNpY0F1dGgiOnsidXNlciI6ImthbmFyZiIsInBhc3MiOiIifSwiaWF0IjoxNTgyMjIyMjk4fQ.qyl5jdlhgTxpBKCN2496cXISaXH7KD1uDB_-CxmprmA)
- [x] Figure out how to get logs to show up in the docs 🤔 _(edit: [PR here](https://github.com/readmeio/readme/pull/2299))_
