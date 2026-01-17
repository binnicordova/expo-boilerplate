# State Management with Jotai

This project uses **Jotai** for its atomic and minimalist approach to global state.

## Core Concepts

### 1. Atoms
Atoms are the smallest units of state. They are defined in `src/stores/`.

```typescript
import { atom } from 'jotai';
export const searchAtom = atom('');
```

### 2. Persistent State
For state that must survive app restarts (e.g., user preferences, cached articles), use `atomWithStorage`.

```typescript
import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/storage'; // Custom storage adapter

export const favoritesAtom = atomWithStorage('favorites', [], storage);
```

### 3. Read/Write Actions (Async Atoms)
We use atoms to trigger side effects like API calls.

```typescript
export const fetchArticlesAtom = atom(null, async (get, set) => {
    set(loadingAtom, true);
    try {
        const data = await api.getArticles();
        set(articlesAtom, data);
    } finally {
        set(loadingAtom, false);
    }
});
```

## Best Practices

- **Separation of Concerns**: Keep atoms in `src/stores/`, not in component files.
- **Granularity**: Create small, focused atoms instead of one massive "state" object.
- **Derived State**: Use read-only atoms to process data from other atoms.
  ```typescript
  export const filteredArticlesAtom = atom((get) => {
    const articles = get(articlesAtom);
    const search = get(searchAtom);
    return articles.filter(a => a.title.includes(search));
  });
  ```
- **Custom Persistence**: Always pass the `storage` utility from `@/utils/storage` to `atomWithStorage` to ensure consistent handling of `AsyncStorage`.
