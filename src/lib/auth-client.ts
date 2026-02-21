"use client";

import { useState, useEffect, useCallback } from "react";

export interface ClientSession {
    user: {
        id: string;
        name: string;
        email: string | null;
        image: string | null;
        login: string;
    };
}

export function useSession() {
    const [data, setData] = useState<ClientSession | null>(null);
    const [isPending, setIsPending] = useState(true);

    const refresh = useCallback(() => {
        setIsPending(true);
        fetch("/api/auth/session")
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                setData(d);
                setIsPending(false);
            })
            .catch(() => setIsPending(false));
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { data, isPending, refresh };
}

export const signIn = {
    social: ({ callbackURL }: { provider: string; callbackURL?: string }) => {
        const url = `/api/auth/github${callbackURL ? `?next=${encodeURIComponent(callbackURL)}` : ""}`;
        window.location.href = url;
    },
};

export function signOut(opts?: { fetchOptions?: { onSuccess?: () => void } }) {
    fetch("/api/auth/sign-out", { method: "POST" }).then(() => {
        if (opts?.fetchOptions?.onSuccess) {
            opts.fetchOptions.onSuccess();
        } else {
            window.location.href = "/";
        }
    });
}
