## Bam.iobio
[bam.iobio](https://www.nature.com/articles/nmeth.3174) was developed by the Marth lab, is free for academic use, and distributed under the MIT license. For further information, or commercial usage, please contact iobioproject@gmail.com.

## bam.iobio is for **HUMAN** genomes only

# Starting App

Using node version 24.x

```
npm install
npm run watch
```

Open a new terminal
```
npm run serve
```

Now open [http://localhost:4027](http://localhost:4027).

# Runtime config and path hosting

The app loads `./config.json` at runtime. The checked-in `client/config.json` is the local/dev default; replace it for a deployment to change paths/origins without rebuilding. For example, to serve bam at `/bam/` and GRU at `/gru` on the same origin:

```json
{
  "origin": "https://apps.iobio.io",
  "bam": { "path": "/bam/" },
  "backend": { "path": "/gru" }
}
```

When serving from a subpath, configure the static server to serve `index.html` for app routes under that subpath, and prefer canonical URLs with a trailing app slash (for example `/bam/`, `/bam/help`).
