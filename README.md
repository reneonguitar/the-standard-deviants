# The Standard Deviants

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## NuxtHub Deployments

https://hub.nuxt.com/docs/getting-started/deploy

To deploy the current branch which will be deployed to the preview environment if the branch is not `main`, and the production environment if so.

```
npx nuxthub deploy
```

Add the `--preview` or `--production` flag to deploy to the preview or production environment respectively.

```
npx nuxthub deploy --preview
npx nuxthub deploy --production
```

## NuxtHub Logs

https://hub.nuxt.com/docs/getting-started/server-logs

View the server logs in the NuxtHub dashboard or via the CLI:

```
npx nuxthub logs
```

Add the `--preview` or `--production` flag to view logs for the preview or production environment respectively.

```
npx nuxthub logs --preview
npx nuxthub logs --production
```
