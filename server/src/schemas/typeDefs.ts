import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # ------------- TYPES -------------

  type GameItem {
    _id: ID!
    rawgId: String!
    name: String!
    released: String
    background_image: String
    listType: String
    addedBy: ID
  }

  input GameInput {
    rawgId: String!
    name: String!
    released: String
    background_image: String
  }

  type Profile {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    followers: [Profile!]!
    following: [Profile!]!
    library: [GameItem!]!
    wishlist: [GameItem!]!
    playlist: [GameItem!]!
  }

  type AuthPayload {
    token: String!
    profile: Profile!
  }

  type ChangePasswordResult {
    message: String!
  }

  # ------------- QUERIES -------------
  type Query {
    profiles: [Profile!]!
    profile(profileId: ID!): Profile
    me: Profile
    searchProfile(searchTerm: String!): [Profile!]!
  }

  # ------------- MUTATIONS -------------
  type Mutation {
    addProfile(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    removeProfile: Profile
    followProfile(profileId: ID!): Profile
    unfollowProfile(profileId: ID!): Profile

    addToLibrary(gameInput: GameInput!): Profile
    addToWishlist(gameInput: GameInput!): Profile
    addToPlaylist(gameInput: GameInput!): Profile

    removeFromLibrary(gameId: ID!): Profile
    removeFromWishlist(gameId: ID!): Profile
    removeFromPlaylist(gameId: ID!): Profile

    updateProfile(name: String!, email: String!): Profile
    changePassword(oldPassword: String!, newPassword: String!): ChangePasswordResult
  }
`;