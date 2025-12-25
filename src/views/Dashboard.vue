<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { RecycleScroller } from "vue-virtual-scroller";

import MobileMenu from "@/components/MobileMenu.vue";
import StoryBar from "@/components/StoryBar.vue";

import { useStories } from "@/composables/useStories.js";
import { formatTimeAgo } from "@/utils/formatters.js";
import { getGridColumns, getRowHeight, GAP } from "@/utils/gridConfig.js";

const router = useRouter();

// Stories data
const {
  isLoading,
  isLoadingMore,
  error,
  storiesWithUsers,
  fetchStories,
  loadMore,
} = useStories({ limit: 30, maxItemsInMemory: 500 });

// Grid settings
const gridColumns = ref(2);
const rowHeight = ref(300);
const scrollerRef = ref(null);

// Group stories into rows for RecycleScroller
const storyRows = computed(() => {
  const rows = [];
  const items = storiesWithUsers.value;
  const cols = gridColumns.value;

  for (let i = 0; i < items.length; i += cols) {
    rows.push({
      id: i,
      items: items.slice(i, i + cols),
    });
  }
  return rows;
});

const updateGridSettings = () => {
  const width = window.innerWidth;
  gridColumns.value = getGridColumns(width);
  rowHeight.value = getRowHeight(width);
};

// Infinite scroll - detect when near bottom
let scrollTimeout = null;
const onScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    if (!scrollerRef.value?.$el) return;

    const el = scrollerRef.value.$el;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    // Load more when 80% scrolled
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      loadMore();
    }
  }, 100);
};

const detailStory = (username, storyId) => {
  router.push({ name: "detail", params: { username, storyId } });
};

onMounted(() => {
  updateGridSettings();
  window.addEventListener("resize", updateGridSettings);
  fetchStories();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateGridSettings);
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<template>
  <main class="main-container">
    <header class="mobile-top-bar">
      <div class="logo">Story App</div>
      <div class="mobile-actions">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          ></path>
        </svg>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </div>
    </header>

    <StoryBar />

    <section v-if="isLoading" class="grid-container">
      <div class="loading">Loading stories...</div>
    </section>

    <section v-else-if="error" class="grid-container">
      <div class="error">
        <p>Error loading stories: {{ error.message }}</p>
        <button @click="fetchStories" class="retry-btn">Retry</button>
      </div>
    </section>

    <section v-else class="grid-container">
      <RecycleScroller
        ref="scrollerRef"
        class="scroller"
        :items="storyRows"
        :item-size="rowHeight"
        key-field="id"
        v-slot="{ item: row }"
        @scroll.native="onScroll"
      >
        <div class="story-row">
          <div
            class="story-card"
            v-for="item in row.items"
            :key="item.id"
            @click="detailStory(item.userName, item.id)"
          >
            <div class="card-placeholder"></div>
            <img :src="item.mediaUrl" class="card-img" loading="lazy" />
            <div class="time-badge">{{ formatTimeAgo(item.timestamp) }}</div>
            <div class="card-overlay">
              <img :src="item.userAvatar" class="mini-avatar" loading="lazy" />
              <span class="card-user">{{ item.userName }}</span>
            </div>
          </div>
        </div>
      </RecycleScroller>

      <div v-if="isLoadingMore" class="loading-more">
        <span>Loading more...</span>
      </div>
    </section>
  </main>
  <MobileMenu />
</template>

<style scoped>
.grid-container {
  padding: 16px;
  flex: 1;
}

.scroller {
  height: calc(100vh - 180px);
  overflow-y: auto;
}

.story-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-bottom: 8px;
}

@media (min-width: 768px) {
  .story-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .story-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .story-row {
    grid-template-columns: repeat(5, 1fr);
  }
}

.story-card {
  aspect-ratio: 9 / 16;
  background-color: #1e293b;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.card-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.time-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.card-user {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: white;
  text-align: center;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 12px;
}

.retry-btn:hover {
  background: #0056b3;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 20px;
  color: #94a3b8;
}
</style>
