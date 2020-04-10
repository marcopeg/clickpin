# API
https://api.clickpin.io

Pure GraphQL API exposed via Hasura gateway, it puts together an Hasura instance with
a custom server that is capable of handling webhooks, authenticated and public requests.

- Basic setup:
  - Hasura up and running on GitPod
  - Hasura up and running on Heroku
  - Fastify based service running on GitPod
  - Automatic deploy towards Heroku on merge on master
  - Understands Auth0 authentication token
  - Validate Hasura's webhooks token
  - Talk back to Hasura via Apollo Client (no cache)
  - Fetchq workers in place
  - Schema Migrations
    - Run migrations via CLI commands in GitPod
    - Run migrations at boot time based on ENV var 
      (root node, if there are parallel instances only one should run migrations)
- Features
  - On signup, push the user to users maintenance queue
  - On profile created, push task to create/update username tag
  - On pin update, push task to rebuild pin's cache
  - On pin slug change, push task to create redirect 301 to the uuid page

# Editor APP
https://app.clickpin.io

Pure client side app, this should be accessed on login alone and gives
the possibility to modify the contents of the account.

- Basic setup:
  - Client
    - Login / Logout
    - Query towards Hasura
    - Automatic deploy towards Netflify on merge on master
- List existing pins
- Add new Pin
  - paste url to create a pin
  - show loading until ws updates the "was_scraped"
  - redirect to pin edit panel
- Edit Pin
  - update title
  - update text
  - change image url
- Delete Pin



# Public Content Website
https://clickpin.io

Server side rendered content based on public data.  
This app is not meant to handle authentication, but it would be cool
if it was possible to share the same session id and trace public
views from an authenticated user.

- Basic setup:
  - Basic hello world with NextJS or similar tools
  - Fetch data from API via Apollo Client
  - Push data to API via Apollo Client
- Coming soon page
  (just basic page with a MailChimp form to collect signup requests)
- Terms and conditions
  (fetch latest T&C from Hasura)
- Display user profile page
  - if there is a profile's content field, render the content structure
  - if no custom content is available, render default board data structure
    (should be hard coded json that shows profile info, list of boards if available, and list of pins)
    - show profile info
    - show list of boards, if available
    - show list of pins, if available
    - show tag cloud, if available
- Display pin page
  - Valid routes
    - /@username/pin/{uuid}
    - /@username/pin/{slug}
      (with canonical id to the pin's uuid route)
- Display board page

