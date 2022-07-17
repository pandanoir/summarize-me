import { Menu, MenuButton, Avatar, MenuList, MenuItem } from '@chakra-ui/react';
import { FC } from 'react';

export const UserMenu: FC<{ iconUrl: string }> = ({ iconUrl }) => (
  <Menu>
    <MenuButton>
      <Avatar src={iconUrl} />
    </MenuButton>
    <MenuList>
      <MenuItem as="a" href="/setting">
        Setting
      </MenuItem>
      <MenuItem as="a" href="/api/auth/logout">
        Log out
      </MenuItem>
    </MenuList>
  </Menu>
);
