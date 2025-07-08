import { useState, useEffect, useCallback } from "react";
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

  const [savedPostIds, setSavedPostIds] = useState(() => {
    return JSON.parse(localStorage.getItem("savedPostId")) ?? [];
  });
  const [savedPosts, setSavedPosts] = useState(() => {
    return JSON.parse(localStorage.getItem(LOKAL_KEY)) ?? [];
  });

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getSavePostApi(); 
        const ids = data.map((p) => p.id);
        setSavedPostIds(ids);
      } catch (err) {
        ToastError(err?.message);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (token) return;
    localStorage.setItem("savedPostId", JSON.stringify(savedPostIds));
    localStorage.setItem(LOKAL_KEY, JSON.stringify(savedPosts));
  }, [savedPostIds, savedPosts, token]);

  // Переключение сохранения
  const toggleSave = useCallback(
    async (post) => {
      const postId = post.id;

      if (token) {
        // Авторизованный
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

  return { savedPostIds, savedPosts, isSaved, toggleSave };
}
