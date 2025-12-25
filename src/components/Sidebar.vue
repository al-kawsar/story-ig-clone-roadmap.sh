<script setup></script>
<template>
  <nav class="desktop-sidebar">
    <div class="sidebar-logo">Story App</div>

    <div class="sidebar-menu">
      <router-link to="/" class="sidebar-item active">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span>Beranda</span>
      </router-link>
      <a href="#" class="sidebar-item">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          ></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        <span>Upload Story</span>
      </a>
      <a href="#" class="sidebar-item">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
          class="nav-profile-img"
          style="border: none"
        />
        <span>Profile</span>
      </a>
    </div>
  </nav>
</template>
<style scoped>
/* --- SIDEBAR DESKTOP (Hidden on Mobile) --- */
.desktop-sidebar {
  display: none; /* Default hidden */
  min-width: 245px;
  background-color: var(--bg-sidebar);
  border-right: 0.1px solid var(--border-color);
  padding: 40px 24px;
  flex-direction: column;
  gap: 32px;
}

.sidebar-logo {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 10px;
  display: block;
  font-family: "Segoe UI", cursive;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 16px;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
  font-weight: 700;
}

@media (min-width: 768px) {
  .desktop-sidebar {
    display: flex;
  }
}
</style>
