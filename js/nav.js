"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $userNavLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  putStoriesOnPage();
}

// show the submit form

function showSumbitStoryForm(e) {
  e.preventDefault();
  $submitForm.toggleClass("hidden");
}

$userNavLinks.on("click", ".submit-story", showSumbitStoryForm);

// show user favorites

function putFavoritesOnPage(e) {
  e.preventDefault();
  console.log("here");
  $favoritesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritesList.append($story);
  }

  $favoritesList.toggleClass("hidden");
}

$userNavLinks.on("click", ".favorites", putFavoritesOnPage);

function showUserStories(e) {
  e.preventDefault();
  $userStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $userStoriesList
      .append($story)
      .append($('<button class="delete">Delete</button>'));
  }

  $userStoriesList.toggleClass("hidden");
}

$userNavLinks.on("click", ".user-stories", showUserStories);
