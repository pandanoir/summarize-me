import {
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { FC } from 'react';

export const UserMenu: FC<{
  iconUrl: string;
  username: string;
  id: string;
}> = ({ iconUrl, username, id }) => (
  <Menu>
    <MenuButton>
      <Avatar ignoreFallback src={iconUrl} />
    </MenuButton>
    <MenuList>
      <MenuItem as="a" href={`/user/${id}`}>
        {username}
      </MenuItem>
      <MenuDivider />
      <MenuItem as="a" href="/setting">
        Setting
      </MenuItem>
      <MenuItem as="a" href="/api/auth/logout">
        Log out
      </MenuItem>
    </MenuList>
  </Menu>
);
