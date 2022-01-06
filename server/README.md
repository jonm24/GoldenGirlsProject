## database schema

(create dummy images)[https://dummyimage.com/]

event: 
{
  id - uuid
  name - string
  location - string
  created_at - string
  time - string
  picture - string
  description - string
  host - string
  guests - Map(user -> status)
  isPublic - boolean
  capacity - integer
}

user: 
{
  id - uuid  
  name - string
  avatar - string
  handle - string
  events - Map(uuid -> status)
  following - uuid[] 
  followers - uuid[] 
}

#### fields not needed for test data

- following 
- followers
- isPublic
- capacity
- guests?

