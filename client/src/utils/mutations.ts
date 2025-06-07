import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
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
      }
    }
  }
`;

export const UNFOLLOW_PROFILE = gql`
  mutation unfollowProfile($profileId: ID!) {
    unfollowProfile(profileId: $profileId) {
      success
      message
      profile {
        _id
        name
        followers {
          _id
          name
        }
      }
    }
  }
`;

export const FOLLOW_PROFILE = gql`
  mutation followProfile($profileId: ID!) {
    followProfile(profileId: $profileId) {
      success
      message
      profile {
        _id
        name
        followers {
          _id
          name
        }
      }   
    }
  }
`;

export const ADD_TO_LIBRARY = gql`
  mutation AddToLibrary($gameId: ID!, $gameName: String!) {
    addToLibrary(gameId: $gameId, gameName: $gameName) {
      _id
      library {
        rawgId
        name
      }
    }
  }
`;
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($gameId: ID!, $gameName: String!) {
    addToWishlist(gameId: $gameId, gameName: $gameName) {
      _id
      wishlist {
        rawgId
        name
      }
    }
  }
`;
export const ADD_TO_PLAYLIST = gql`
  mutation AddToPlaylist($gameId: ID!, $gameName: String!) {
    addToPlaylist(gameId: $gameId, gameName: $gameName) {
      _id
      playlist {
        rawgId
        name
      }
    }
  }
`;