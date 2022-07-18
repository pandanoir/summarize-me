import { HStack, Heading, Button, Fade, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UserMenu } from './UserMenu';

export const Header: FC = () => {
  const { loading, ...profile } = useProfile();
  return (
    <HStack justify="space-between" h="20" px="2">
      <Link href="/" _hover={{ textDecor: 'none' }}>
        <Heading>summarize me</Heading>
      </Link>
      <Fade in={!loading}>
        {'iconUrl' in profile ? (
          <UserMenu {...profile} />
        ) : (
          <Button as="a" href="/api/auth/login">
            Log in/Sign up
          </Button>
        )}
      </Fade>
    </HStack>
  );
};
