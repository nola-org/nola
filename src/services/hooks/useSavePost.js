import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { ToastError } from "../ToastError/ToastError";
import {
  getSavePostApi,
  postSavePostApi,
  postUnsavePostApi,
} from "../https/https";
import { Toastify } from "../Toastify/Toastify";

const LOKAL_KEY = "savedPost";

export function useSavePost() {
  const { token } = useAuth();

  const isGuestRef = useRef(true); // ← Инициализация ref
  const disabledRef = useRef(false);

  const [savedPostIds, setSavedPostIds] = useState(() => {
    return JSON.parse(localStorage.getItem("savedPostId")) ?? [];
  });

  const [savedPosts, setSavedPosts] = useState(() => {
    return JSON.parse(localStorage.getItem(LOKAL_KEY)) ?? [];
  });
  const [isDisabled, setIsDisabled] = useState(false);
  // 💡 Определяем, был ли пользователь гостем
  useEffect(() => {
    try {
      const raw = localStorage.getItem("persist:auth");
      if (!raw) {
        isGuestRef.current = true;
        return;
      }

      const parsed = JSON.parse(raw);
      const persistedToken = parsed.token ? JSON.parse(parsed.token) : null;

      isGuestRef.current = !persistedToken;
    } catch (e) {
      isGuestRef.current = true;
    }
  }, []);

  // 🔁 Синхронизация при логине или очистка при logout
  useEffect(() => {
    if (!token) {
      if (!isGuestRef.current) {
        // logout
        setSavedPostIds([]);
        setSavedPosts([]);

        localStorage.removeItem("savedPostId");
        localStorage.removeItem(LOKAL_KEY);
        window.location.reload();
      }
      localStorage.setItem("savedPostId", JSON.stringify([]));
      localStorage.setItem(LOKAL_KEY, JSON.stringify([]));
      return;
    }

    // Если вошёл — синхронизируем
    (async () => {
      try {
        const serverPosts = await getSavePostApi();
        const serverIds = serverPosts.map((p) => p.id);

        const localSavedPosts =
          JSON.parse(localStorage.getItem(LOKAL_KEY)) ?? [];
        const postsToSync = localSavedPosts.filter(
          (post) => !serverIds.includes(post.id)
        );

        for (const post of postsToSync) {
          try {
            await postSavePostApi(post.id, post);
          } catch (err) {
            console.error(`Ошибка синхронизации поста ID=${post.id}`, err);
          }
        }

        const updatedIds = [
          ...new Set([...serverIds, ...postsToSync.map((p) => p.id)]),
        ];
        setSavedPostIds(updatedIds);
        setSavedPosts([]);

        localStorage.removeItem("savedPostId");
        localStorage.removeItem(LOKAL_KEY);
      } catch (err) {
        ToastError(err?.message);
      }
    })();
  }, [token]);

  // 💾 Сохраняем в localStorage только если пользователь — гость
  useEffect(() => {
    if (!token && isGuestRef.current) {
      localStorage.setItem("savedPostId", JSON.stringify(savedPostIds));
      localStorage.setItem(LOKAL_KEY, JSON.stringify(savedPosts));
    }
  }, [savedPostIds, savedPosts, token]);

  const toggleSave = useCallback(
    async (post) => {
      const postId = post.id;

      if (token) {
        try {
          if (savedPostIds.includes(postId)) {
            await postUnsavePostApi(postId);
            ToastError("Post has been deleted");
            setSavedPostIds((ids) => ids.filter((id) => id !== postId));
          } else {
            await postSavePostApi(postId, {});
            Toastify("Post successfully saved");
            setSavedPostIds((ids) => [...ids, postId]);
          }
        } catch (err) {
          ToastError(err?.message);
        }
      } else {
        // Гость
        setSavedPostIds((ids) =>
          ids.includes(postId)
            ? ids.filter((id) => id !== postId)
            : [...ids, postId]
        );

        setSavedPosts((posts) => {
          const exists = posts.some((p) => p.id === postId);
          if (exists) {
            ToastError("Post has been deleted");
            return posts.filter((p) => p.id !== postId);
          } else {
            Toastify("Post successfully saved");
            return [...posts, post];
          }
        });
      }
    },
    [token, savedPostIds, savedPosts]
  );

  const isSaved = useCallback(
    (postId) => savedPostIds.includes(postId),
    [savedPostIds]
  );

  return {
    savedPostIds,
    savedPosts,
    isSaved,
    toggleSave,
    isDisabled,
    setIsDisabled,
  };
}
