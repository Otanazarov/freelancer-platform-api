import { GraphQLError } from 'graphql';

export function HttpError(message: string) {
  throw new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT', 
    },
  });
}
