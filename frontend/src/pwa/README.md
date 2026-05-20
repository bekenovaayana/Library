# PWA Architecture

This folder contains Progressive Web App registration logic. Static assets live in `public/`.

## Flow

```
PwaProvider (mount)
  └── registerServiceWorker()  if NEXT_PUBLIC_PWA_ENABLED=true
        └── /sw.js (public)
              ├── install: precache shell routes
              ├── fetch: network-first with cache fallback
              └── navigate offline → /offline page
```

## Offline strategy

| Resource | Strategy |
|----------|----------|
| HTML navigation | Network-first, cache fallback, offline page |
| Static assets | Cached on successful GET |
| API (`/api/*`) | Never cached — always network |

## Enabling

Set `NEXT_PUBLIC_PWA_ENABLED=true` and rebuild. Service workers require HTTPS in production (localhost is exempt).

## Future enhancements

- Workbox for advanced caching strategies
- Background sync for queued mutations
- Push notifications
