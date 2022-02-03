## database schema

#### event
  - id - uuid
  - name - string
  - location - string
  - created_at - date (string)
  - start_time - date (string)
  - end_time - date (string) default is null
  - rsvp_end - date (string) default is start_time
  - picture - string
  - description - string
  - host - string
  - guests - email[]
  - isPublic - boolean
  - capacity - integer

#### user: 
  - key - email
  - events - Map(uuid -> status)
  - friends email[]


