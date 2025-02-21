import User from '../models/User'; 
import { signToken } from '../services/auth'; 
import { UserDocument } from '../models/User';


interface Context {
  user?: UserDocument;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (context: Context): Promise<UserDocument[] | null> => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new Error('Not logged in');
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email address');
      }

      const isCorrectPassword = await user.isCorrectPassword(password);
      if (!isCorrectPassword) {
        throw new Error('Incorrect password');
      }

      const token = signToken(user.username, user.password, user._id);
      return { token, user };
    },

    addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.password, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookId, authors, description, title, image, link }: SaveBookArgs, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('Not logged in');
    },

    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('Not logged in');
    },
  },
};

export default resolvers;