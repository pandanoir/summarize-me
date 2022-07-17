import { objectType } from 'nexus';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

export const Upload = GraphQLUpload;

export const UploadFile = objectType({
  name: 'UploadFile',
  definition(t) {
    t.string('uri');
    t.string('filename');
  },
});
