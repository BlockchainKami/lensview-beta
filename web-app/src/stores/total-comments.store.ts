import { writable } from "svelte/store";

function manageTotalComments() {
  const totalComments = writable(0);

  return {
    subscribe: totalComments.subscribe,
    setTotalComments: (fetchedTotalComments: number) => {
      totalComments.set(fetchedTotalComments);
    }
  };
}

export const totalCommentsStore = manageTotalComments();
