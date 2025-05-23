const typeDefs = `
  type Profile {
    _id: ID
    name: String
    email: String
    password: String
    followers: [Profile]
    following: [Profile]
  }

  type Auth {
    token: ID!
    profile: Profile
  }
  
  input ProfileInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    me: Profile
  }

  type Mutation {
    addProfile(input: ProfileInput!): Auth
    login(email: String!, password: String!): Auth
    removeProfile: Profile
    followProfile(profileId: ID!): Profile
    unfollowProfile(profileId: ID!): Profile
  }
`;
export default typeDefs;
