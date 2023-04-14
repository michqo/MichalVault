# MichalVault 🔒

Quick way to upload/download files from multiple devices

## Libraries used

- SvelteKit
- AWS S3
- 🧙‍♀️tRPC

## Developing

### Set enviromental variables

```bash
cp .env.example .env
```

Fill with your aws s3 crendentials

### Running dev server

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
