## Deadline Stack

A small two-tier to-do list. You type in a task and pick a priority (high /
medium / low). the **server** stamps it with a creation time and derives a
**deadline** from the priority (high = due in 1 day, medium = 3 days, low =
7 days). The homepage shows the entry form and a live results table side by
side, laid out with **flexbox**. Adding or deleting a task calls the
server's JSON API and re-renders the table from the response without reloading the page


### Running it locally

npm install
npm start
Then visit `http://localhost:3000`.

## Technical Achievements
Single Page App: Submitting the form never reloads the page. public/js/main.js calls event.preventDefault() \
and sends the new task to the server with fetch(); the server computes the derived deadline field and responds 
with the entire updated dataset, which the client uses to re-render the results table in place. The same pattern 
is used for deletes.

AI Assistance: Color scheme decisions along with some minor visual adjustments in  main.css
