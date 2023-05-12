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

# Using a reverse proxy for bare ?

- comment the following line in the `next.config.mjs` file

```js
    async rewrites() {
        return [
            {
                source: '/bare/',
                destination: 'https://tomp.app/',
            },
            {
                source: '/bare/:path*',
                destination: 'https://tomp.app/:path*/',
            },
        ]
    },
```

- either keep or replace the destination with your bare server

- Build and Start proxy

```bash
npm run build && npm run start
```

## Using Docker?

- Clone repo

```bash
git clone https://github.com/delusionzz/Emerald
```

- Build image

```bash
    docker build . -t illusions/emerald
```

- Run image on port 3000

```bash
    docker run -p 3000:3000 -d illusions/emerald
```
