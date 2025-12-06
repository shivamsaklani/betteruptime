# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Install dependencies using Bun:

```sh
bun install
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages:

```
bun run build
```

### Develop

To develop all apps and packages:

```
bun run dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
Screenshots
<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-56-42" src="https://github.com/user-attachments/assets/0f2e9a45-4553-4c24-ad83-729cc7c0ac0a" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-56-48" src="https://github.com/user-attachments/assets/5e3e87b3-35a3-410a-904b-9cb778ef2880" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-57-04" src="https://github.com/user-attachments/assets/7513318d-8644-43f9-b476-506f58ab92bf" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-57-45" src="https://github.com/user-attachments/assets/c3c2859f-efaf-406e-88dc-671d442695cc" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-58-06" src="https://github.com/user-attachments/assets/5a94821c-52f5-4899-b329-b7e0bc3181dd" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-58-39" src="https://github.com/user-attachments/assets/1fa65eb8-9fca-4949-9b73-2e13f014788b" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-58-47" src="https://github.com/user-attachments/assets/41382419-9411-421b-a26a-2b18da2446e8" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-58-53" src="https://github.com/user-attachments/assets/6c0d4b6f-07d9-4712-a3e0-8663a0aaa1bc" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-59-05" src="https://github.com/user-attachments/assets/a8ca9abe-6aa0-4efd-b2aa-701cac17a2f7" />

<img width="1820" height="925" alt="Screenshot From 2025-12-06 23-59-22" src="https://github.com/user-attachments/assets/be9a1ccf-18cc-4939-90ad-d120ec4211b3" />


