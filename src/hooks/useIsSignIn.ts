import { useUser } from '@auth0/nextjs-auth0';

export const useIsSignIn = () => {
  const { user } = useUser();
  return typeof user !== 'undefined';
};
