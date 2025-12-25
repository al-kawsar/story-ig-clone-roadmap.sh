export const createUsersMap = (users) => {
  const map = new Map()
  users.forEach((user) => {
    // Use number as key for consistent lookup with story.userId
    map.set(Number(user.id), user)
  })
  return map
}

export const processStoriesWithUsers = (stories, usersMap) => {
  const map = new Map()

  for (const story of stories) {
    const existing = map.get(story.userId)

    if (!existing) {
      map.set(story.userId, story)
      continue
    }

    if (!story.hasViewed && existing.hasViewed) {
      map.set(story.userId, story)
      continue
    }

    if (
      story.hasViewed === existing.hasViewed &&
      story._time > existing._time
    ) {
      map.set(story.userId, story)
    }
  }

  return [...map.values()]
    .sort((a, b) =>
      a.hasViewed !== b.hasViewed ? (a.hasViewed ? 1 : -1) : b._time - a._time,
    )
    .map((story) => {
      const user = usersMap.get(story.userId)
      return {
        ...story,
        userName: user?.username ?? "Unknown",
        userAvatar: user?.profilePicture,
      }
    })
}

export const addTimestampField = (stories) => {
  return stories.map(story => ({
    ...story,
    _time: new Date(story.timestamp).getTime()
  }))
}
