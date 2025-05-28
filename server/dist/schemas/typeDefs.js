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
    searchProfile(name: String!): [Profile!]!
  }

  type FollowResponse {
    success: Boolean!
    message: String!
    profile: Profile
  }
  
  type UnfollowResponse {
    success: Boolean!
    message: String!
    profile: Profile
  }
  
  type searchProfile {
    _id: ID!
    name: String!
  }

  type Mutation {
    addProfile(input: ProfileInput!): Auth
    login(email: String!, password: String!): Auth
    removeProfile: Profile
    followProfile(profileId: ID!): FollowResponse!
    unfollowProfile(profileId: ID!): UnfollowResponse!
  }
`;
export default typeDefs;
