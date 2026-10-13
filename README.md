# DataCamp Events

Custom TypeScript and CSS for the DataCamp events Webflow site.

The bundle is built with [esbuild](https://esbuild.github.io/) and loaded as custom code in Webflow. This repository is based on the [Finsweet Developer Starter](https://github.com/finsweet/developer-starter), adapted to this project.

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
- [GSAP](https://gsap.com/) — scroll-triggered reveals
- [Swiper](https://swiperjs.com/) — carousels
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- [Playwright](https://playwright.dev/) — end-to-end tests
- [Changesets](https://github.com/changesets/changesets) — versioning and changelog

## Requirements

This project uses [pnpm](https://pnpm.io/) (`>= 10`).

```bash
npm i -g pnpm
```

## Getting started

```bash
pnpm install
```

If you need Playwright locally:

```bash
pnpm playwright install
```

Recommended editor extensions:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Development

```bash
pnpm dev
```

This starts esbuild in watch mode and serves the bundle at `http://localhost:3000`. In Webflow custom code, point to the local files:

```html
<script defer src="http://localhost:3000/index.js"></script>
<link href="http://localhost:3000/index.css" rel="stylesheet" type="text/css" />
```

Live reload is enabled by default. Disable it in `bin/build.js` if needed.

### Production build

```bash
pnpm build
```

Output lands in `dist/`.

### Deployment

The bundle is hosted on [Netlify](https://www.netlify.com/). The Netlify site is linked to this repository and configured by [`netlify.toml`](./netlify.toml): it runs `pnpm build` and publishes `dist/`.

- Every push to `master` triggers a production deploy.
- Pull requests get a deploy preview URL, handy to test a change on the Webflow staging site before merging.

In Webflow custom code, load the files from the Netlify site URL:

```html
<script defer src="https://<site-name>.netlify.app/index.js"></script>
<link href="https://<site-name>.netlify.app/index.css" rel="stylesheet" type="text/css" />
```

Netlify serves these files with revalidation on each request, so a deploy is live immediately — no CDN cache to purge and no version to bump in the URL.

## Architecture

`src/index.ts` is orchestration only. Domain logic lives under `src/scripts/` and is exposed through `--index-*` facades.

| Folder | Role |
| --- | --- |
| `src/scripts/session/` | Client session and environment |
| `src/scripts/ui/` | UI behavior (modals, dropdowns, sliders, conditional display) |
| `src/scripts/forms/` | Form lifecycle and Marketo |
| `src/scripts/validation/` | Field validation |
| `src/scripts/animations/` | GSAP reveals |
| `src/scripts/config/` | Shared constants |

Conventions are documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

### Animations

Declarative reveals use `data-dc-animate` on Webflow elements:

| Value | Behavior |
| --- | --- |
| `slide-up` | Translate up and fade in |
| `fade-in` | Fade in |
| `scale-up` | Scale up |
| `children-slide-up` | Stagger direct children |

Prefix with `d-` for desktop only (`min-width: 992px`), for example `d-slide-up`. Shared timing lives in `src/scripts/animations/config/animationKeys.ts`.

Anti-FOUC CSS for these attributes is in `src/style/animations/animations.css`. Copy those rules into Webflow `<head>` custom code so elements do not flash before the bundle loads.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Watch build + local server on port 3000 |
| `pnpm build` | Production build to `dist/` |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm check` | TypeScript (`tsc --noEmit`) |
| `pnpm format` | Format `src/` with Prettier |
| `pnpm test` | Playwright tests |
| `pnpm test:ui` | Playwright UI mode |
| `pnpm update` | Interactive dependency updates |

## Tests

Tests live in `tests/`. Playwright starts `pnpm dev` automatically so files are served on `localhost:3000`.

## Contributing

1. Create a branch for the change.
2. Add a [Changeset](https://github.com/changesets/changesets) that explains the change:

   ```bash
   pnpm changeset
   ```

3. Open a pull request. CI runs lint, typecheck, build, and tests.
4. After merge, a Changeset PR updates `CHANGELOG.md` and the package version. Merge that PR as well.

Merging into `master` deploys to production through Netlify (see [Deployment](#deployment)). Version tags (`v*`) only create a GitHub Release for the changelog.

## License

ISC
