// client/src/utils/mutations.ts
import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;

export const FOLLOW_PROFILE = gql`
  mutation followProfile($profileId: ID!) {
    followProfile(profileId: $profileId) {
      _id
      name
      followers {
        _id
        name
      }
    }
  }
`;

export const UNFOLLOW_PROFILE = gql`
  mutation unfollowProfile($profileId: ID!) {
    unfollowProfile(profileId: $profileId) {
      _id
      name
      followers {
        _id
        name
      }
    }
  }
`;

export const ADD_TO_LIBRARY = gql`
  mutation AddToLibrary($gameInput: GameInput!) {
    addToLibrary(gameInput: $gameInput) {
      _id
      library {
        rawgId
        name
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($gameInput: GameInput!) {
    addToWishlist(gameInput: $gameInput) {
      _id
      wishlist {
        rawgId
        name
      }
    }
  }
`;

export const ADD_TO_PLAYLIST = gql`
  mutation AddToPlaylist($gameInput: GameInput!) {
    addToPlaylist(gameInput: $gameInput) {
      _id
      playlist {
        rawgId
        name
        status
      }
    }
  }
`;

export const REMOVE_FROM_LIBRARY = gql`
  mutation RemoveFromLibrary($gameId: ID!) {
    removeFromLibrary(gameId: $gameId) {
      _id
      library {
        rawgId
        name
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($gameId: ID!) {
    removeFromWishlist(gameId: $gameId) {
      _id
      wishlist {
        rawgId
        name
      }
    }
  }
`;

export const REMOVE_FROM_PLAYLIST = gql`
  mutation RemoveFromPlaylist($gameId: ID!) {
    removeFromPlaylist(gameId: $gameId) {
      _id
      playlist {
        rawgId
        name
      }
    }
  }
`;

export const UPDATE_PLAYLIST_STATUS = gql`
  mutation UpdatePlaylistStatus($gameId: ID!, $status: String!) {
    updatePlaylistStatus(gameId: $gameId, status: $status) {
      _id
      playlist {
        rawgId
        name
        status
      }
    }
  }
`;

export const UPDATE_LIBRARY_STATUS = gql`
  mutation UpdateLibraryStatus($gameId: ID!, $status: String!) {
    updateLibraryStatus(gameId: $gameId, status: $status) {
      _id
      library {
        rawgId
        name
        status
      }
    }
  }
`;
