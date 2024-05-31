import { writable } from "svelte/store";

function manageTotalImagePosts() {
  const TotalImagePosts = writable(0);

  return {
    subscribe: TotalImagePosts.subscribe,
    setTotalImagePosts: (fetchedTotalImagePosts: number) => {
      TotalImagePosts.set(fetchedTotalImagePosts);
    }
  };
}

export const TotalImagePostsStore = manageTotalImagePosts();
