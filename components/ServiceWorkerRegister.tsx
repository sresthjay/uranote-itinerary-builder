"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            return;
        }

        if (!("serviceWorker" in navigator)) {
            return;
        }

        let registered = false;

        const register = () => {
            if (registered) {
                return;
            }

            registered = true;

            navigator.serviceWorker
                .register("/sw.js", {
                    scope: "/",
                    updateViaCache: "none",
                })
                .catch((error) => {
                    console.error(
                        "Service worker registration failed:",
                        error
                    );
                });
        };

        if (document.readyState === "complete") {
            register();
        } else {
            window.addEventListener("load", register, {
                once: true,
            });
        }

        return () => {
            window.removeEventListener("load", register);
        };
    }, []);

    return null;
}