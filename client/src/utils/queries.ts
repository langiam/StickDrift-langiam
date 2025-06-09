import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      followers {
        _id
        name
      }
      following {
        _id
        name
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      email
      followers {
        _id
        name
      }
      following {
        _id
        name
      }
      library {
        _id
        rawgId
        name
        released
        background_image
      }
      wishlist {
        _id
        rawgId
        name
        released
        background_image
      }
      playlist {
        _id
        rawgId
        name
        released
        background_image
      }
    }
  }
`;

export const SEARCH_PROFILE = gql`
  query searchProfile($searchTerm: String!) {
    searchProfile(searchTerm: $searchTerm) {
      _id
      name
    }
  }
`;

export const QUERY_PROFILE_FOLLOWERS = gql`
  query profileFollowers($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      followers {
        _id
        name
      }
    }
  }
`;

export const QUERY_PROFILE_FOLLOWING = gql`
  query profileFollowing($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      following {
        _id
        name
      }
    }
  }
`;

export const QUERY_PROFILE_LIBRARY = gql`
  query profileLibrary($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      library {
        _id
        rawgId
        name
        released
        background_image
      }
    }
  }
`;

export const QUERY_PROFILE_WISHLIST = gql`
  query profileWishlist($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      wishlist {
        _id
        rawgId
        name
        released
        background_image
      }
    }
  }
`;

export const QUERY_PROFILE_PLAYLIST = gql`
  query profilePlaylist($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      playlist {
        _id
        rawgId
        name
        released
        background_image
      }
    }
  }
`;

export const QUERY_SINGLE_GAME = gql`
  query singleGame($gameId: ID!) {
    game(gameId: $gameId) {
      _id
      rawgId
      name
      released
      background_image
    }
  }
`;