import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # ------------- TYPES -------------

  type GameEntry {
    rawgId: ID!
    name: String!
  }

  input GameInput {
    id: Int!
    name: String!
    released: String
    background_image: String
  }

  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: String
    followers: [Profile]
    following: [Profile]
    library: [GameEntry]
    wishlist: [GameEntry]
    playlist: [GameEntry]
  }

  type Auth {
    token: String!
    profile: Profile!
  }

  # ------------- QUERIES -------------
  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    me: Profile
    searchProfile(searchTerm: String!): [Profile]
  }

  # ------------- MUTATIONS -------------
  type Mutation {
  addProfile(name: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  removeProfile: Profile
  followProfile(profileId: ID!): Profile
  unfollowProfile(profileId: ID!): Profile

  addToLibrary(gameInput: GameInput!): Profile
  addToWishlist(gameInput: GameInput!): Profile
  addToPlaylist(gameInput: GameInput!): Profile
}

`;

export default typeDefs;
