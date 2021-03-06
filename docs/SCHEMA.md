// https://dbdiagram.io/d/5e9014c539d18f5553fd647c

Table accounts {
  id bigint [pk, increment] // auto-increment
  auth0_id varchar [not null, unique]
  email varchar [not null, unique]
  created_at timestamp
  last_login_at timestamp
  is_active bool [default: true]
  is_confirmed bool [default: false, note: 'Email was checked']
}


// PROFILES
// ----------------------
// Handles the identity of a user and all the
// visual settings that governates the public
// look and feel of the account.

Table profiles {
  id bigint [pk]
  uuid uuid [not null, unique]
  uname varchar [not null, unique, note: 'After create, should create relative tag "@uname"']
  country_code varchar(3)
  language_code varchar(3)
  // Content
  layout varchar [not null, note: 'Enforced by dynamic constraint']
  content jsonb [not null, default: '{}', note: 'Full json description of the content']
}

Table profiles_tags {
  tag_id bigint [not null]
  profile_id bigint [not null]
  // Owner
  created_by bigint [not null]
  created_at datetime [not null]
}

Ref: profiles_tags.created_by > accounts.id
Ref: profiles_tags.tag_id > tags.id
Ref: profiles_tags.profile_id > profiles.id

Ref: profiles.id - accounts.id




// PINS
// ----------------------
// Pins are the bookmark units and aim to refer to
// an external resource.
// 
// [idea] When a pin is created, we could automatically
// add a "@username" tag that makes it easy to
// correlate all that was pinned by a user.

Table pins_tags {
  tag_id bigint [not null]
  pin_id bigint [not null]
  // Owner
  created_by bigint [not null]
  created_at datetime [not null]
}

Ref: pins_tags.created_by > accounts.id
Ref: pins_tags.tag_id > tags.id
Ref: pins_tags.pin_id > pins.id

Table pins {
  // Identifier
  id bigint [pk]
  uuid uuid [not null, unique]
  slug varchar [not null, unique, note: 'Fallback to a uuid if empty']
  // Owner
  created_by bigint [not null]
  created_at datetime [not null]
  // Resource
  url varchar [not null]
  title varchar [not null]
  description text
  cover varchar [not null, note: 'Link to featured image']
  // Content
  layout varchar [not null, note: 'Enforced by dynamic constraint']
  content jsonb [not null, default: '{}', note: 'Full json description of the content']
  // Flags
  is_private bool [default: false, note: 'can be true only if the uses has a paid subscription']
  was_scraped bool [default: false, note: 'Becomes true when the url has been scraped']
  is_blocked bool [default: false, note: 'Local cache to index out bad content']
}

Ref: pins.created_by > accounts.id


// BOARDS
// ----------------------
// Boards are collections of Pins or other
// kind of content, basically the CMS side
// of the project.

Table boards_tags {
  tag_id bigint [not null]
  board_id bigint [not null]
  // Owner
  created_by bigint [not null]
  created_at datetime [not null]
}

Ref: boards_tags.created_by > accounts.id
Ref: boards_tags.tag_id > tags.id
Ref: boards_tags.board_id > boards.id

Table boards {
  // Identifier
  id bigint [pk]
  uuid uuid [not null, unique]
  slug varchar [not null, unique, note: 'Fallback to a uuid if empty']
  // Owner
  created_by bigint [not null]
  created_at datetime [not null]
  // Resource
  title varchar [not null]
  description text
  cover varchar [not null, note: 'Link to featured image']
  // Content
  layout varchar [not null, note: 'Enforced by dynamic constraint']
  content jsonb [not null, default: '{}', note: 'Full json description of the content']
  // Flags
  is_private bool [default: false, note: 'can be true only if the uses has a paid subscription']
  is_blocked bool [default: false, note: 'Local cache to index out bad content']
}

Ref: boards.created_by > accounts.id





// TERMS AND CONDITIONS
// ----------------------
// Legally valid aknowledge of a terms and conditions
// agreement.
//
// When a new agreement is released, the use should be
// prompted to review and accept the latest available one.
//
// A join between last agreement item with its own "ak"
// should be enough to verify if the ak was performed.
Table agreements {
  id int [pk]
  created_at datetime
  content text [not null, note: 'Original english agreement']
  translations jsonb [not null, note: 'Map by language and country']
  digest text [not null, note: 'Hash or md5 (content + translations)']
}

Table agreements_ak {
  created_by bigint [not null]
  created_at datetime [not null]
  agreement_id int [not null]
  device_data text [not null, note: 'Device info as strigified json']
  digest text [not null, note: 'Hash or md5 (device data + created_by + created_at + agreemend_id + agreement_digest)']
}

Ref: agreements_ak.created_by > accounts.id
Ref: agreements_ak.agreement_id > agreements.id



// USER TRACING
// ----------------------
// A session id is generated by the backend API
// and set as cookie or header or localStorage
// so that any action performed can be traced to
// a session.
//
// Sessions expire by time, the mechanism that
// validates a sessionId will automatically generate
// a new session in case the current session expired.
//
// Expiry can be enforced by a queue that monitors
// non-expired sessions and updated them based on the
// latest recorded activity.
Table sessions {
  id uuid [pk]
  created_by bigint [not null]
  created_at datetime [not null]
  expired_at datetime
  data jsonb [note: 'Could pick browser details and other meta data']
}

Ref: sessions.created_by > accounts.id

Table session_actions {
  id bigint [pk, increment]
  session_id uuid [not null]
  created_at datetime [not null]
  created_by bigint
  name varchar [not null, note: 'ENUM Enforced by dynamic constraint']
  data jsonb [note: 'Any kind of action payload']
}

Ref: session_actions.session_id > sessions.id
Ref: session_actions.created_by > accounts.id



// MISC TABLES
// ----------------------
// Generic support

Table tags {
  id bigint [pk, increment]
  name varchar [not null, unique]
  created_at datetime [not null]
  created_by bigint
}

Ref: tags.created_by > accounts.id

// URL PREVIEWS LOOKUP CACHE
// this table is manned by a lookup service that
// keeps this cached table and periodically
// cleans up expired caches
Table previews {
  url varchar [pk]
  created_at datetime [not null, default: 'now()']
  data jsonb [not null, default: '{}']
}