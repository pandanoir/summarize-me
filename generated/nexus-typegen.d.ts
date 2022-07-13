/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../graphql/context"
import type { core, connectionPluginCore } from "nexus"

declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName> & { totalCount: connectionPluginCore.ConnectionFieldResolver<TypeName, FieldName, "totalCount"> }
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Answer: { // root type
    authorId: string; // ID!
    challengeId: string; // ID!
    content: string; // String!
    id: string; // ID!
  }
  Challenge: { // root type
    authorId: string; // String!
    id: string; // ID!
    title: string; // String!
  }
  ChallengeConnection: { // root type
    edges: NexusGenRootTypes['ChallengeEdge'][]; // [ChallengeEdge!]!
    nodes: NexusGenRootTypes['Challenge'][]; // [Challenge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number; // Int!
  }
  ChallengeEdge: { // root type
    cursor: string; // String!
    node: NexusGenRootTypes['Challenge']; // Challenge!
  }
  Label: { // root type
    id: string; // ID!
    name: string; // String!
  }
  Like: { // root type
    id: string; // ID!
    userId: string; // String!
  }
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Query: {};
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Answer: { // field return type
    authorId: string; // ID!
    challengeId: string; // ID!
    content: string; // String!
    id: string; // ID!
    isLiked: boolean; // Boolean!
    likeCount: number; // Int!
  }
  Challenge: { // field return type
    answers: NexusGenRootTypes['Answer'][]; // [Answer!]!
    authorId: string; // String!
    id: string; // ID!
    labels: NexusGenRootTypes['Label'][]; // [Label!]!
    title: string; // String!
  }
  ChallengeConnection: { // field return type
    edges: NexusGenRootTypes['ChallengeEdge'][]; // [ChallengeEdge!]!
    nodes: NexusGenRootTypes['Challenge'][]; // [Challenge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number; // Int!
  }
  ChallengeEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Challenge']; // Challenge!
  }
  Label: { // field return type
    challenges: NexusGenRootTypes['Challenge'][]; // [Challenge!]!
    id: string; // ID!
    name: string; // String!
  }
  Like: { // field return type
    id: string; // ID!
    userId: string; // String!
  }
  Mutation: { // field return type
    createAnswer: NexusGenRootTypes['Answer']; // Answer!
    createChallenge: NexusGenRootTypes['Challenge']; // Challenge!
    createLabel: NexusGenRootTypes['Label']; // Label!
    createLike: NexusGenRootTypes['Like']; // Like!
    deleteLike: NexusGenRootTypes['Like']; // Like!
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    answers: Array<NexusGenRootTypes['Answer'] | null>; // [Answer]!
    challenge: NexusGenRootTypes['Challenge'] | null; // Challenge
    challenges: NexusGenRootTypes['ChallengeConnection']; // ChallengeConnection!
    label: NexusGenRootTypes['Label'] | null; // Label
    labels: NexusGenRootTypes['Label'][]; // [Label!]!
    likes: Array<NexusGenRootTypes['Like'] | null> | null; // [Like]
  }
}

export interface NexusGenFieldTypeNames {
  Answer: { // field return type name
    authorId: 'ID'
    challengeId: 'ID'
    content: 'String'
    id: 'ID'
    isLiked: 'Boolean'
    likeCount: 'Int'
  }
  Challenge: { // field return type name
    answers: 'Answer'
    authorId: 'String'
    id: 'ID'
    labels: 'Label'
    title: 'String'
  }
  ChallengeConnection: { // field return type name
    edges: 'ChallengeEdge'
    nodes: 'Challenge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  ChallengeEdge: { // field return type name
    cursor: 'String'
    node: 'Challenge'
  }
  Label: { // field return type name
    challenges: 'Challenge'
    id: 'ID'
    name: 'String'
  }
  Like: { // field return type name
    id: 'ID'
    userId: 'String'
  }
  Mutation: { // field return type name
    createAnswer: 'Answer'
    createChallenge: 'Challenge'
    createLabel: 'Label'
    createLike: 'Like'
    deleteLike: 'Like'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    answers: 'Answer'
    challenge: 'Challenge'
    challenges: 'ChallengeConnection'
    label: 'Label'
    labels: 'Label'
    likes: 'Like'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createAnswer: { // args
      challengeId: string; // ID!
      content: string; // String!
    }
    createChallenge: { // args
      labels?: string[] | null; // [String!]
      title: string; // String!
    }
    createLabel: { // args
      challengeId: string; // ID!
      name: string; // String!
    }
    createLike: { // args
      answerId: string; // ID!
    }
    deleteLike: { // args
      answerId: string; // ID!
    }
  }
  Query: {
    answers: { // args
      challengeId: string; // ID!
    }
    challenge: { // args
      id: string; // ID!
    }
    challenges: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
    label: { // args
      name: string; // String!
    }
    labels: { // args
      challengeId: string; // ID!
    }
    likes: { // args
      answerId: string; // ID!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}