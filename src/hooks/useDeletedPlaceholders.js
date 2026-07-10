import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Melacak pesan yang baru saja hilang dari snapshot Firestore (dihapus untuk
 * semua orang) SELAMA layar ini terbuka, dan menyisipkan placeholder
 * "Pesan ini telah dihapus" di posisi yang sama secara real-time.
 *
 * Placeholder murni di memory komponen ini — TIDAK ditulis ke database.
 * Kalau user baru membuka chat setelah pesan sudah terhapus, pesan itu
 * tidak pernah ada di snapshot pertama yang diterima, sehingga tidak ada
 * apa pun untuk dibandingkan dan placeholder tidak akan muncul.
 */
export function useDeletedPlaceholders(rawDocs) {
  const [placeholders, setPlaceholders] = useState({});
  const prevMapRef = useRef(new Map());

  useEffect(() => {
    const rawMap = new Map(rawDocs.map((d) => [d.id, d]));
    const newlyGone = [];

    prevMapRef.current.forEach((doc, id) => {
      if (!rawMap.has(id)) newlyGone.push([id, doc]);
    });

    if (newlyGone.length > 0) {
      setPlaceholders((prev) => {
        const next = { ...prev };
        newlyGone.forEach(([id, doc]) => {
          if (!next[id]) {
            next[id] = { ...doc, deletedPlaceholder: true };
          }
        });
        return next;
      });
    }

    prevMapRef.current = rawMap;
  }, [rawDocs]);

  return useMemo(() => {
    const rawIds = new Set(rawDocs.map((d) => d.id));
    const extra = Object.values(placeholders).filter((p) => !rawIds.has(p.id));
    const merged = [...rawDocs, ...extra];

    merged.sort((a, b) => {
      const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bt - at; // desc — cocok dengan orderBy('createdAt','desc') + FlatList inverted
    });

    return merged;
  }, [rawDocs, placeholders]);
}
