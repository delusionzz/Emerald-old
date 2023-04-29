# Emerald Proxy

## Instalation

- Clone repo

```bash
git clone https://github.com/delusionzz/Emerald
```

- cd and install dependencies

```bash
cd Emerald && npm i
```

# Not using a reverse proxy for bare ?

- Uncomment the following line in the `next.config.mjs` file

```js
// async rewrites() {
//   return [
//     {
//       source: '/bare/',
//       destination: 'https://tomp.app/',
//     },
//   ]
// },
```

- either keep or replace the destination with your bare server

- Build and Start proxy

```bash
npm run build && npm run start
```
