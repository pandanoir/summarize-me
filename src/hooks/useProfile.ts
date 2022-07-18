import { useLazyQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { gql } from 'apollo-server-micro';
import { useEffect, useState } from 'react';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';

export const useProfile = () => {
  const { user, isLoading: isUserLoading, error: userError } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<NexusGenFieldTypes['User'] | null>(
    null
  );
  const [fetchUser] = useLazyQuery<
    { user: NexusGenFieldTypes['User'] },
    NexusGenArgTypes['Query']['user']
  >(
    gql`
      query User($id: ID!) {
        user(id: $id) {
          iconUrl
        }
      }
    `
  );

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (userError || !user?.sub) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchUser({ variables: { id: user.sub } }).then((data) => {
      console.log(data);
      if (data.data) {
        setProfile(data.data.user);
      }
      setIsLoading(false);
    });
  }, [fetchUser, isUserLoading, user?.sub, userError]);

  if (profile) {
    return { isLoading, isSignedIn: true, iconUrl: profile.iconUrl } as const;
  }
  return { isLoading, isSignedIn: false } as const;
};
