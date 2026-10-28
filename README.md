# Yaad

Yaad is a deadline and opportunity tracker for scholarships, admissions, jobs, grants, and other recurring programmes. It includes a feed, a deadline calendar/list view, an application tracker, saved opportunities, and predicted upcoming cycles.

**Live site:** https://saad-imam.github.io/yaad-app/

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

```bash
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Project structure

- `src/pages/` — route-level screens (feed, calendar, applications, saved, settings)
- `src/components/` — shared UI, including the deadline list, cycle list, and calendar
- `src/data.ts` — opportunity, tracked application, and upcoming-cycle data
- `src/lib/calendar.ts` — deadline parsing and date helpers
- `src/context/` — saved opportunities and theme state

## Contributing

Everyone is welcome to open issues and pull requests.

1. Fork the repository.
2. Create a branch: `git checkout -b my-change`
3. Make your change and run `npm run build` to verify it compiles.
4. Commit, push to your fork, and open a pull request against `main`.

Keep pull requests focused, and describe the user-facing change you made.

## Deployment

Every push to `main` builds the app and deploys it to GitHub Pages through `.github/workflows/deploy.yml`. Pull requests are not deployed.

## License

No license has been added yet. If you plan to reuse this project, open an issue to discuss licensing.
