"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
// server/src/schemas/typeDefs.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  # ------------- TYPES -------------
  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: String
    followers: [Profile]
    following: [Profile]
  }

  type Auth {
    token: String!
    profile: Profile!
  }

  # ---------------- QUERIES ----------------
  type Query {
    # Get all profiles
    profiles: [Profile]!

    # Get a single profile by ID
    profile(profileId: ID!): Profile

    # Get the currently authenticated user
    me: Profile

    # Search profiles by name/email (simple regex)
    searchProfile(searchTerm: String!): [Profile]
  }

  # ---------------- MUTATIONS ----------------
  type Mutation {
    # Create a new user; returns Auth payload
    addProfile(name: String!, email: String!, password: String!): Auth

    # Login existing user; returns Auth payload
    login(email: String!, password: String!): Auth

    # Remove the currently authenticated user
    removeProfile: Profile

    # Follow/unfollow
    followProfile(profileId: ID!): Profile
    unfollowProfile(profileId: ID!): Profile
  }
`;
