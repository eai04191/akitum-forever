# akitum-forever

Redistribution of data stored by this software is prohibited.

## usage

### config

Copy `example.config.json` to `config.json` and edit it.

If `debug.estrus` is true, all posts will be processed, otherwise only `mastodon.victimAcct` posts will be processed.

### build:

```bash
docker-compose build
```

### run:

```bash
docker-compose up -d
```
