import { ref, computed } from "vue";
import { api } from "@/utils/api.js";
import { createUsersMap } from "@/utils/storyHelpers.js";

export function useStories(options = {}) {
  const {
    limit = 30,
    maxItemsInMemory = 500,
  } = options;

  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref(null);
  const stories = ref([]);
  const users = ref([]);
  const page = ref(1);
  const hasMore = ref(true);

  const usersMap = computed(() => createUsersMap(users.value));

  const storiesWithUsers = computed(() => {
    return stories.value.map((story) => {
      const user = usersMap.value.get(story.userId);
      return {
        ...story,
        userName: user?.username ?? "Unknown",
        userAvatar: user?.profilePicture,
      };
    });
  });

  const fetchUsers = async (userIds) => {
    const existingIds = new Set(users.value.map((u) => Number(u.id)));
    const newIds = userIds.filter((id) => !existingIds.has(id));
    if (newIds.length > 0) {
      const newUsers = await api.fetchUsersByIds(newIds);
      users.value = [...users.value, ...newUsers];
    }
  };

  const fetchStories = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      page.value = 1;

      const { data: storiesData, pages } = await api.fetchStoriesPaginated(1, limit);
      stories.value = storiesData;
      hasMore.value = page.value < pages;

      const userIds = storiesData.map((s) => s.userId);
      await fetchUsers(userIds);
    } catch (err) {
      console.error("Error fetching stories:", err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (isLoadingMore.value || !hasMore.value) return;

    try {
      isLoadingMore.value = true;
      page.value++;

      const { data: newStories, pages } = await api.fetchStoriesPaginated(page.value, limit);

      if (!newStories || newStories.length === 0) {
        hasMore.value = false;
        return;
      }

      stories.value = [...stories.value, ...newStories];

      // Trim old data if exceeding max items
      if (stories.value.length > maxItemsInMemory) {
        stories.value = stories.value.slice(-maxItemsInMemory);
      }

      hasMore.value = page.value < pages;

      const userIds = newStories.map((s) => s.userId);
      await fetchUsers(userIds);
    } catch (err) {
      console.error("Error loading more:", err);
      page.value--;
    } finally {
      isLoadingMore.value = false;
    }
  };

  const reset = () => {
    stories.value = [];
    users.value = [];
    page.value = 1;
    hasMore.value = true;
    error.value = null;
  };

  return {
    // State
    isLoading,
    isLoadingMore,
    error,
    stories,
    users,
    hasMore,
    
    // Computed
    storiesWithUsers,
    usersMap,
    
    // Methods
    fetchStories,
    loadMore,
    reset,
  };
}
