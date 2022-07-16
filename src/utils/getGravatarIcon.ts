import crypto from 'crypto';

const md5hex = (str: string) =>
  crypto.createHash('md5').update(str, 'binary').digest('hex');

export const getGravatarIcon = (email: string) =>
  `https://www.gravatar.com/avatar/${md5hex(email)}`;
