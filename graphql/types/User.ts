import {
  objectType,
  queryField,
  nonNull,
  idArg,
  mutationField,
  arg,
  stringArg,
} from 'nexus';
import S3 from 'aws-sdk/clients/s3';
import { extname } from 'path';
import { v4 } from 'uuid';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('username');
    t.nonNull.string('iconUrl');
  },
});

export const UserQuery = queryField('user', {
  type: 'User',
  args: {
    id: nonNull(idArg()),
  },
  resolve(_parent, { id }, ctx) {
    return ctx.prisma.user.findUnique({ where: { id } });
  },
});

export const UpdateProfileMutation = mutationField('updateProfile', {
  type: 'User',
  args: { newIcon: arg({ type: 'Upload' }), username: nonNull(stringArg()) },
  async resolve(_, { username, newIcon }, { user, prisma }) {
    console.log('called');

    if (!user) throw new Error(`You need to be logged in to perform an action`);

    if (newIcon) {
      const { createReadStream, filename } = await newIcon;
      await prisma.user.update({
        where: { id: user.user.sub },
        data: {
          username,
          iconUrl: await uploadFileToS3(createReadStream, filename),
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.user.sub },
        data: {
          username,
        },
      });
    }
    return prisma.user.findUnique({ where: { id: user.user.sub } });
  },
});

export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('id');
    t.string('path');
    t.string('filename');
    t.string('mimetype');
    t.string('encoding');
  },
});
export const uploadFileToS3 = async (createReadStream: any, filename: any) => {
  const s3 = new S3({
    region: 'ap-northeast-1',
    apiVersion: '2006-03-01',
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  });
  const data = await s3
    .upload({
      Body: createReadStream(),
      Key: `${v4()}${extname(filename)}`,
      Bucket: process.env.MY_S3_BUCKET!,
    })
    .promise();
  return data.Location;
};
