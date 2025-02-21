import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_SAVED_BOOKS = gql`
  query getSavedBooks {
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
`;