# Internal redirects

when a _slug_ changes, the old url is added to a redirects table pointing to the new url.
this table is used to handle a 301 redirect as filter before showing a 404 page.
a queue removes the redirects directive after a while (like 1 month, so that google has time to reindes)

TODO: data structure
TODO: features in roadmap