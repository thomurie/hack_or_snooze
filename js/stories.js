"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  const $FavoriteButtonShown = $(`
  <li id="${story.storyId}">
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
    <button class="favorite">Favorite</button>
  </li>
`);

  const ids = favoriteIDs();
  const userStoryIDs = userStories();

  if (Boolean(currentUser) === true) {
    if (currentUser.favorites.length >= 1) {
      if (ids.indexOf(story.storyId) !== -1) {
        return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="favorite">Favorited</button>
      </li>
    `);
      } else {
        return $FavoriteButtonShown;
      }
    } else {
      return $FavoriteButtonShown;
    }
  } else {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function handleStoryFormSubmit(e) {
  e.preventDefault();
  console.log("something");
  const _$author = $("#story-author");
  const _$title = $("#story-title");
  const _$url = $("#story-url");

  const _addedStory = generateStoryMarkup(
    await storyList.addStory(currentUser, {
      author: _$author.val(),
      title: _$title.val(),
      url: _$url.val(),
    })
  );

  _$author.val("");
  _$title.val("");
  _$url.val("");
  $submitForm.toggleClass("hidden");
  $allStoriesList.prepend(_addedStory);
}

$submitForm.submit(handleStoryFormSubmit);

async function favoriteStory(e) {
  e.preventDefault();
  if ($(this).text() === "Favorite") {
    await currentUser.favoriteAStory($(this).parent().attr("id"));
    $(this).text("Favorited");
  } else {
    await currentUser.removeaFavorie($(this).parent().attr("id"));
    $(this).text("Favorite");
  }
}

$allStoriesList.on("click", ".favorite", favoriteStory);

function favoriteIDs() {
  const favoriteIDsArr = [];
  if (currentUser.favorites.length) {
    for (let index = 0; index < currentUser.favorites.length; index++) {
      favoriteIDsArr.push(currentUser.favorites[index].storyId);
    }
  }
  return favoriteIDsArr;
}

function userStories() {
  const userStoryIDs = [];
  for (let index = 0; index < currentUser.ownStories.length; index++) {
    userStoryIDs.push(currentUser.ownStories[index].storyId);
  }
  return userStoryIDs;
}

async function removeStory(e) {
  e.preventDefault();
  currentUser.deleteUserStory($(this).parent().children().attr("id"));
  showUserStories(e);
}

$userStoriesList.on("click", ".delete", removeStory);
