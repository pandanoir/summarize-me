import { useLazyQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { gql } from 'apollo-server-micro';
import { useEffect, useState } from 'react';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';

export const UserQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      iconUrl
      username
      id
    }
  }
`;
export const useProfile = (userId?: string) => {
  const { user, isLoading: isUserLoading, error: userError } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<NexusGenFieldTypes['User'] | null>(
    null
  );
  const [fetchUser] = useLazyQuery<
    { user: NexusGenFieldTypes['User'] },
    NexusGenArgTypes['Query']['user']
  >(UserQuery);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchUser({ variables: { id: userId } }).then((data) => {
        if (data.data) {
          setProfile(data.data.user);
        }
        setIsLoading(false);
      });
      return;
    }
    if (isUserLoading) {
      return;
    }
    if (userError || !user?.sub) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchUser({ variables: { id: user.sub } }).then((data) => {
      if (data.data) {
        setProfile(data.data.user);
      }
      setIsLoading(false);
    });
  }, [fetchUser, isUserLoading, user?.sub, userError, userId]);

  if (profile) {
    return {
      loading: isLoading,
      ...profile,
      isMe: user?.sub === profile.id,
    } as const;
  }
  return { loading: isLoading } as const;
};
